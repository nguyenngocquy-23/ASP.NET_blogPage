using apiServer.Data;
using apiServer.DTO;
using apiServer.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace apiServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    public class AdminBlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminBlogController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("createBlog")]
        public async Task<ActionResult<bool>> createBlog(Blog blog)
        {
            if (blog == null)
            {
                return BadRequest("Blog data is null.");
            }

            await _context.Blog.AddAsync(blog);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = blog.Id }, blog);
        }

        [HttpPost("updateBlog")]
        public async Task<ActionResult<bool>> UpdateBlog(BlogDetailDTO blogDTO)
        {
            if (blogDTO == null)
            {
                return BadRequest("blog không tồn tại.");
            }

            var existingBlog = await _context.Blog.FindAsync(blogDTO.Id);
            if (existingBlog == null)
            {
                return NotFound($"blog với ID {blogDTO.Id} không tồn tại.");
            }

            existingBlog.CategoryId = blogDTO.CategoryId;
            existingBlog.Title = blogDTO.Title;
            existingBlog.Image = blogDTO.Image;
            existingBlog.Content = blogDTO.Content;
            existingBlog.Status = blogDTO.Status;

            _context.Blog.Update(existingBlog);
            await _context.SaveChangesAsync();

            return Ok(true);
        }


        [HttpGet("{blogId}")]
        public async Task<ActionResult<Blog>> Get(int blogId)
        {
            var blog = await _context.Blog.FindAsync(blogId);
            if (blog == null)
            {
                return NotFound();
            }
            return blog;
        }
    }
}
