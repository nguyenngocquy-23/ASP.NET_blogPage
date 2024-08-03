using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiServer.Models
{
    [Table("comments")]
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string BlogId { get; set; }

        [Required]
        [StringLength(200)]
        public string Content { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }
    }
}
