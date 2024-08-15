namespace apiServer.DTO
{
    public class CommentManageDTO
    {
        public int BlogId { get; set; }
        public string BlogTitle { get; set; }
        public int TotalComment { get; set; }
        public int RemoveComment { get; set;  }
        public int PendingComment { get; set; }


    }
}
