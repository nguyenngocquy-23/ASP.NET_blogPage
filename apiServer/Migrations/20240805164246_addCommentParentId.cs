using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiServer.Migrations
{
    /// <inheritdoc />
    public partial class addCommentParentId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            // Add the ParentId column to the comments table
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "comments",
                type: "int",
                nullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove the ParentId column from the comments table
            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "comments");
        }
    }
}
