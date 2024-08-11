using apiServer.Data;
using apiServer.DTO;
using apiServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apiServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context) { _context = context; }


        //GET: Lấy comment theo từng blog : /comment/{blogId}.
        [HttpGet("{blogId}")]
        public async Task<ActionResult<IEnumerable<DTO.CommentDTO>>> GetCommentsByBlogId(int blogId)
        {
            var comments = await _context.Comment
                .Where(c => c.BlogId == blogId)
                .Join(_context.User,
                comment => comment.UserId,
                user => user.Id,
                (comment, user) => new CommentDTO

                {
                    ID = comment.Id,
                    UserId = comment.UserId,
                    Role = user.Role,
                    UserName = user.FullName,
                    Status = comment.Status,
                    Content = comment.Content,
                    CreatedAt = comment.CreatedAt,
                    ParentId = comment.ParentId
                }
                )
                
                .ToListAsync();
            return Ok(comments);
        }

        // Post comment.
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            if(comment == null || string.IsNullOrWhiteSpace(comment.Content))

            {
                return BadRequest("Bạn không thể để trống comment!");

            }        
            await _context.Comment.AddAsync(comment); 
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommentsByBlogId), new { blogId = comment.BlogId }, comment);

        }

        /// Chỉnh sửa bình luận - Chỉ tác giả mới có quyền chỉnh sửa bình luận. 
        /// => Khi tác giả chỉnh sửa bình luận, sẽ có thêm label [Đã chỉnh sửa] ở bên cạnh !!/ <summary>
        /// Chỉnh sửa bình luận - Chỉ tác giả mới có quyền chỉnh sửa bình luận. 
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult> PutComment(int id, [FromBody] ContentCommentDTO request)
        {
            if(string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest("Nội dung bình luận không để trống!");
            }    

            var comment = await _context.Comment.FindAsync(id); 
            if(comment==null)
            {
                return NotFound("Bình luận không tồn tại");
            }

            //Cập nhật bình luận và trạng thái.
            comment.Content = request.Content;
            comment.Status = 2;

            _context.Comment.Update(comment);
            await _context.SaveChangesAsync();

            return Ok("Cập nhật bình luận thành công!");
        }







        ///Logic : Nếu role = 1 (User) việc thực hiện delete sẽ chuyển status từ 1 (hiển thị) sang 0 (ẩn).
        ///Nếu role = 0 (Admin) việc thực hiện delete sẽ xóa trực tiếp comment trong database luôn !.
        ///


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comment.FindAsync(id);
            if(comment == null)
                return NotFound("Comment không tồn tại.");
            var userRole = GetCurrentUserRole();

            if(userRole == 0)
            {
                // xóa hoàn toàn khỏi db.
                _context.Comment.Remove(comment);

                // xóa comment cha đồng nghĩa với việc các comment con cũng bị xóa theo !.
                var childComments = await _context.Comment.Where(c => c.ParentId == id).ToListAsync();
                _context.Comment.RemoveRange(childComments);


            }
            else
            {
                comment.Status = 0;
                _context.Comment.Update(comment);

                //chuyển status của con nếu có.
                var childComments = await _context.Comment.Where(c => c.ParentId == id).ToListAsync();
                foreach (var childComment in childComments)
                {
                    childComment.Status = 0;
                    _context.Comment.Update(childComment);
                }


            }

            await _context.SaveChangesAsync();
            return Ok("Xóa bình luận thành công!");



        }

        /// Lấy ra role của users phục vụ cho việc get và delete.
        /// Giả sử 1.
        private int GetCurrentUserRole()
        {
            return 1;
        }



    }
}
