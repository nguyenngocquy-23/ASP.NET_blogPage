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
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ContactController(AppDbContext context)
        {
            _context = context;
        }
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

    }
}