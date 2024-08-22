using apiServer.Data;
using apiServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using System.Xml.Linq;
using apiServer.DTO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Security.Claims;

namespace apiServer.Controllers
{
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    [Route("[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }

      
        [HttpGet("profile/{userId}")]
        public async Task<ActionResult<IEnumerable<AuthBlogDTO>>> GetBlogsByUserId(int userId, int page = 1, int pageSize = 3, string sortOrder = "newest")
        {
            var blogsQuery = _context.Blog
                .Where(b => b.AuthId == userId && b.Status == 1) // Lọc bài viết của người dùng với status = 1
                .Join(_context.Category,
                    blog => blog.CategoryId,
                    category => category.Id,
                    (blog, category) => new
                    {
                        Blog = blog,
                        CategoryName = category.Name // Lấy tên danh mục từ bảng Category
                    })
                .Join(_context.User,
                    blogCategory => blogCategory.Blog.AuthId,
                    user => user.Id,
                    (blogCategory, user) => new AuthBlogDTO
                    {
                        Id = blogCategory.Blog.Id,
                        Title = blogCategory.Blog.Title,
                        ShortDescription = blogCategory.Blog.ShortDescription,
                        Image = blogCategory.Blog.Image,
                        CreatedAt = blogCategory.Blog.UpdatedAt ?? blogCategory.Blog.CreatedAt, // Nếu UpdatedAt là null thì lấy CreatedAt
                        AuthName = user.FullName, // Lấy tên tác giả từ bảng User
                        CategoryName = blogCategory.CategoryName, // Lấy tên danh mục từ bảng Category
                        TotalLike = _context.Like.Count(l => l.BlogId == blogCategory.Blog.Id), // Tính tổng số lượt like
                        TotalComment = _context.Comment.Count(c => c.BlogId == blogCategory.Blog.Id && c.Status != 0) // Tính tổng số comment (trừ đã xóa đi)
                    }
                );

            // Sắp xếp : mới nhất, cũ nhất, nhiều lượt react (like + comment).
            switch (sortOrder.ToLower())
            {
                case "newest":
                    blogsQuery = blogsQuery.OrderByDescending(b => b.CreatedAt);
                    break;
                case "oldest":
                    blogsQuery = blogsQuery.OrderBy(b => b.CreatedAt);
                    break;
                case "mostreact":
                    blogsQuery = blogsQuery.OrderByDescending(b => b.TotalLike + b.TotalComment);
                    break;
                default:
                    blogsQuery = blogsQuery.OrderByDescending(b => b.CreatedAt);
                    break;
            }

            // Phân trang: chỉ lấy số lượng bài viết của trang hiện tại
            var res = await blogsQuery
                .Skip((page - 1) * pageSize) // Bỏ qua các bài viết của các trang trước
                .Take(pageSize) // Lấy số lượng bài viết của trang hiện tại
                .ToListAsync();

            return Ok(res); // Trả về danh sách đã phân trang
        }
        [HttpPost("getAllBlogs")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogsDisplayHome()
        {
            var blogs = await _context.Blog.Where(blog => blog.Status == 1).OrderByDescending(blog => blog.CreatedAt).Take(9).ToListAsync();
            return Ok(blogs);
        }

        [HttpPost("getBlogById")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogById([FromQuery] int id) 
        {
            var blog = await _context.Blog.Where(blog => blog.Id == id && blog.Status == 1).ToListAsync();
            return Ok(blog);

        }

        [HttpPost("updateIdCategory")]
        public async Task<ActionResult<IEnumerable<int>>> updateIdCategory([FromQuery] int idCategory)
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

            var blogs = await _context.Blog.Where(blog => blog.CategoryId == idCategory).ToListAsync();
            if (blogs == null || blogs.Count == 0)
            {
                return Ok(0);
            } else
            {
                foreach (var blog in blogs)
                {
                    blog.CategoryId = 0;
                    _context.Blog.Update(blog);
                }
                await _context.SaveChangesAsync();
                return Ok(blogs.Count);
            }
        }


        [HttpPost("getBlogRelate")]
        public async Task<ActionResult<IEnumerable<Blog>>> getBlogRelate([FromQuery] int categoryId, int blogId)
        {
            var blogs = await _context.Blog.Where(blog => blog.Status == 1 && blog.CategoryId == categoryId && blog.Id != blogId).
                OrderBy(blog => EF.Functions.Random()).Take(5).ToListAsync();

            return Ok(blogs);
        }
    }

}
