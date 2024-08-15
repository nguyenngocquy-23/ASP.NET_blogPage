using apiServer.Data;
using apiServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace apiServer.Controllers
{
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SearchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<Blog>>> SearchBlogs([FromQuery] string content, [FromQuery] int page, int limit
            , [FromQuery] string? filter)
        {
            if (string.IsNullOrEmpty(content))
            {
                return BadRequest("Query là rỗng");
            }
            var skip = (page - 1) * limit;
            var query = _context.Blog.Where(blog => blog.Content.Contains(content));

            if (!string.IsNullOrEmpty(filter))
            {
                if (filter.Equals("moi-nhat"))
                {
                    query = query.OrderByDescending(blog => blog.CreatedAt);
                } else
                {
                    query = query.OrderBy(blog => blog.CreatedAt);
                }
            }
            var blogs = await query
                        .Skip(skip)
                        .Take(limit)
                        .ToListAsync();
            return Ok(blogs);
        }
    }
        
}
