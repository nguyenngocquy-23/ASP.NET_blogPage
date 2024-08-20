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
        [HttpGet("TotalBlog")]
        public async Task<ActionResult<int>> TotalBlog()
        {
            int blogAll = await _context.Blog.CountAsync();
            return Ok(blogAll);
        }
        //Số bài viết trong tháng
        [HttpGet("BlogInMonth")]
        public async Task<ActionResult<int>> BlogInMonth()
        {
            int countBlog = await _context.Blog.Where(p => p.CreatedAt.Year ==  DateTime.Now.Year && p.CreatedAt.Month == DateTime.Now.Month).CountAsync();
            return Ok(countBlog);
        }
        //Số người truy cập trong tháng
        [HttpGet("UserInMonth")]
        public async Task<ActionResult<int>> UserInMonth()
        {
            int countBlog = await _context.User.Where(p => p.CreatedAt.Year == DateTime.Now.Year && p.CreatedAt.Month == DateTime.Now.Month && p.Role == 1).CountAsync();
            return Ok(countBlog);
        }
        //Tổng số Liên Hệ gửi về trong tháng
        [HttpGet("ContactInMonth")]
        public async Task<ActionResult<int>> ContactInMonth()
        {
            int countBlog = await _context.Contact.Where(p => p.CreatedAt.Year == DateTime.Now.Year && p.CreatedAt.Month == DateTime.Now.Month).CountAsync();
            return Ok(countBlog);
        }
        //Tổng số bài viết trong ngày
        [HttpGet("BlogInDay")]
        public async Task<ActionResult<int>> BlogInDay()
        {
            int countBlog = await _context.Blog.Where(p => p.CreatedAt.Year == DateTime.Now.Year && p.CreatedAt.Month == DateTime.Now.Month && p.CreatedAt.Date == DateTime.Now.Date).CountAsync();
            return Ok(countBlog);
        }
        //Tổng số người dùng mới trong ngày
        [HttpGet("UserInDay")]
        public async Task<ActionResult<int>> UserInDay()
        {
            int countBlog = await _context.User.Where(p => p.CreatedAt.Year == DateTime.Now.Year && p.CreatedAt.Month == DateTime.Now.Month && p.CreatedAt.Date == DateTime.Now.Date && p.Role == 1).CountAsync();
            return Ok(countBlog);
        }
        //Top 5 bài viết yêu thích  nhất(lượt like)
        [HttpGet("TopBlog")]
        public async Task<ActionResult<IEnumerable<Blog>>> Topblog()
        {
            var top5Blogs = _context.Blog
                               .OrderByDescending(b => b.NumLike)
                               .Take(5)
                               .ToList();

            return Ok(top5Blogs);
        }
        //Top 5 user tương tác nhiều nhất(lượt comment)
        [HttpGet("TopUser")]
        public async Task<ActionResult<IEnumerable<Blog>>> TopUser()
        {
            var topUser = await _context.User
            .Select(user => new
            {
                User = user,
                CommentCount = _context.Comment.Count(c => c.UserId == user.Id)
            })
            .Where(b => b.User.Role == 1)
            .OrderByDescending(b => b.CommentCount)
            .Take(5)
            .Select(b => b.User)
            .ToListAsync();

            return Ok(topUser);
        }
    }
}