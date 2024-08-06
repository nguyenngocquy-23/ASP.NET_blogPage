using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace apiServer.Models
{
    [Table("changePwCode")]
    [Index(nameof(Code), IsUnique = true)]
    [Index(nameof(UserId), IsUnique = true)]
    public class ChangePwCode
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Code { get; set; }
        public int UserId { get; set; }
    }

}
