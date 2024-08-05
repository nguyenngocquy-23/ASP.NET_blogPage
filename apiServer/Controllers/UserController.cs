using apiServer.Data;
using apiServer.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Builder.Extensions;
using System.Runtime.InteropServices;

namespace apiServer.Controllers
{
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("updateInf")]
        public async Task<ActionResult<bool>> UpdateUser(User User)
        {
            if (User == null)
            {
                return BadRequest("User không tồn tại.");
            }

            var existingUser = await _context.User.FindAsync(User.Id);
            if (existingUser == null)
            {
                return NotFound($"User với ID {User.Id} không tồn tại.");
            }

            existingUser.Username = User.Username;
            existingUser.Password = User.Password;
            existingUser.FullName = User.FullName;
            existingUser.Email = User.Email;
            existingUser.PhoneNumber = User.PhoneNumber;
            existingUser.Role = User.Role;
            existingUser.Status = User.Status;
            existingUser.CreatedAt = User.CreatedAt;

            _context.User.Update(existingUser);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        [HttpPost("updatePass")]
        public async Task<ActionResult<bool>> UpdateUser(int id, string newPassword)
        {
            var User = await _context.User.FindAsync(id);
            if (User == null)
            {
                return NotFound($"User with ID {id} does not exist.");
            }

            // Cập nhật mật khẩu mới cho người dùng
            User.Password = newPassword;

            _context.User.Update(User);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

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
            var Users = await _context.User
                .Where(u => u.Status == status)
                .Select(u => new User
                {
                    Id = u.Id,
                    FullName = u.FullName,
                })
                .ToListAsync();

            return Users;
        }

        [HttpPost]
        public async Task<ActionResult<User>> Post(User User)
        {
            if (User == null)
            {
                return BadRequest("User data is null.");
            }

            // Thêm sinh viên vào DbContext
            await _context.User.AddAsync(User);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Trả về kết quả với mã trạng thái HTTP 201 (Created) và thông tin sinh viên vừa thêm
            return CreatedAtAction(nameof(Get), new { id = User.Id }, User);
        }
    }
}
