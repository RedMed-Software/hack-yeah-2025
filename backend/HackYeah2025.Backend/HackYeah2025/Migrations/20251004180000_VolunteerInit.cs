using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class VolunteerInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Volunteers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    LastName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Availability = table.Column<Dictionary<string, string>>(type: "jsonb", nullable: false),
                    PreferredRoles = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Languages = table.Column<Dictionary<string, string>>(type: "jsonb", nullable: false),
                    Transport = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Skills = table.Column<Dictionary<string, string>>(type: "jsonb", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Phone = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Volunteers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerDistinctions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VolunteerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerDistinctions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VolunteerDistinctions_Volunteers_VolunteerId",
                        column: x => x.VolunteerId,
                        principalTable: "Volunteers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerTags",
                columns: table => new
                {
                    VolunteerId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerTags", x => new { x.VolunteerId, x.TagId });
                    table.ForeignKey(
                        name: "FK_VolunteerTags_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VolunteerTags_Volunteers_VolunteerId",
                        column: x => x.VolunteerId,
                        principalTable: "Volunteers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("9a3e0ca5-579f-49ba-a479-76a519e5c08a"), "Integracja młodzieży" },
                    { new Guid("0b93ef04-03ea-4bb8-8aa4-2a0d9c51bfb3"), "Wsparcie seniorów" },
                    { new Guid("1a6d420a-4851-45ce-b756-609d0c48e1c6"), "Wydarzenia kulturalne" },
                    { new Guid("1d8cb68b-20da-4c4c-93f0-326f0f7a086b"), "Edukacja obywatelska" }
                });

            migrationBuilder.InsertData(
                table: "Volunteers",
                columns: new[] { "Id", "Availability", "Description", "Email", "FirstName", "Languages", "LastName", "Phone", "PreferredRoles", "Skills", "Transport" },
                values: new object[]
                {
                    new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                    new Dictionary<string, string>
                    {
                        { "tuesday_thursday", "Wtorki i czwartki 16:00 – 20:00" },
                        { "weekends", "Weekendy według ustaleń" }
                    },
                    "Doświadczona wolontariuszka wspierająca projekty międzypokoleniowe oraz wydarzenia edukacyjne.",
                    "julia.nowak@mlodzidzialaja.pl",
                    "Julia",
                    new Dictionary<string, string>
                    {
                        { "Polski", "C2" },
                        { "Angielski", "C1" },
                        { "Ukraiński", "B1" }
                    },
                    "Nowak",
                    "+48 511 222 333",
                    "Koordynacja wolontariuszy, prowadzenie warsztatów, moderacja spotkań",
                    new Dictionary<string, string>
                    {
                        { "Komunikacja i moderacja", "Zaawansowany" },
                        { "Animacja czasu wolnego", "Średniozaawansowany" },
                        { "Pierwsza pomoc", "Podstawowy" },
                        { "Planowanie wydarzeń", "Zaawansowany" }
                    },
                    "Rower, komunikacja miejska, możliwość dojazdu do 20 km"
                });

            migrationBuilder.InsertData(
                table: "VolunteerDistinctions",
                columns: new[] { "Id", "Description", "Title", "VolunteerId" },
                values: new object[,]
                {
                    { new Guid("8d5fdf09-04ac-4b76-bbef-f5fb3787e6bf"), "Wyróżnienie za 120 godzin pracy z młodzieżą i seniorami w 2024 roku.", "Nagroda \"Wolontariusz roku\"", new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8") },
                    { new Guid("9e0c6883-9461-4d6f-b6f2-f2de4f6dd0a4"), "Ukończony kurs Polskiego Czerwonego Krzyża, obejmujący scenariusze miejskie.", "Certyfikat z pierwszej pomocy", new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8") }
                });

            migrationBuilder.InsertData(
                table: "VolunteerTags",
                columns: new[] { "VolunteerId", "TagId" },
                values: new object[,]
                {
                    { new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), new Guid("9a3e0ca5-579f-49ba-a479-76a519e5c08a") },
                    { new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), new Guid("0b93ef04-03ea-4bb8-8aa4-2a0d9c51bfb3") },
                    { new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), new Guid("1a6d420a-4851-45ce-b756-609d0c48e1c6") },
                    { new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), new Guid("1d8cb68b-20da-4c4c-93f0-326f0f7a086b") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerDistinctions_VolunteerId",
                table: "VolunteerDistinctions",
                column: "VolunteerId");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerTags_TagId",
                table: "VolunteerTags",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VolunteerDistinctions");

            migrationBuilder.DropTable(
                name: "VolunteerTags");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Volunteers");
        }
    }
}
