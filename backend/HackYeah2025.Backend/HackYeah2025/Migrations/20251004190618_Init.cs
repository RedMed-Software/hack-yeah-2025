using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ShortDescription = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    LongDescription = table.Column<string>(type: "text", nullable: false),
                    DateFrom = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DateTo = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Place = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    City = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Address = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Latitude = table.Column<decimal>(type: "numeric(9,6)", nullable: false),
                    Longitude = table.Column<decimal>(type: "numeric(9,6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EventTopics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventTopics", x => x.Id);
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
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

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
                name: "TaskItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DateStart = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DateEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskItems_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventEventTopics",
                columns: table => new
                {
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventTopicId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventEventTopics", x => new { x.EventId, x.EventTopicId });
                    table.ForeignKey(
                        name: "FK_EventEventTopics_EventTopics_EventTopicId",
                        column: x => x.EventTopicId,
                        principalTable: "EventTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventEventTopics_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Login = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    VolunteerId = table.Column<Guid>(type: "uuid", nullable: true),
                    OrganizerId = table.Column<Guid>(type: "uuid", nullable: true),
                    CoordinatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Accounts_Coordinators_CoordinatorId",
                        column: x => x.CoordinatorId,
                        principalTable: "Coordinators",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Accounts_Organizers_OrganizerId",
                        column: x => x.OrganizerId,
                        principalTable: "Organizers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Accounts_Volunteers_VolunteerId",
                        column: x => x.VolunteerId,
                        principalTable: "Volunteers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "AccountRoles",
                columns: table => new
                {
                    AccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountRoles", x => new { x.AccountId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AccountRoles_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccountRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AccountTasks",
                columns: table => new
                {
                    AccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskItemId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountTasks", x => new { x.AccountId, x.TaskItemId });
                    table.ForeignKey(
                        name: "FK_AccountTasks_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccountTasks_TaskItems_TaskItemId",
                        column: x => x.TaskItemId,
                        principalTable: "TaskItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "EventTopics",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("3acb29ab-38b3-4ce3-89ad-2fd25ed4a51c"), "innowacje społeczne" },
                    { new Guid("d46920c0-0b77-4a0e-8c1f-9af70906cb60"), "edukacja obywatelska" }
                });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Address", "City", "DateFrom", "DateTo", "Latitude", "LongDescription", "Longitude", "Name", "Place", "ShortDescription" },
                values: new object[] { new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"), "ul. Przemian 4", "Warszawa", new DateTimeOffset(new DateTime(2025, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTimeOffset(new DateTime(2025, 4, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 50.067930m, "Civic Lab 2025 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.", 19.983189m, "Civic Lab 2025", "Centrum Innowacji Młodych", "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych." });

            migrationBuilder.InsertData(
                table: "Organizations",
                columns: new[] { "Id", "FoundedYear", "Location", "Mission", "Name", "Programs", "Website" },
                values: new object[] { new Guid("5d1f3c76-7a10-4fb4-a4a1-0d5710a98b72"), 2012, "Centrum Aktywności Społecznej\nul. Solidarności 27\nWarszawa", "Wspieramy młodych liderów w rozwijaniu projektów społecznych, łącząc edukację obywatelską z działaniem w terenie.", "Fundacja Młodzi Działają", "inkubator projektów, mikrogranty sąsiedzkie, akademia wolontariatu", "https://mlodzi-dzialaja.pl" });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("4d7a2d92-1d09-4e9e-98ed-9d3dc81f2df6"), "Wolontariusz" },
                    { new Guid("a9a71dc8-3e5d-4c08-a6d5-7a80cd3607cf"), "Koordynator" },
                    { new Guid("be0cb87d-54b9-4f6c-a2d4-0d174f37d0cd"), "Administrator" },
                    { new Guid("f9bc7305-3fa3-4c79-8e59-2f75cd288846"), "Organizator" }
                });

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("0b93ef04-03ea-4bb8-8aa4-2a0d9c51bfb3"), "Wsparcie seniorów" },
                    { new Guid("1a6d420a-4851-45ce-b756-609d0c48e1c6"), "Wydarzenia kulturalne" },
                    { new Guid("1d8cb68b-20da-4c4c-93f0-326f0f7a086b"), "Edukacja obywatelska" },
                    { new Guid("9a3e0ca5-579f-49ba-a479-76a519e5c08a"), "Integracja młodzieży" }
                });

            migrationBuilder.InsertData(
                table: "Volunteers",
                columns: new[] { "Id", "Availability", "Description", "Email", "FirstName", "Languages", "LastName", "Phone", "PreferredRoles", "Skills", "Transport" },
                values: new object[] { new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, "Doświadczona wolontariuszka wspierająca projekty międzypokoleniowe oraz wydarzenia edukacyjne.", "julia.nowak@mlodzidzialaja.pl", "Julia", new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, "Nowak", "+48 511 222 333", "Koordynacja wolontariuszy, prowadzenie warsztatów, moderacja spotkań", new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" }, "Rower, komunikacja miejska, możliwość dojazdu do 20 km" });

            migrationBuilder.InsertData(
                table: "EventEventTopics",
                columns: new[] { "EventId", "EventTopicId" },
                values: new object[,]
                {
                    { new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"), new Guid("3acb29ab-38b3-4ce3-89ad-2fd25ed4a51c") },
                    { new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"), new Guid("d46920c0-0b77-4a0e-8c1f-9af70906cb60") }
                });

            migrationBuilder.InsertData(
                table: "Organizers",
                columns: new[] { "Id", "Email", "FullName", "Languages", "OrganizationId", "Phone", "Role", "Specializations" },
                values: new object[] { new Guid("4b1846cf-3c3a-4939-85f9-884f48216dfb"), "marta.zawadzka@mlodzi-dzialaja.pl", "Marta Zawadzka", "polski, angielski", new Guid("5d1f3c76-7a10-4fb4-a4a1-0d5710a98b72"), "+48 501 222 198", "Koordynatorka programu", "partycypacja młodzieży, partnerstwa lokalne" });

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
                columns: new[] { "TagId", "VolunteerId" },
                values: new object[,]
                {
                    { new Guid("0b93ef04-03ea-4bb8-8aa4-2a0d9c51bfb3"), new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8") },
                    { new Guid("1a6d420a-4851-45ce-b756-609d0c48e1c6"), new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8") },
                    { new Guid("1d8cb68b-20da-4c4c-93f0-326f0f7a086b"), new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8") },
                    { new Guid("9a3e0ca5-579f-49ba-a479-76a519e5c08a"), new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountRoles_RoleId",
                table: "AccountRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_CoordinatorId",
                table: "Accounts",
                column: "CoordinatorId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Email",
                table: "Accounts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Login",
                table: "Accounts",
                column: "Login",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_OrganizerId",
                table: "Accounts",
                column: "OrganizerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_VolunteerId",
                table: "Accounts",
                column: "VolunteerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccountTasks_TaskItemId",
                table: "AccountTasks",
                column: "TaskItemId");

            migrationBuilder.CreateIndex(
                name: "IX_EventEventTopics_EventTopicId",
                table: "EventEventTopics",
                column: "EventTopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Organizers_OrganizationId",
                table: "Organizers",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskItems_EventId",
                table: "TaskItems",
                column: "EventId");

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
                name: "AccountRoles");

            migrationBuilder.DropTable(
                name: "AccountTasks");

            migrationBuilder.DropTable(
                name: "EventEventTopics");

            migrationBuilder.DropTable(
                name: "VolunteerDistinctions");

            migrationBuilder.DropTable(
                name: "VolunteerTags");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "TaskItems");

            migrationBuilder.DropTable(
                name: "EventTopics");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Coordinators");

            migrationBuilder.DropTable(
                name: "Organizers");

            migrationBuilder.DropTable(
                name: "Volunteers");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Organizations");
        }
    }
}
