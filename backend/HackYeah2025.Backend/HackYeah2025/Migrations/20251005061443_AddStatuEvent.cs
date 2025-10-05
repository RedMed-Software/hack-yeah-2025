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
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Volunteers",
                type: "integer",
                maxLength: 3,
                nullable: false,
                defaultValue: 0);

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
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9e9a45bc-06b1-4827-bf30-3341a74b2441"),
                columns: new[] { "Age", "Availability", "Languages", "PreferredRoles", "Skills" },
                values: new object[] { 18, new Dictionary<string, string>(), new Dictionary<string, string>(), "Obs³uga goœci", new Dictionary<string, string>() });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Age", "Availability", "Languages", "Skills" },
                values: new object[] { 18, new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Volunteers");

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
                table: "Coordinators",
                keyColumn: "Id",
                keyValue: new Guid("03567278-63f7-4918-b856-2e01b13def50"),
                column: "LastName",
                value: "Wiśniewski");

            migrationBuilder.UpdateData(
                table: "Organizations",
                keyColumn: "Id",
                keyValue: new Guid("b70be7b4-44f0-4415-a256-be158573d499"),
                columns: new[] { "Mission", "Name", "Programs" },
                values: new object[] { "Wspieranie społeczności lokalnych przez organizację eventów dobroczynnych", "Fundacja Dobrych Wydarzeń", "Pomoc społeczna, organizacja wydarzeń charytatywnych" });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9e9a45bc-06b1-4827-bf30-3341a74b2441"),
                columns: new[] { "Availability", "Languages", "PreferredRoles", "Skills" },
                values: new object[] { new Dictionary<string, string>(), new Dictionary<string, string>(), "Obsługa gości", new Dictionary<string, string>() });

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }
    }
}
