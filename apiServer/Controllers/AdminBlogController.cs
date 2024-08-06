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
                    Credential = GoogleCredential.FromFile("D:\\DoanDotNet\\apiServer\\path\\firebase\\webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json")
                });
            }

            // Cấu hình Google Cloud Storage Client với thông tin xác thực
            var credential = GoogleCredential.FromFile("D:\\DoanDotNet\\apiServer\\path\\firebase\\webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json");
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
            var urlSigner = UrlSigner.FromServiceAccountPath("D:\\DoanDotNet\\apiServer\\path\\firebase\\webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json");
            var expiration = TimeSpan.FromMinutes(10); // URL sẽ hết hạn sau 10 phút
            var url = urlSigner.Sign(_bucketName, objectName, expiration, HttpMethod.Put);

            return Ok(new { Url = url, ObjectName = objectName });
        }

        [HttpPost("createBlog")]
        public async Task<ActionResult<bool>> create(Blog blog)
        {
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

            _context.Blog.Update(existingBlog);
            await _context.SaveChangesAsync();

            return Ok(true);
        }


        [HttpGet("{blogId}")]
        public async Task<ActionResult<Blog>> Get(int blogId)
        {
            var blog = await _context.Blog.FindAsync(blogId);
            if (blog == null)
            {
                return NotFound();
            }
            return blog;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
        {
            var blogs = await _context.Blog.ToListAsync();
            return Ok(blogs);
        }
    }
}
