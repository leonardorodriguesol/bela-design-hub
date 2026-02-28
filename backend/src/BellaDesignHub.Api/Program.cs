using BellaDesignHub.Application.Orders;
using BellaDesignHub.Infrastructure.Persistence.Data;
using BellaDesignHub.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderApplicationService, OrderApplicationService>();
var configuredOrigins = builder.Configuration["Cors:AllowedOrigins"]
    ?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];
var allowedOrigins = ResolveAllowedOrigins(builder.Environment, configuredOrigins);
var applyMigrationsOnStartup = ResolveApplyMigrationsOnStartup(builder.Configuration, builder.Environment);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    if (applyMigrationsOnStartup)
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if (dbContext.Database.IsRelational())
        {
            dbContext.Database.Migrate();
        }
    }
    else
    {
        app.Logger.LogInformation(
            "Automatic migrations are disabled. Set Database__ApplyMigrationsOnStartup=true to enable.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

static string[] ResolveAllowedOrigins(IHostEnvironment environment, string[] configuredOrigins)
{
    if (configuredOrigins.Length > 0)
    {
        return configuredOrigins.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
    }

    if (environment.IsProduction())
    {
        throw new InvalidOperationException(
            "Missing required configuration 'Cors:AllowedOrigins' in Production. " +
            "Set 'Cors__AllowedOrigins' with one or more origins separated by ';'.");
    }

    return
    [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173"
    ];
}

static bool ResolveApplyMigrationsOnStartup(IConfiguration configuration, IHostEnvironment environment)
{
    var rawValue = configuration["Database:ApplyMigrationsOnStartup"];
    if (string.IsNullOrWhiteSpace(rawValue))
    {
        return environment.IsDevelopment();
    }

    if (bool.TryParse(rawValue, out var parsed))
    {
        return parsed;
    }

    throw new InvalidOperationException(
        "Invalid value for 'Database:ApplyMigrationsOnStartup'. Use 'true' or 'false'.");
}

namespace BellaDesignHub.Api
{
    public partial class Program;
}
