using HackYeah2025.Features;
using HackYeah2025.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<HackYeahDbContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddScoped<IOrganizerService, OrganizerService>();
builder.Services.AddScoped<IVolunteerService, VolunteerService>();

WebApplication app = builder.Build();

using (IServiceScope scope = app.Services.CreateScope())
{
    HackYeahDbContext dbContext = scope.ServiceProvider.GetRequiredService<HackYeahDbContext>();
    dbContext.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
