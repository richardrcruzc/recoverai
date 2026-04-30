using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailCompliance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailSuppressions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Reason = table.Column<int>(type: "int", nullable: false),
                    Source = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailSuppressions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailUnsubscribeTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Token = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ExpiresAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailUnsubscribeTokens", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailSuppressions_Email",
                table: "EmailSuppressions",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmailUnsubscribeTokens_Token",
                table: "EmailUnsubscribeTokens",
                column: "Token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailSuppressions");

            migrationBuilder.DropTable(
                name: "EmailUnsubscribeTokens");
        }
    }
}
