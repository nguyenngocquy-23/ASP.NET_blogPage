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
    public class WeatherForecastController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WeatherForecastController(AppDbContext context)
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
        public async Task<ActionResult<StudentDetail>> Get(int id)
        {
            var forecast = await _context.Students.FindAsync(id);
            if (forecast == null)
            {
                return NotFound();
            }
            return forecast;
        }

        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<StudentDetail>>> FilterStudents(int age)
        {
            var students = await _context.Students
                .Where(s => s.Age > age)
                .Select(s => new StudentDetail
                {
                    Id = s.Id,
                    Name = s.Name,
                    Age = s.Age
                })
                .ToListAsync();

            return students;
        }

        [HttpPost]
        public async Task<ActionResult<StudentDetail>> Post(StudentDetail student)
        {
            if (student == null)
            {
                return BadRequest("Student data is null.");
            }

            // Thêm sinh viên vào DbContext
            await _context.Students.AddAsync(student);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Trả về kết quả với mã trạng thái HTTP 201 (Created) và thông tin sinh viên vừa thêm
            return CreatedAtAction(nameof(Get), new { id = student.Id }, student);
        }
    }
}
