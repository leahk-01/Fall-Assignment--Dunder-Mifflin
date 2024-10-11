using DataAccess;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using Service;
using System.Text.Json;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddScoped<IPaperStoreRepository, PaperStoreRepository>();
builder.Services.AddScoped<PaperStoreService>();

builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MyDbConn")));

builder.Services.AddScoped<IPaperStoreRepository, PaperStoreRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Set to empty string to serve the Swagger UI at the app's root
    });
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseRouting();

app.UseCors(opts =>
{
    opts.AllowAnyOrigin();

    opts.AllowAnyMethod();

    opts.AllowAnyHeader();
});

app.Run();