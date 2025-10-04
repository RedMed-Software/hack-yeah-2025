using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class AddStatuEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CompletedDate",
                table: "Events",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EventStatus",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RegisterDate",
                table: "Events",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"),
                columns: new[] { "CompletedDate", "EventStatus", "RegisterDate" },
                values: new object[] { null, 1, new DateTimeOffset(new DateTime(2025, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedDate",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EventStatus",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "RegisterDate",
                table: "Events");

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }
    }
}
