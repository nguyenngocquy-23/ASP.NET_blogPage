using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiServer.Models
{
    [Table("blogs")]
    public class Blog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Auth { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        public string Image { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [Required]
        public byte Status { get; set; }

        [Required]
        public int NumLike { get; set; }
    }
}
