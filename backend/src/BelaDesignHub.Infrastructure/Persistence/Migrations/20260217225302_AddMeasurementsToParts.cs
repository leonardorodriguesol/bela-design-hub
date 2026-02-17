using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BelaDesignHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurementsToParts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Measurements",
                table: "production_schedule_parts",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Measurements",
                table: "product_parts",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Measurements",
                table: "production_schedule_parts");

            migrationBuilder.DropColumn(
                name: "Measurements",
                table: "product_parts");
        }
    }
}
