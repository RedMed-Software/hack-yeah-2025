using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HackYeah2025.Migrations
{
    /// <inheritdoc />
    public partial class AddNextSeedsEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Address", "City", "CompletedDate", "DateFrom", "DateTo", "EventStatus", "Latitude", "LongDescription", "Longitude", "Name", "OrganizerId", "Place", "RegisterDate", "ShortDescription" },
                values: new object[,]
                {
                    { new Guid("02e80232-d5dc-48b6-a781-b9cc2c68d2c7"), "ul. Przemian 4", "Warszawa", null, new DateTimeOffset(new DateTime(2024, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTimeOffset(new DateTime(2024, 4, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 1, 51.067930m, "Civic Lab 2023 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.", 20.983189m, "Civic Lab 2024", new Guid("4b1846cf-3c3a-4939-85f9-884f48216dfb"), "Centrum Innowacji Młodych", new DateTimeOffset(new DateTime(2024, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych." },
                    { new Guid("417d347c-c647-4e3e-8754-baf1a8f27fa7"), "ul. Przemian 4", "Warszawa", null, new DateTimeOffset(new DateTime(2023, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTimeOffset(new DateTime(2023, 4, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 1, 51.067930m, "Civic Lab 2023 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.", 18.983189m, "Civic Lab 2023", new Guid("4b1846cf-3c3a-4939-85f9-884f48216dfb"), "Centrum Innowacji Młodych", new DateTimeOffset(new DateTime(2023, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych." }
                });

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
            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("02e80232-d5dc-48b6-a781-b9cc2c68d2c7"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("417d347c-c647-4e3e-8754-baf1a8f27fa7"));

            migrationBuilder.UpdateData(
                table: "Volunteers",
                keyColumn: "Id",
                keyValue: new Guid("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                columns: new[] { "Availability", "Languages", "Skills" },
                values: new object[] { new Dictionary<string, string> { ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00", ["weekends"] = "Weekendy według ustaleń" }, new Dictionary<string, string> { ["Polski"] = "C2", ["Angielski"] = "C1", ["Ukraiński"] = "B1" }, new Dictionary<string, string> { ["Komunikacja i moderacja"] = "Zaawansowany", ["Animacja czasu wolnego"] = "Średniozaawansowany", ["Pierwsza pomoc"] = "Podstawowy", ["Planowanie wydarzeń"] = "Zaawansowany" } });
        }
    }
}
