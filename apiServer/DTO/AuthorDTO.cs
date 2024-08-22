namespace apiServer.DTO
{
    public class AuthorDTO
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public DateTime CreatedAt { get; set; }

        public int TotalArticles{get ; set;} // Tổng bài viết mà Author đã viết, trạng thái đang hiển thị (status = 1).

        public int TotalLikes { get; set; } //Tổng lượt like trên tất cả bài viết mà Author đã đăng. (Bài viết có ẩn hay không cũng lấy)

        public int CountComments { get; set; } // Số comment mà Author đã phản hồi. (Bài viết có ẩn hay không cũng lấy, nhưng comment nếu ẩn rồi thì không lấy.)

        
        

    }
}
