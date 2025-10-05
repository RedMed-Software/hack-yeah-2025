using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class TaskItemEx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Additional",
                table: "TaskItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TaskItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "TaskItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "TaskItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinAge",
                table: "TaskItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "TaskItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "TimeFrom",
                table: "TaskItems",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "TimeTo",
                table: "TaskItems",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FocusAreas",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxParticipants",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxVolunteers",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "TimeFrom",
                table: "Events",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "TimeTo",
                table: "Events",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                column: "PasswordHash",
                value: "100000:nu9VRkj12OTzRPTYPzFyzw==:e5gbn2PYu3RgTvJfKBoPJOBZmQCOtspy510Nr7dvp5c=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("db2acd9b-b75d-4d8f-bbd4-a02be967b5d1"),
                column: "PasswordHash",
                value: "100000:ElCjkdP0DpqN5bAAvyUWKw==:DYM2Xe/T68EJurMkxV1B1XU1wvYgU81kNlaRNMKN35A=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("f494b5fc-9ce3-4c1a-a46d-1416ce945a49"),
                column: "PasswordHash",
                value: "100000:NMGpEGqkaS14HxqkYsjl3w==:B46aYBYyrdn/1Fz7be5HR/mBEy1L88jpfglmGj0YtkI=");

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("02e80232-d5dc-48b6-a781-b9cc2c68d2c7"),
                columns: new[] { "FocusAreas", "MaxParticipants", "MaxVolunteers", "TimeFrom", "TimeTo" },
                values: new object[] { null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"),
                columns: new[] { "FocusAreas", "MaxParticipants", "MaxVolunteers", "TimeFrom", "TimeTo" },
                values: new object[] { null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("417d347c-c647-4e3e-8754-baf1a8f27fa7"),
                columns: new[] { "FocusAreas", "MaxParticipants", "MaxVolunteers", "TimeFrom", "TimeTo" },
                values: new object[] { null, null, null, null, null });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Additional",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "MinAge",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "TimeFrom",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "TimeTo",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "FocusAreas",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "MaxParticipants",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "MaxVolunteers",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TimeFrom",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TimeTo",
                table: "Events");

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
        }
    }
}
