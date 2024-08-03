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
    public class PaginationCotroller : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaginationCotroller(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("blog")]
        public async Task<ActionResult<Blog>> pagination([FromQuery] string page)
        {
            if (string.IsNullOrEmpty(page))
            {
                return base.BadRequest("Query là rỗng");
            }
            int limit = 5;
            int page_n = int.Parse(page);
            var skip = (page_n - 1) * limit;
            var blogs = await _context.Blog.Skip(skip).Take(limit).ToListAsync();
            return Ok(blogs);
        }
    }
}