using System.ComponentModel.DataAnnotations;

namespace apiServer.DTO
{
    public class BlogDetailDTO
    {
        [Required]
        public int Id { get; set; }

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
        public byte Status { get; set; }
    }
}
