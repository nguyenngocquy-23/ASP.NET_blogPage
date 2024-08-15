using apiServer.Data;
using apiServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apiServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DashBoardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashBoardController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("contact")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetBlogAll()
        {
            return await _context.Contact.ToListAsync();
        }

    }
}