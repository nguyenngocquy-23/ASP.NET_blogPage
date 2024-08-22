using apiServer.Data;
using apiServer.DTO;
using apiServer.Models;
using apiServer.services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using System.Reflection.Metadata;

namespace apiServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context) { _context = context; }


        //GET: Lấy comment theo từng blog : /comment/{blogId}.
        // Hỗ trợ phân trang cho phần hiển thị comment.
        [HttpGet("{blogId}")]
        public async Task<ActionResult<IEnumerable<DTO.CommentDTO>>> GetCommentsByBlogId(int blogId, int page=1, int pageSize=10)
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
                .OrderByDescending( c => c.CreatedAt )
                .Skip((page -1) * pageSize) 
                .Take( pageSize )
                .ToListAsync();
            return Ok(comments);
        }

        /// <summary>
        /// Dành cho việc quản lý comment theo từng blog.
        /// </summary>
        /// <param name="comment"></param>
        /// <returns></returns>
        [HttpGet("manager")]
        public async Task<ActionResult<CommentManageDTO>> getCommentManage()
        {

            var blogList = await _context.Blog.Select(blog => new CommentManageDTO
            {
                BlogId = blog.Id,
                BlogTitle = blog.Title,
                TotalComment =  _context.Comment.Count(c => c.BlogId == blog.Id),
                RemoveComment = _context.Comment.Count(c => c.BlogId == blog.Id && c.Status == 0),
                PendingComment =  _context.Comment.Count(c => c.BlogId == blog.Id && c.Status == 2),
                NumLike = _context.Like.Count(c => c.BlogId == blog.Id),

            }).ToListAsync();
            return Ok(blogList);

        }



        // Post comment.
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            if(comment == null || string.IsNullOrWhiteSpace(comment.Content))

            {
                return BadRequest("Bạn không thể để trống comment!");

            }

            var user = await _context.User.FindAsync(comment.UserId);

            await _context.Comment.AddAsync(comment); 
            await _context.SaveChangesAsync();

            var commentDTO = new CommentDTO
            {
                ID = comment.Id,
                UserId = comment.UserId,
                Role = user.Role,
                UserName = user.FullName,
                Status = comment.Status,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                ParentId = comment.ParentId
            };


            return CreatedAtAction(nameof(GetCommentsByBlogId), new { blogId = comment.BlogId }, commentDTO);

        }








        /// Chỉnh sửa bình luận - Chỉ tác giả mới có quyền chỉnh sửa bình luận. 
        /// / <summary>
        /// Gửi lên gồm có content và status. 
        /// Sẽ sử dụng nó cho cả 2 mục đích:
        ///  Nếu chỉnh sửa bình luận => Sửa text và status. 
        ///  Nếu xóa bình luận => Sửa status và giữ nguyên t
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult> PutComment(int id, [FromBody] ContentCommentDTO request)
        {
            //if(string.IsNullOrWhiteSpace(request.Content))
            //{
            //    return BadRequest("Nội dung bình luận không để trống!");
            //}    

            var comment = await _context.Comment.FindAsync(id); 
            if(comment==null)
            {
                return NotFound("Bình luận không tồn tại");
            }

            // Cập nhật nội dung nếu có
            if (!string.IsNullOrWhiteSpace(request.Content))
            {
                comment.Content = request.Content;
            }

            //Cập nhật bình luận và trạng thái.
            //comment.Content = request.Content;
            comment.Status = request.Status;

            _context.Comment.Update(comment);
            await _context.SaveChangesAsync();

            // Kiểm tra nếu bình luận bị xóa status =0
            if (request.Status == 0)
            {
                // Lấy thông tin người dùng từ bảng User
                var user = await _context.User.FindAsync(comment.UserId);
                var blog = await _context.Blog.FindAsync(comment.BlogId);
                if (user != null)
                {
                    // Tạo nội dung email
                    var mailContent = new MailContent
                    {
                        To = user.Email, // Địa chỉ email người dùng
                        Subject = "Thông Báo: Bình Luận Của Bạn Đã Bị Xóa do vi phạm tiêu chuẩn của chúng tôi.",
                        Body = $"<p>Chào {user.FullName},</p>" +
                               $"<p>Bình luận của bạn tại {blog.Title} đã bị xóa bởi quản trị viên vì vi phạm chính sách của chúng tôi.</p>" +
                               "<p>Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ thông qua blog chính thức chúng tôi.</p>"
                    };

                    // Gửi email thông báo
                    var emailResult = await MailService.SendMail(mailContent);

                    if (emailResult != "send Email successful")
                    {
                        return StatusCode(500, "Cập nhật bình luận thành công nhưng gửi email thất bại.");
                    }
                }

            }



                return Ok("Cập nhật bình luận thành công!");
        }

        // KIểm duyệt toàn bộ bình luận.
        [HttpPut("reviews/{blogId}")]
        public async Task<IActionResult> ApproveComments(int blogId)
        {
            // Lấy comment có blogId cho trước và status =2.
            var pendingComment = await _context.Comment.Where(c => c.BlogId == blogId && c.Status == 2).ToListAsync();

            // Nếu không có bình luận nào để duyệt.
            if (!pendingComment.Any()) return NotFound("Không có bình luận cần kiểm duyệt");

            foreach (var comment in pendingComment)
            {
                comment.Status = 1;
            }

            //lưu vào csdl
            await _context.SaveChangesAsync();
            return Ok("Duyệt bình luận thành công.");
        }


        ///Logic : Nếu role = 1 (User) việc thực hiện delete sẽ chuyển status từ 1 (hiển thị) sang 0 (ẩn).
        ///Nếu role = 0 (Admin) việc thực hiện delete sẽ xóa trực tiếp comment trong database luôn !.
        ///


        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteComment(int id)
        //{
        //    var comment = await _context.Comment.FindAsync(id);
        //    if(comment == null)
        //        return NotFound("Comment không tồn tại.");
        //    var userRole = GetCurrentUserRole();

        //    if(userRole == 0)
        //    {
        //        // xóa hoàn toàn khỏi db.
        //        _context.Comment.Remove(comment);

        //        // xóa comment cha đồng nghĩa với việc các comment con cũng bị xóa theo !.
        //        var childComments = await _context.Comment.Where(c => c.ParentId == id).ToListAsync();
        //        _context.Comment.RemoveRange(childComments);


        //    }
        //    else
        //    {
        //        comment.Status = 0;
        //        _context.Comment.Update(comment);

        //        //chuyển status của con nếu có.
        //        var childComments = await _context.Comment.Where(c => c.ParentId == id).ToListAsync();
        //        foreach (var childComment in childComments)
        //        {
        //            childComment.Status = 0;
        //            _context.Comment.Update(childComment);
        //        }


        //    }

        //    await _context.SaveChangesAsync();
        //    return Ok("Xóa bình luận thành công!");



        //}

        ///// Lấy ra role của users phục vụ cho việc get và delete.
        ///// Giả sử 1.
        //private int GetCurrentUserRole()
        //{
        //    return 1;
        //}



    }
}
