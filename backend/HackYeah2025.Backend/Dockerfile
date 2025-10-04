# Etap 1: Budowanie aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY HackYeah2025/HackYeah2025.csproj HackYeah2025/
COPY HackYeah2025.sln ./
RUN dotnet restore HackYeah2025.sln
COPY . .
WORKDIR /src/HackYeah2025
RUN dotnet publish HackYeah2025.csproj -c Release -o /app/publish

# Etap 2: Uruchamianie aplikacji
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
ENV ASPNETCORE_URLS=http://+:80
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "HackYeah2025.dll"]

