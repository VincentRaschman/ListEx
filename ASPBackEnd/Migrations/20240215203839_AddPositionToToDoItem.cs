using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ASPBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddPositionToToDoItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PositionInList",
                table: "ToDoItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PositionInList",
                table: "ToDoItems");
        }
    }
}
