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
    public class CategoryCotroller : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryCotroller(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("category")]
        public async Task<ActionResult<IEnumerable<Category>>> getAllCategories()
        {
        
            var categories = await _context.Category.ToListAsync();
            return Ok(categories);
        }
        
        [HttpPost("category/{id}")]
        public async Task<ActionResult<string>> getNameCategoryById(int id)
        {
            var category = await _context.Category.FindAsync(id);
            if (category == null) { 
                return BadRequest("id khong ton tai");
            }
            return category.Name;
        }


        [HttpGet("category")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogByCategories([FromQuery] int id, [FromQuery] int page, int limit)
        {
            var skip = (page - 1) * limit;
            var blogs =  await _context.Blog.Where(blog => blog.CategoryId == id).Skip(skip).Take(limit).ToListAsync();
            return Ok(blogs);
        }

        [HttpGet("delete")]
        public async Task<ActionResult<IEnumerable<bool>>> deleteCategoryById([FromQuery] int id)
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

            var category = await _context.Category.FindAsync(id);
            if (category != null)
            {
                _context.Category.Remove(category);
                await _context.Blog
                .Where(blog => blog.CategoryId == id)
                .ExecuteUpdateAsync(blog => blog.SetProperty(b => b.CategoryId, 0));
                await _context.SaveChangesAsync();
                return Ok(true);
            }
            return Ok(false);
        }

        [HttpGet("add")]
        public async Task<ActionResult<IEnumerable<bool>>> addCategory([FromQuery] string nameCategory)
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

            if (string.IsNullOrEmpty(nameCategory))
            {
                return BadRequest("nameCategory là r?ng"); 
            } 
            try
            {
                bool exists = await _context.Category.AnyAsync(category => category.Name == nameCategory);
                if (!exists)
                {
                    var newCategory = new Category
                    {
                        Name = nameCategory
                    };
                    _context.Category.Add(newCategory);
                    await _context.SaveChangesAsync();
                    return Ok(true);
                } else
                {
                    return BadRequest("NameCategory bị trùng");
                }
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
