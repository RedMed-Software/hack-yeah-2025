# Etap 1: Budowanie aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/HackYeah2025.Backend/HackYeah2025.csproj backend/HackYeah2025.Backend/
RUN dotnet restore backend/HackYeah2025.Backend/HackYeah2025.csproj
COPY backend/HackYeah2025.Backend ./backend/HackYeah2025.Backend
WORKDIR /src/backend/HackYeah2025.Backend
RUN dotnet publish HackYeah2025.csproj -c Release -o /app/publish

# Etap 2: Uruchamianie aplikacji
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
ENV ASPNETCORE_URLS=http://+:80
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "HackYeah2025.dll"]
