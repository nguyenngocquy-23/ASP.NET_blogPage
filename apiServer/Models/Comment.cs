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
        public int UserId { get; set; } 

        [Required]
        public int BlogId { get; set; }

        [Required]
        [StringLength(200)]
        public string Content { get; set; }

        [Required]
        public int Status { get; set; } // 1. Bình thường | 0. Ẩn.

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

        //Trường dành cho comment lồng nhau.
        public int? ParentId { get; set; }






    }
}
