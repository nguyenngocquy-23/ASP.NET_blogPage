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
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("getCategories")]
        public async Task<ActionResult<IEnumerable<Category>>> getAllCategories()
        {
            var categories = await _context.Category.ToListAsync();
            return Ok(categories);
        }
    }

}

