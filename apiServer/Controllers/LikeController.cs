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
    public class LikeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LikeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult<IEnumerable<bool>>> addLikeByUser([FromQuery] int idUser, int idBlog)
        {
            var isLike = await _context.Like.Where(like => like.userId == idUser && like.BlogId == idBlog).FirstOrDefaultAsync();
            if (isLike == null)
            {
                var like = new Like
                {
                    userId = idUser,
                    BlogId = idBlog
                };

                _context.Like.Add(like);
                await _context.SaveChangesAsync();
                return Ok(true);
            } else
            {
                return Ok(false);
            }
        }

        [HttpPost("delete")]
        public async Task<ActionResult<IEnumerable<bool>>> deleteLikeByUser([FromQuery] int idUser, int idBlog)
        {
            var isLike = await _context.Like.Where(like => like.userId == idUser && like.BlogId == idBlog).FirstOrDefaultAsync();
            if (isLike != null)
            {
                _context.Like.Remove(isLike);
                await _context.SaveChangesAsync();
                return Ok(true);
            } else
            {
                return Ok(false);
            }
        }

        [HttpPost("countLike")]
        public async Task<ActionResult<IEnumerable<int>>> countLikeBlog([FromQuery] int idBlog)
        {
            var numLike = await _context.Like.Where(like => like.BlogId == idBlog).CountAsync();
            return Ok(numLike);
        }

        [HttpPost("isLike")]
        public async Task<ActionResult<IEnumerable<bool>>> userIsLike([FromQuery] int idUser, int idBlog)
        {
            var isLike = await _context.Like.Where(like => like.userId == idUser && like.BlogId == idBlog).FirstOrDefaultAsync();
            if (isLike != null)
            {
                return Ok(true);
            } 
            return Ok(false);
        }
    }

}
