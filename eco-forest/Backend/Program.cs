using Backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Register services for different APIs
builder.Services.AddHttpClient<RenewableEnergyDataService>();
builder.Services.AddScoped<RenewableEnergyDataService>();

// Register IncomeLoss service
builder.Services.AddHttpClient<IncomeLossDataService>();
builder.Services.AddScoped<IncomeLossDataService>();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure CORS policy
app.UseCors(policy =>
    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Map controllers to routes
app.MapControllers();

app.Run();
