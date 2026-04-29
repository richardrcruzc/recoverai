using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLEad1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastRepliedAtUtc",
                table: "Leads",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastRepliedAtUtc",
                table: "Leads");
        }
    }
}
