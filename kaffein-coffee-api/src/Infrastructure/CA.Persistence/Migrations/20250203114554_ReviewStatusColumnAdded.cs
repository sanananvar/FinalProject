using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ReviewStatusColumnAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReviewStatus",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "Reviews");
        }
    }
}
