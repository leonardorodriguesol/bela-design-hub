using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BelaDesignHub.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUnitPriceToServiceOrderItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "service_order_items",
                type: "numeric(14,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "service_order_items");
        }
    }
}
