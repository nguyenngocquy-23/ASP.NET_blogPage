using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace apiServer.Dto
{
    public class MyLoginRequest
    {
        [Required]
        [StringLength(50)]
        public string UsernameOrEmail { get; set; }

        [Required]
        [PasswordPropertyText]
        [StringLength(50)]
        public string Password { get; set; }
    }
}
