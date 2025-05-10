using Backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Register HttpClient services for different APIs
builder.Services.AddHttpClient<LlmService>();
builder.Services.AddScoped<LlmService>();

builder.Services.AddHttpClient<RenewableEnergyDataService>();
builder.Services.AddScoped<RenewableEnergyDataService>();

builder.Services.AddHttpClient<IncomeLossDataService>();
builder.Services.AddScoped<IncomeLossDataService>();

builder.Services.AddHttpClient<ForestCarbonDataService>();
builder.Services.AddScoped<ForestCarbonDataService>();

builder.Services.AddHttpClient<EmissionsDataService>();
builder.Services.AddScoped<EmissionsDataService>();

builder.Services.AddHttpClient<ClimateDisastersDataService>();
builder.Services.AddScoped<ClimateDisastersDataService>();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy for localhost development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:4200") // Replace with your frontend URL for local dev
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

// Apply CORS policy
app.UseCors("AllowFrontend");

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
