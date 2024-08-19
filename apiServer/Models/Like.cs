using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiServer.Models
{
    [Table("likes")]
    public class Like
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int userId { get; set; }

        [Required]
        public int BlogId { get; set; }
    }
}
