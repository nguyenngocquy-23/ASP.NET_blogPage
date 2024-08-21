using apiServer.Data;
using apiServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using System.Xml.Linq;
using System.Security.Claims;

namespace apiServer.Controllers
{
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    [Route("[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("getAllBlogs")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogsDisplayHome()
        {
            var blogs = await _context.Blog.OrderByDescending(blog => blog.UpdatedAt).Take(9).ToListAsync();
            return Ok(blogs);
        }

        [HttpPost("getBlogById")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogById([FromQuery] int id) 
        {
            var blog = await _context.Blog.Where(blog => blog.Id == id).ToListAsync();
            return Ok(blog);

        }

        [HttpPost("updateIdCategory")]
        public async Task<ActionResult<IEnumerable<int>>> updateIdCategory([FromQuery] int idCategory)
        {
            var userNameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (userNameClaim == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Không có quyền hạn");
            }

            var userName = userNameClaim.Value;
            User adminUser = await _context.User.FirstOrDefaultAsync(u => u.Username == userName);
            if (adminUser == null || adminUser.Role == 1)
                return StatusCode(StatusCodes.Status403Forbidden, "Không có quyền hạn");

            var blogs = await _context.Blog.Where(blog => blog.CategoryId == idCategory).ToListAsync();
            if (blogs == null || blogs.Count == 0)
            {
                return Ok(0);
            } else
            {
                foreach (var blog in blogs)
                {
                    blog.CategoryId = 0;
                    _context.Blog.Update(blog);
                }
                await _context.SaveChangesAsync();
                return Ok(blogs.Count);
            }
        }

    }

}
