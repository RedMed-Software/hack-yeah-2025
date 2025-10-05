using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class TaskItemEx2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TimeTo",
                table: "TaskItems",
                type: "text",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TimeFrom",
                table: "TaskItems",
                type: "text",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TimeTo",
                table: "Events",
                type: "text",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TimeFrom",
                table: "Events",
                type: "text",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                column: "PasswordHash",
                value: "100000:a9NVNqub6IoOauy1791YvQ==:d0Oey4U+12p2UhaPKoWX/PBbFysqKOy7g+sDGt/IZec=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("db2acd9b-b75d-4d8f-bbd4-a02be967b5d1"),
                column: "PasswordHash",
                value: "100000:AohimQ4hpd/dejcZ3tu6xA==:ybn7pDRbiJZH3LdytW/2ejQAoNNBjexmURZ5qi47eb0=");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: new Guid("f494b5fc-9ce3-4c1a-a46d-1416ce945a49"),
                column: "PasswordHash",
                value: "100000:ZpKrzXvE+y0FypuVpp3zOQ==:Q9V4s2h48O4zkMorut59HMgJm1RCNgmt3CZ69/NQIsI=");

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("02e80232-d5dc-48b6-a781-b9cc2c68d2c7"),
                columns: new[] { "TimeFrom", "TimeTo" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"),
                columns: new[] { "TimeFrom", "TimeTo" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("417d347c-c647-4e3e-8754-baf1a8f27fa7"),
                columns: new[] { "TimeFrom", "TimeTo" },
                values: new object[] { null, null });

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
            migrationBuilder.AlterColumn<TimeOnly>(
                name: "TimeTo",
                table: "TaskItems",
                type: "time without time zone",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "TimeFrom",
                table: "TaskItems",
                type: "time without time zone",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "TimeTo",
                table: "Events",
                type: "time without time zone",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "TimeFrom",
                table: "Events",
                type: "time without time zone",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

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
                columns: new[] { "TimeFrom", "TimeTo" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("2b4ae59e-7adf-4a95-a410-9ec118984d47"),
                columns: new[] { "TimeFrom", "TimeTo" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("417d347c-c647-4e3e-8754-baf1a8f27fa7"),
                columns: new[] { "TimeFrom", "TimeTo" },
                values: new object[] { null, null });

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
