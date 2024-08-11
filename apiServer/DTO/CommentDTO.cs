namespace apiServer.DTO
{
    public class CommentDTO
    {       

        public int ID { get; set; }
        public int UserId { get; set; }

        // Nếu role = 0 : Admin.|| role = 1 : User

        public byte Role { get; set; }

        // Tên người bình luận
        public string UserName { get; set; }

        // Trạng thái bình luận: 0 - Bị ẩn ; 1 - Bình Thường.
        public int Status { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
        public int? ParentId { get; set; }

    }
}
