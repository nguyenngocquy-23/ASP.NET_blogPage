namespace apiServer.DTO
{
    public class AuthBlogDTO
    {
        // Lấy 1 số thông tin hiển thị.
        public int Id { get; set; }
        public string Title { get; set; }
        public string CategoryName { get; set; } // Lấy trường Category tên cho phần hiển thị
        public string ShortDescription { get; set; }

        public string Image { get; set; }

        public DateTime CreatedAt { get; set; }

        public string AuthName { get; set; } // Lấy tên tác giả.

        public int TotalLike { get; set; }

        public int TotalComment { get; set; }
    }
}
