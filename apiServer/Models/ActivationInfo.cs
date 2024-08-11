using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace apiServer.Models
{
    [Table("activationInfo")]
    [Index(nameof(Token), IsUnique = true)]
    [Index(nameof(UserId), IsUnique = true)]
    public class ActivationInfo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Token { get; set; }
        public int UserId { get; set; }
    }

}
