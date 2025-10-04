using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class OrganizerInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    DateFrom = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DateTo = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organizations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FoundedYear = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Programs = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Mission = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Website = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organizers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Role = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Phone = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Languages = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Specializations = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Organizers_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Task",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Task", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Task_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Organizations",
                columns: new[] { "Id", "FoundedYear", "Location", "Mission", "Name", "Programs", "Website" },
                values: new object[] { new Guid("5d1f3c76-7a10-4fb4-a4a1-0d5710a98b72"), 2012, "Centrum Aktywności Społecznej\nul. Solidarności 27\nWarszawa", "Wspieramy młodych liderów w rozwijaniu projektów społecznych, łącząc edukację obywatelską z działaniem w terenie.", "Fundacja Młodzi Działają", "inkubator projektów, mikrogranty sąsiedzkie, akademia wolontariatu", "https://mlodzi-dzialaja.pl" });

            migrationBuilder.InsertData(
                table: "Organizers",
                columns: new[] { "Id", "Email", "FullName", "Languages", "OrganizationId", "Phone", "Role", "Specializations" },
                values: new object[] { new Guid("4b1846cf-3c3a-4939-85f9-884f48216dfb"), "marta.zawadzka@mlodzi-dzialaja.pl", "Marta Zawadzka", "polski, angielski", new Guid("5d1f3c76-7a10-4fb4-a4a1-0d5710a98b72"), "+48 501 222 198", "Koordynatorka programu", "partycypacja młodzieży, partnerstwa lokalne" });

            migrationBuilder.CreateIndex(
                name: "IX_Task_EventId",
                table: "Task",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Organizers_OrganizationId",
                table: "Organizers",
                column: "OrganizationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Organizers");

            migrationBuilder.DropTable(
                name: "Organizations");

            migrationBuilder.DropTable(
                name: "Task");

            migrationBuilder.DropTable(
                name: "Events");
        }
    }
}
