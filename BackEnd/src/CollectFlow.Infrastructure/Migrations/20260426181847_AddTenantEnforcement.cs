using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantEnforcement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<Guid>(
            //    name: "TenantId",
            //    table: "AdminUsers",
            //    type: "uniqueidentifier",
            //    nullable: false,
            //    defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            //migrationBuilder.CreateIndex(
            //    name: "IX_AdminUsers_TenantId",
            //    table: "AdminUsers",
            //    column: "TenantId");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_AdminUsers_Tenants_TenantId",
            //    table: "AdminUsers",
            //    column: "TenantId",
            //    principalTable: "Tenants",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminUsers_Tenants_TenantId",
                table: "AdminUsers");

            migrationBuilder.DropIndex(
                name: "IX_AdminUsers_TenantId",
                table: "AdminUsers");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AdminUsers");
        }
    }
}
