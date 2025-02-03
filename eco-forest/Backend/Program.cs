var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// builder.Services.AddControllers();  // Add this line to support controllers
builder.Services.AddHttpClient<RenewableEnergyDataService>();

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());  // Allow all origins for testing

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
