using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class AddChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Chats",
                columns: table => new
                {
                    ChatId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chats", x => x.ChatId);
                    table.ForeignKey(
                        name: "FK_Chats_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ChatAccounts",
                columns: table => new
                {
                    ChatId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccountId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatAccounts", x => new { x.ChatId, x.AccountId });
                    table.ForeignKey(
                        name: "FK_ChatAccounts_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatAccounts_Chats_ChatId",
                        column: x => x.ChatId,
                        principalTable: "Chats",
                        principalColumn: "ChatId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    ChatMessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    Message = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.ChatMessageId);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Chats_ChatId",
                        column: x => x.ChatId,
                        principalTable: "Chats",
                        principalColumn: "ChatId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                column: "PasswordHash",
                value: "100000:cJrjsCILamimtHANvNqiAw==:sXRa4ruLAcu+uJDvBO4Rev19Bf4i74yetT+5ISX9DH4=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("db2acd9b-b75d-4d8f-bbd4-a02be967b5d1"),
                column: "PasswordHash",
                value: "100000:Llt1a+Y1yIi5bGpikrFQqA==:aifcdSTI7N+WwXcnXJjPd0ABL70PeNKur8IaycaxZvA=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("f494b5fc-9ce3-4c1a-a46d-1416ce945a49"),
                column: "PasswordHash",
                value: "100000:Ek7Wn4mtzFo+k6869QT/ug==:rmtr+o5aVrXtqsKKr7nVnUhRw1ZllNf268BhmmzRNqM=");

            migrationBuilder.UpdateData(
                table: "Coordinators",
                keyColumn: "Id",
                keyValue: new Guid("03567278-63f7-4918-b856-2e01b13def50"),
                column: "LastName",
                value: "Wi�niewski");

            migrationBuilder.UpdateData(
                table: "Organizations",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                columns: new[] { "Mission", "Name", "Programs" },
                values: new object[] { "Wspieranie spo�eczno�ci lokalnych przez organizacj� event�w dobroczynnych", "Fundacja Dobrych Wydarze�", "Pomoc spo�eczna, organizacja wydarze� charytatywnych" });

            migrationBuilder.UpdateData(
                table: "Organizers",
                keyColumn: "Id",
                keyValue: new Guid("31b0d40d-7f7b-46a4-aeea-39300334645c"),
                column: "Specializations",
                value: "Organizacja event�w");

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9e9a45bc-06b1-4827-bf30-3341a74b2441"),
                columns: new[] { "Availability", "Languages", "PreferredRoles", "Skills" },
                values: new object[] { new Dictionary<string, string>(), new Dictionary<string, string>(), "Obs�uga go�ci", new Dictionary<string, string>() });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });

            migrationBuilder.CreateIndex(
                name: "IX_ChatAccounts_AccountId",
                table: "ChatAccounts",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_AccountId",
                table: "ChatMessages",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatId",
                table: "ChatMessages",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_EventId",
                table: "Chats",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatAccounts");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "Chats");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                column: "PasswordHash",
                value: "100000:SceD/o7Fq6LPGBN25+Up/w==:8gZsTuPz4nZE/KDnwFiZDsdRlLb3+bvfScVQwAW+Gqs=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("db2acd9b-b75d-4d8f-bbd4-a02be967b5d1"),
                column: "PasswordHash",
                value: "100000:q/E2K5l/cIqefbSi9mQJ/A==:ZzPgVFqD3iPIXZ2QM2kTfOTK48yzpIOKpEvb4bJvxeE=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("f494b5fc-9ce3-4c1a-a46d-1416ce945a49"),
                column: "PasswordHash",
                value: "100000:g+7zx3gMjFORJqiJbEpx4g==:vmULKPI8yMax3KtnLYoMcfyO5rSS2p17E7HRSeKantA=");

            migrationBuilder.UpdateData(
                table: "Coordinators",
                keyColumn: "Id",
                keyValue: new Guid("03567278-63f7-4918-b856-2e01b13def50"),
                column: "LastName",
                value: "Wiœniewski");

            migrationBuilder.UpdateData(
                table: "Organizations",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                columns: new[] { "Mission", "Name", "Programs" },
                values: new object[] { "Wspieranie spo³ecznoœci lokalnych przez organizacjê eventów dobroczynnych", "Fundacja Dobrych Wydarzeñ", "Pomoc spo³eczna, organizacja wydarzeñ charytatywnych" });

            migrationBuilder.UpdateData(
                table: "Organizers",
                keyColumn: "Id",
                keyValue: new Guid("31b0d40d-7f7b-46a4-aeea-39300334645c"),
                column: "Specializations",
                value: "Organizacja eventów");

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9e9a45bc-06b1-4827-bf30-3341a74b2441"),
                columns: new[] { "Availability", "Languages", "PreferredRoles", "Skills" },
                values: new object[] { new Dictionary<string, string>(), new Dictionary<string, string>(), "Obs³uga goœci", new Dictionary<string, string>() });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }
    }
}
