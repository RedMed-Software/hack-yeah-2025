using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordinatorRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CoordinatorId",
                table: "Accounts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Coordinators",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    LastName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coordinators", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_CoordinatorId",
                table: "Accounts",
                column: "CoordinatorId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Coordinators_CoordinatorId",
                table: "Accounts",
                column: "CoordinatorId",
                principalTable: "Coordinators",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Coordinators_CoordinatorId",
                table: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_CoordinatorId",
                table: "Accounts");

            migrationBuilder.DropTable(
                name: "Coordinators");

            migrationBuilder.DropColumn(
                name: "CoordinatorId",
                table: "Accounts");
        }
    }
}
