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
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

       /* [HttpGet]
        public async Task<IEnumerable<StudentDetail>> Get()
        {
            var forecasts = await _context.Students.ToListAsync();
            return forecasts;
        }*/

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var forecast = await _context.User.FindAsync(id);
            if (forecast == null)
            {
                return NotFound();
            }
            return forecast;
        }

        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<User>>> FilterStudents(int status)
        {
            var users = await _context.User
                .Where(u => u.Status == status)
                .Select(u => new User
                {
                    Id = u.Id,
                    FullName = u.FullName,
                })
                .ToListAsync();

            return users;
        }

        [HttpPost]
        public async Task<ActionResult<User>> Post(User user)
        {
            if (user == null)
            {
                return BadRequest("User data is null.");
            }

            // Thêm sinh viên vào DbContext
            await _context.User.AddAsync(user);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Trả về kết quả với mã trạng thái HTTP 201 (Created) và thông tin sinh viên vừa thêm
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }
    }
}
