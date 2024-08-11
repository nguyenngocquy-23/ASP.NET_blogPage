using apiServer.Data;
using apiServer.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using apiServer.services;

namespace apiServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }
        // Lưu contact vào db
        [HttpPost]
        public async Task<ActionResult<Contact>> SaveContact([FromBody] Contact contact)
        {
            if (contact == null)
            {
                return BadRequest("Yêu cầu là null!");
            }
            //thêm vào async
            await _context.Contact.AddAsync(contact);
            //lưu về db
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetContactById), new { id = contact.Id }, contact);

        }
        //Lấy các contact theo id
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContactById(int id)
        {
            var contact = await _context.Contact.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }
            return contact;
        }
        //Lấy tất cả các contact chua phan hoi
        [HttpGet("allCPH")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContactAllCPH()
        {
            return await _context.Contact
                            .Where(c => c.FeedBack == 0)
                            .ToListAsync();
        }
        //Lấy tất cả các contact da phan hoi
        [HttpGet("allDPH")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContactAllDPH()
        {
            return await _context.Contact
                            .Where(c => c.FeedBack == 1)
                            .ToListAsync();
        }
        //Gửi Mail FeedBack
        [HttpPost("send")]
        public async Task<IActionResult> sendEmail([FromBody] MailContent mail)
        {
            if (mail == null || string.IsNullOrEmpty(mail.To) || string.IsNullOrEmpty(mail.Subject) || string.IsNullOrEmpty(mail.Body))
            {
                return BadRequest("Gửi Email Thất Bại!");
            }
            await MailService.SendMail(mail);
            var contact = await _context.Contact.FirstOrDefaultAsync(c => c.Email == mail.To);
            if (contact != null)
            {
                contact.FeedBack = 1;
                _context.Contact.Update(contact);
                await _context.SaveChangesAsync();
            }
            return Ok("Phản Hồi Thành Công!");
        }
    }
}