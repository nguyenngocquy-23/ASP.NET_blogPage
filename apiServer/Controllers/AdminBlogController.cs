using apiServer.Data;
using apiServer.DTO;
using apiServer.Models;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace apiServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    public class AdminBlogController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly StorageClient _storageClient;
        private readonly string _bucketName;
        public AdminBlogController(AppDbContext context)
        {
            //dotnet add package FirebaseAdmin
            // Kiểm tra và chỉ khởi tạo FirebaseApp nếu nó chưa tồn tại
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile("../apiServer/path/firebase/webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json")
                });
            }

            // Cấu hình Google Cloud Storage Client với thông tin xác thực
            var credential = GoogleCredential.FromFile("../apiServer/path/firebase/webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json");
            _storageClient = StorageClient.Create(credential);
            /*_storageClient = StorageClient.Create();*/
            _bucketName = "webblog-6eee4.appspot.com";

            _context = context;
        }

        //Cho phép client tải lên tệp mà không cần phải xử lý quyền truy cập trực tiếp
        [HttpGet("generatePresignedUrl")]
        public IActionResult GeneratePresignedUrl()
        {
            var objectName = Guid.NewGuid().ToString();
            var urlSigner = UrlSigner.FromServiceAccountPath("../apiServer/path/firebase/webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json");
            var expiration = TimeSpan.FromMinutes(10); // URL sẽ hết hạn sau 10 phút
            var url = urlSigner.Sign(_bucketName, objectName, expiration, HttpMethod.Put);

            return Ok(new { Url = url, ObjectName = objectName });
        }

        [HttpPost("createBlog")]
        public async Task<ActionResult<bool>> create(Blog blog)
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

            if (blog == null)
            {
                return BadRequest("Blog data is null.");
            }

            await _context.Blog.AddAsync(blog);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { blogId = blog.Id }, blog);
        }

        [HttpPost("updateBlog")]
        public async Task<ActionResult<bool>> update(BlogDetailDTO blogDTO)
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

            if (blogDTO == null)
            {
                return BadRequest("blog không tồn tại.");
            }

            var existingBlog = await _context.Blog.FindAsync(blogDTO.Id);
            if (existingBlog == null)
            {
                return NotFound($"blog với ID {blogDTO.Id} không tồn tại.");
            }

            existingBlog.CategoryId = blogDTO.CategoryId;
            existingBlog.Title = blogDTO.Title;
            existingBlog.Image = blogDTO.Image;
            existingBlog.Content = blogDTO.Content;
            existingBlog.Status = blogDTO.Status;
            existingBlog.ShortDescription = blogDTO.ShortDescription;

            _context.Blog.Update(existingBlog);
            await _context.SaveChangesAsync();

            return Ok(true);
        }


        [HttpGet("{blogId}")]
        public async Task<ActionResult<Blog>> Get(int blogId)
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

            var blog = await _context.Blog.FindAsync(blogId);
            if (blog == null)
            {
                return NotFound();
            }
            return blog;
        }

        // lấy danh sách bài viết theo thể loại
        [HttpGet("the-loai/{categoryName}")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetByCategory(string categoryName)
        {
            var category = await _context.Category.Where(c => c.Name == categoryName).Select(c => new { c.Id }).FirstOrDefaultAsync();
            var blogs = await _context.Blog
               .Where(b => b.CategoryId == category.Id)
               .Select(b => new Blog
               {
                   Id = b.Id,
                   AuthId = b.AuthId,
                   Title = b.Title,
                   Image = b.Image,
                   ShortDescription = b.ShortDescription,
                   NumLike = b.NumLike
               })
               .ToListAsync();

            return blogs;
            if (blogs == null)
            {
                return NotFound();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
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

            var blogs = await _context.Blog
                              .OrderByDescending(b => b.CreatedAt)
                              .ToListAsync();
            return Ok(blogs);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var blog = await _context.Blog.FindAsync(id);
                if (blog == null)
                {
                    return NotFound(); // Trả về mã 404 nếu không tìm thấy bài viết
                }

                _context.Blog.Remove(blog);
                await _context.SaveChangesAsync();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
