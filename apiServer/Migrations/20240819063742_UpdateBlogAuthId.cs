using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiServer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBlogAuthId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Auth",
                table: "blogs");

            migrationBuilder.AddColumn<int>(
                name: "AuthId",
                table: "blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthId",
                table: "blogs");

            migrationBuilder.AddColumn<string>(
                name: "Auth",
                table: "blogs",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
