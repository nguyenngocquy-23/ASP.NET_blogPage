using apiServer.Data;
using apiServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using System.Xml.Linq;

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

        [HttpGet("category")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogByCategories([FromQuery] int id, [FromQuery] int page, int limit)
        {
            var skip = (page - 1) * limit;
            var blogs =  await _context.Blog.Where(blog => blog.CategoryId == id).Skip(skip).Take(limit).ToListAsync();
            return Ok(blogs);
        }

        [HttpGet("delete")]
        public async Task<ActionResult<IEnumerable<Category>>> deleteCategoryById([FromQuery] int id)
        { 
            var category = await _context.Category.Where(category => category.Id == id).ToListAsync();
            return Ok(category);
        }

        [HttpGet("add")]
        public async Task<ActionResult<IEnumerable<bool>>> addCategory([FromQuery] string nameCategory)
        {   
            if (string.IsNullOrEmpty(nameCategory))
            {
                return BadRequest("nameCategory là rỗng"); 
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
