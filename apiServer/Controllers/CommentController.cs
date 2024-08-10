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
                    UserId = user.FullName,
                    Content = comment.Content,
                    CreatedAt = comment.CreatedAt
                }
                )
                
                .ToListAsync();
            return Ok(comments);
        }

        // Post comment.
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            if(comment == null)

            {
                return BadRequest("Comment data is null!");



            }        
            await _context.Comment.AddAsync(comment); 
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommentsByBlogId), new { blogId = comment.BlogId }, comment);

        }





    }
}
