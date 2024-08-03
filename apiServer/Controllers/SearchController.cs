using apiServer.Data;
using apiServer.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace apiServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SearchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public async Task<ActionResult<Blog>> SearchBlogs([FromQuery] string content)
        {
            if (string.IsNullOrEmpty(content))
            {
                return base.BadRequest("Query là rỗng");
            }

            var blogs = await _context.Blog.Where(blog => blog.Content.Contains(content)).ToListAsync();
            return Ok(blogs);
        }
    }
}