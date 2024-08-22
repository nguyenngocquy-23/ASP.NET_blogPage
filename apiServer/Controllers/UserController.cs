using apiServer.Data;
using apiServer.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Builder.Extensions;
using System.Runtime.InteropServices;
using apiServer.services;
using apiServer.Services;
using Microsoft.AspNetCore.Identity.Data;
using System.Security.Claims;
using apiServer.Dto;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
using apiServer.DTO;

namespace apiServer.Controllers
{
    [ApiController]
    [EnableCors("AllowAllOrigins")] // Enable CORS for this controller
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("updateInf")]
        public async Task<ActionResult<bool>> UpdateUser([FromQuery] int userId, [FromQuery] string fullName, [FromQuery] string email, [FromQuery] string phoneNumber)
        {
            if (await _context.User.FindAsync(userId) == null)
            {
                return BadRequest("User không tồn tại.");
            }

            var existingUser = await _context.User.FindAsync(userId);
            if (existingUser == null)
            {
                return NotFound($"User với ID {userId} không tồn tại.");
            }
            // Kiểm tra xem các tham số có rỗng hay không
            if (string.IsNullOrWhiteSpace(fullName))
            {
                return BadRequest("FullName không được rỗng.");
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email không được rỗng.");
            }

            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return BadRequest("PhoneNumber không được rỗng.");
            }

            // Kiểm tra định dạng email
            if (!(new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$").IsMatch(email)))
            {
                return BadRequest("Email không đúng định dạng.");
            }

            // Kiểm tra định dạng số điện thoại
            if (!(new Regex(@"^\d{10}$").IsMatch(phoneNumber)))
            {
                return BadRequest("Số điện thoại không đúng định dạng.");
            }

            existingUser.FullName = fullName;
            existingUser.Email = email;
            existingUser.PhoneNumber = phoneNumber;

            _context.User.Update(existingUser);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        [HttpPost("checkPass")]
        public async Task<ActionResult<bool>> checkPass(int userId, string input)
        {
            User user = await _context.User.FindAsync(userId);
            if(user != null)
            {
                return UserService.VerifyPassword(input,user.Password);  
            }
            return false;
        }

        [HttpPost("updatePass")]
        public async Task<ActionResult<bool>> UpdateUser(int id, string newPassword)
        {
            var User = await _context.User.FindAsync(id);
            if (User == null)
            {
                return NotFound($"User with ID {id} does not exist.");
            }

            // Cập nhật mật khẩu mới cho người dùng
            User.Password = UserService.HashPw(newPassword);

            _context.User.Update(User);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
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

            var forecast = await _context.User.FindAsync(id);
            if (forecast == null)
            {
                return NotFound();
            }
            return forecast;
        }
        
        [HttpGet("/auth/{id}")]
        public async Task<ActionResult<string>> GetAuthName(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return user.FullName;
        }

        [HttpGet("profile/{id}")]
        public async Task<ActionResult<AuthorDTO>> GetAuthorProfile(int id)
        {
            // Lấy thông tin người dùng.
            var user = await _context.User.FindAsync(id);

            if(user == null ) return NotFound();

            // Tính tổng số bài đăng của user với status =1.
            var totalPosts = await _context.Blog.Where(b => b.AuthId == id && b.Status == 1).CountAsync();

            // Tính tổng số lượt thích toàn bộ bài viết của user. (Lấy cả dù ẩn hay không).
            var totalLikes = await _context.Like
                 .Where(l => _context.Blog.Any(b => b.Id == l.BlogId && b.AuthId == id))
                 .CountAsync();

            //Tính tổng số bình luận/ phản hồi của ADmin với status = 1.
            var totalComments = await _context.Comment.Where(c => c.UserId == id && c.Status==1).CountAsync();

            //Tạo DTO để trả về kết quả.
            var authorDTO = new AuthorDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                TotalArticles = totalPosts,
                TotalLikes = totalLikes,
                CountComments = totalComments

            };
            return Ok(authorDTO);


        }



        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<User>>> FilterStudents(int status)
        {
            var Users = await _context.User
                .Where(u => u.Status == status)
                .Select(u => new User
                {
                    Id = u.Id,
                    FullName = u.FullName,
                })
                .ToListAsync();

            return Users;
        }

        [HttpPost("create", Name = "createUser")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<User>> CreateUser([FromBody] UserRequest userRequest)
        {
            if (userRequest == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Thiếu dữ liệu để tạo tài khoản!");

            if (userRequest.Password.Length < 6)
                return StatusCode(StatusCodes.Status400BadRequest, "Mật khẩu tối thiểu 6 ký tự");

            if (userRequest.Password != userRequest.ConfirmPassword)
                return StatusCode(StatusCodes.Status400BadRequest, "Mật khẩu không khớp!");

            // Kiểm tra định dạng email
            if (!(new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$").IsMatch(userRequest.Email)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Email không đúng định dạng.");
            }

            // Kiểm tra định dạng số điện thoại
            if (!(new Regex(@"^\d{10}$").IsMatch(userRequest.PhoneNumber)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Số điện thoại không đúng định dạng.");
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.Username == userRequest.Username);
            if (user != null)
                return StatusCode(StatusCodes.Status409Conflict, "Tên đăng nhập đã tồn tại");
            else
            {
                user = await _context.User.FirstOrDefaultAsync(u => u.Email == userRequest.Email);
                if (user != null)
                    return StatusCode(StatusCodes.Status409Conflict, "Email đăng nhập đã tồn tại");
            }
            user = new User()
            {
                Username = userRequest.Username,
                Password = UserService.HashPw(userRequest.Password),
                FullName = userRequest.FullName,
                CreatedAt = DateTime.Now,
                Email = userRequest.Email,
                PhoneNumber = userRequest.PhoneNumber,
                Role = 1,
                Status = 1,
                IsEnable = false
            };

            try
            {
                await _context.User.AddAsync(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Hiện tại không thể tạo tài khoản");
            }
        }

        [HttpPost("createAdmin", Name = "createAdmin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<User>> CreateAdmin([FromBody] UserRequest userRequest)
        {
            if (userRequest == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Thiếu dữ liệu để tạo tài khoản!");

            if (userRequest.Password.Length < 6)
                return StatusCode(StatusCodes.Status400BadRequest, "Mật khẩu tối thiểu 6 ký tự");


            if (userRequest.Password != userRequest.ConfirmPassword)
                return StatusCode(StatusCodes.Status400BadRequest, "Mật khẩu không khớp!");

            if (!(new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$").IsMatch(userRequest.Email)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Email không đúng định dạng.");
            }

            // Kiểm tra định dạng số điện thoại
            if (!(new Regex(@"^\d{10}$").IsMatch(userRequest.PhoneNumber)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Số điện thoại không đúng định dạng.");
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.Username == userRequest.Username);
            if (user != null)
                return StatusCode(StatusCodes.Status409Conflict, "Tên đăng nhập đã tồn tại");
            else
            {
                user = await _context.User.FirstOrDefaultAsync(u => u.Email == userRequest.Email);
                if (user != null)
                    return StatusCode(StatusCodes.Status409Conflict, "Email đăng nhập đã tồn tại");
            }
            user = new User()
            {
                Username = userRequest.Username,
                Password = UserService.HashPw(userRequest.Password),
                FullName = userRequest.FullName,
                CreatedAt = DateTime.Now,
                Email = userRequest.Email,
                PhoneNumber = userRequest.PhoneNumber,
                Role = 0,
                Status = 1,
                IsEnable = false
            };

            try
            {
                await _context.User.AddAsync(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Hiện tại không thể tạo tài khoản");
            }
        }


        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] MyLoginRequest loginRequest, [FromServices] JwtService jwtService)
        {
            if (loginRequest == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Thiếu dữ liệu để đăng nhập!");

            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Username == loginRequest.UsernameOrEmail || u.Email == loginRequest.UsernameOrEmail);

            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound, "Tài khoản không tồn tại!");

            if (!user.IsEnable)
                return StatusCode(StatusCodes.Status400BadRequest, "Tài khoản chưa được kích hoạt. Hãy kiểm tra hộp email của bạn để kích hoạt!");

            if (user.Status == 0)
                return StatusCode(StatusCodes.Status403Forbidden, "Tài khoản của bạn đã bị khóa! Liên hệ qua blogwebsite@gmail.com để được hỗ trợ!");

                if (!UserService.VerifyPassword(loginRequest.Password, user.Password))
            {
                return StatusCode(StatusCodes.Status409Conflict, "Sai mật khẩu.");
            }

            var token = jwtService.GenerateSecurityToken(user.Username);

            return Ok(new
            {
                Token = token,
                user.Id,
                user.Username,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.Role,
                user.Status,
                user.CreatedAt
            });
        }

        [HttpPost("requireActivateAccount")]
        public async Task<IActionResult> RequireActivateAccount([FromQuery] string emailorUsername)
        {
            // generate activate account code
            if (emailorUsername == null)
                return StatusCode(StatusCodes.Status404NotFound, "Email null!");

            string activationCode = UserService.GenerateActivationCode();

            // Save activation code to database (id, token, userId)
            var user = await _context.User
            .FirstOrDefaultAsync(u => u.Email == emailorUsername || u.Username == emailorUsername);

            if (user == null)
                //return StatusCode(StatusCodes.Status404NotFound, $"Không tồn tại tài khoản có email là {email}");
                return StatusCode(StatusCodes.Status404NotFound, "Email hoặc username chưa đăng ký tài khoản!");
            
            // save token
            var existingActivationInfo = await _context.ActivationInfo.FirstOrDefaultAsync(a => a.UserId == user.Id);

            if (existingActivationInfo != null)
            {
                // Update the existing activation token
                existingActivationInfo.Token = activationCode;
                _context.ActivationInfo.Update(existingActivationInfo);
            }
            else
            {
                // Add new activation info
                await _context.ActivationInfo.AddAsync(
                    new ActivationInfo()
                    {
                        Token = activationCode,
                        UserId = user.Id
                    }
                );
            }
            await _context.SaveChangesAsync();
            // Send activation email with link: server path /activateAccount/{activationCode}
            // https://www.youtube.com/watch?v=nhQmGnMPC1M&t=1013s
            var activationUrl = $"{Request.Scheme}://{Request.Host}/User/activateAccount?token={activationCode}";

            var mailContent = new MailContent();
            mailContent.To = user.Email;
            mailContent.Subject = "Blog Website";
            mailContent.Body = "<h1>Chào bạn, Đây là link kích hoạt Email của bạn!</h1><br/>" + activationUrl;
            await MailService.SendMail(mailContent);

            return Ok("Hãy kiểm tra hộp thư email của bạn để kích hoạt tài khoản!");
        }

        [HttpGet("activateAccount")]
        public async Task<IActionResult> activateAccount([FromQuery] string token)
        {
            var activationInfo = await _context.ActivationInfo
                .FirstOrDefaultAsync(a => a.Token == token);

            if (activationInfo == null)
            {
                var notFoundHtml = "<html><head><meta charset=\"UTF-8\"></head><body><h1>Mã kích hoạt không hợp lệ.</h1><p>Vui lòng kiểm tra lại liên kết kích hoạt của bạn.</p></body></html>";
                return Content(notFoundHtml, "text/html; charset=utf-8");
            }

            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Id == activationInfo.UserId);

            if (user == null)
            {
                var notFoundUserHtml = "<html><head><meta charset=\"UTF-8\"></head><body><h1>Người dùng không tìm thấy.</h1><p>Vui lòng kiểm tra lại liên kết kích hoạt của bạn.</p></body></html>";
                return Content(notFoundUserHtml, "text/html; charset=utf-8");
            }

            user.IsEnable = true;
            _context.User.Update(user);
            _context.ActivationInfo.Remove(activationInfo);
            await _context.SaveChangesAsync();

            var link = $"{Request.Scheme}://{Request.Host}/";
            var successHtml = $"<html><head><meta charset=\"UTF-8\"></head><body><h1>Tài khoản đã được kích hoạt thành công.</h1><p>Vui lòng đăng nhập để sử dụng dịch vụ.</p><br/><a href=\"{"http://localhost:3000/"}\">Trở về trang chính</a></body></html>";
            return Content(successHtml, "text/html; charset=utf-8");
        }


        [HttpPost("requestPasswordReset")]
        public async Task<IActionResult> RequestPasswordReset([FromQuery] string email)
        {
            if (!(new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$").IsMatch(email)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Email không đúng định dạng.");
            }

            // generate activate account code
            string code = UserService.GenerateVerificationCode();

            // Save activation code to database (id, token, userId)
            var user = await _context.User
            .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound, "Email chưa đăng ký tài khoản!");
            // save token
            var existingCode = await _context.ChangePwCode.FirstOrDefaultAsync(a => a.UserId == user.Id);
            if (existingCode != null)
            {
                // Update the existing activation token
                existingCode.Code = code;
                _context.ChangePwCode.Update(existingCode);
            }
            else
            {
                // Add new activation info
                await _context.ChangePwCode.AddAsync(
                    new ChangePwCode()
                    {
                        Code = code,
                        UserId = user.Id
                    }
                );
            }
            await _context.SaveChangesAsync();
            // Send code email
            var mailContent = new MailContent();
            mailContent.To = user.Email;
            mailContent.Subject = "Blog Website";
            mailContent.Body = "<p>Chào bạn, Đây là mã xác nhận để thay đổi mật khẩu. Lưu ý mã chỉ được sử dụng duy nhất 1 lần!</p><br/>" +"<b>" +code+"</b>";
            await MailService.SendMail(mailContent);
            return Ok("Chúng tôi đã gởi mã xác nhận đến email tài khoản của bạn!");
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromQuery] string email, [FromQuery] string code, [FromQuery] string newPassword, [FromQuery] string confirmPassword)
        {
            var user = await _context.User
            .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound, "Email chưa đăng ký tài khoản!");

            var changePwCode = await _context.ChangePwCode
                .FirstOrDefaultAsync(a => a.Code == code);

            if (changePwCode == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Mã xác nhận không chính xác!");
            }

            user = await _context.User
                .FirstOrDefaultAsync(u => u.Id == changePwCode.UserId);

            if (user == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Mã xác nhận không chính xác!");
            }

            if (user.Email != email)
                return StatusCode(StatusCodes.Status400BadRequest, "Email không hợp lệ!");


            if (newPassword.Length < 6)
                return StatusCode(StatusCodes.Status400BadRequest, "Mật khẩu tối thiểu 6 ký tự");
            if (newPassword != confirmPassword)
                return StatusCode(StatusCodes.Status400BadRequest, "Mật khẩu không khớp");

            user.Password = UserService.HashPw(newPassword);
            _context.User.Update(user);
            _context.ChangePwCode.Remove(changePwCode);
            await _context.SaveChangesAsync();
            return Ok("Thay đổi mật khẩu thành công!");
        }

        [HttpGet("getUserFromToken")]
        public async Task<User> GetUserFromTokenAsync()
        {
            var userNameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (userNameClaim == null)
            {
                Console.WriteLine("Token does not contain 'unique_name' claim.");
                return null;
            }

            var userName = userNameClaim.Value;
            User user = await _context.User.FirstOrDefaultAsync(u => u.Username == userName);
            if (user == null)
                Console.WriteLine("User not found");
            return user;
        }

        [Authorize]
        [HttpGet("checkAdmin")]
        public async Task<IActionResult> CheckAdmin()
        {
            var user = await GetUserFromTokenAsync();
            if (user == null)
            {
                return Unauthorized("Người dùng không xác thực.");
            }
            if (user.Role == 0)
            {
                return Ok(new { isAdmin = true });
            }
            return Ok(new { isAdmin = false });
        }


        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            User adminUser = await GetUserFromTokenAsync();
            if (adminUser != null && adminUser.Role == 0)
            {
                try
                {
                    var users = await _context.User
                        /*.Where(u => u.Role == 1)*/
                        .ToListAsync();
                    return Ok(users);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
                }
            }
             return StatusCode(StatusCodes.Status403Forbidden, "Không có quyền hạn");
        }

        [HttpPut("toggleLockStatus/{userId:int}")]
        public async Task<IActionResult> toggleLockStatus([FromRoute] int userId)
        {
            User adminUser = await GetUserFromTokenAsync();
            if (adminUser == null || adminUser.Role == 1)
                return StatusCode(StatusCodes.Status403Forbidden, "Không có quyền hạn");
            if (adminUser.Role == 0)
            {
                User updateUser = await _context.User.FirstOrDefaultAsync(u => u.Id == userId);
                if (updateUser == null)
                    return StatusCode(StatusCodes.Status404NotFound, "Tài khoản không tồn tại");

                updateUser.Status = (byte)((updateUser.Status == 0) ? 1 : 0);
                _context.User.Update(updateUser);
                await _context.SaveChangesAsync();

                return Ok("Thay đổi thành công");
            }
            return StatusCode(StatusCodes.Status403Forbidden, "Không có quyền hạn");
        }

    }
}
