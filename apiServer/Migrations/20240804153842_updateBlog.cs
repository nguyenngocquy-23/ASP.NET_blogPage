using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiServer.Migrations
{
    /// <inheritdoc />
    public partial class updateBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "blogs",
                newName: "Auth");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Auth",
                table: "blogs",
                newName: "UserId");
        }
    }
}
