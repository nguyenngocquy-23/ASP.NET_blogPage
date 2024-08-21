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
    public class PaginationCotroller : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaginationCotroller(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("paginationSearch")]
        public async Task<ActionResult<IEnumerable<int>>> totalPageSearchBlogs([FromQuery] string content, int limit)
        {
            if (string.IsNullOrEmpty(content))
            {
                return BadRequest("Query là rỗng");
            }
            var totalCount = await _context.Blog
                .Where(blog => blog.Title.Contains(content))
                .CountAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / limit);

            return Ok(totalPages);

        }

        [HttpPost("paginationBlogsByCategory")]
        public async Task<ActionResult<IEnumerable<int>>> totalPageBlogsByCategory([FromQuery] int id, int limit)
        {
            var totalCount = await _context.Blog
                .Where(blog => blog.CategoryId == id)
                .CountAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / limit);

            return Ok(totalPages);

        }
    }

}

