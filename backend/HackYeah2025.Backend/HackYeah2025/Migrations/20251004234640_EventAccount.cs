using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class EventAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventsAccounts",
                columns: table => new
                {
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccountId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventsAccounts", x => new { x.EventId, x.AccountId });
                    table.ForeignKey(
                        name: "FK_EventsAccounts_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventsAccounts_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                column: "PasswordHash",
                value: "100000:hRvJulR5NfiJ7NRG9w+Wuw==:bA+9KNEhAoczFWRBlStH8mVqIA/og2r4aRSkSwDBVr0=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("db2acd9b-b75d-4d8f-bbd4-a02be967b5d1"),
                column: "PasswordHash",
                value: "100000:8n00Ay75UsKGduxfGb9a1w==:MTsTCwrRNKiPpvJvA8/B+BVmqX6JBZcJ8EEayFp4JH4=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("f494b5fc-9ce3-4c1a-a46d-1416ce945a49"),
                column: "PasswordHash",
                value: "100000:XORHTLO8nJfD9B1cZfh7+A==:NBfo8wPwybo+6tgMFZ84YybwrrxetJUX4lU1tsaaYmc=");

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9e9a45bc-06b1-4827-bf30-3341a74b2441"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string>(), new Dictionary<string, string>(), new Dictionary<string, string>() });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });

            migrationBuilder.CreateIndex(
                name: "IX_EventsAccounts_AccountId",
                table: "EventsAccounts",
                column: "AccountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventsAccounts");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                column: "PasswordHash",
                value: "100000:0EOm8H8Je4kmIzwxjr1Law==:3lOh95eCTxvwLJ5K/xDA4vYO+vUmA32omygulxCJtsM=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("db2acd9b-b75d-4d8f-bbd4-a02be967b5d1"),
                column: "PasswordHash",
                value: "100000:NtHtghmNFkUTO33L627aSQ==:AHiGhHZWq7o6kfNjPYPnyDjCYNg4dJBgS1SwID7lhTI=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("f494b5fc-9ce3-4c1a-a46d-1416ce945a49"),
                column: "PasswordHash",
                value: "100000:MRSTuegwf0J5Lyv2xAKEwg==:WG3zcHfsCKdqRadk4uh0YvWGY09YcwmdNThf73zUI3M=");

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9e9a45bc-06b1-4827-bf30-3341a74b2441"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string>(), new Dictionary<string, string>(), new Dictionary<string, string>() });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }
    }
}
