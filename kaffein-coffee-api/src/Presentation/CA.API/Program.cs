using CA.API.Extensions;
using CA.API.Middlewares;
using CA.Application;
using CA.Domain.Entities;
using CA.Domain.Options;
using CA.Infrastructure;
using CA.Infrastructure.Services;
using CA.Persistence;
using CA.Persistence.Contexts;
using CA.Persistence.Contexts.Seeders;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var calen = new CultureInfo("az-AZ");
    calen.NumberFormat.NumberDecimalSeparator = ".";
    var calaz = new CultureInfo("en-US");
    calaz.NumberFormat.NumberDecimalSeparator = ".";
    var calru = new CultureInfo("ru-RU");
    calru.NumberFormat.NumberDecimalSeparator = ".";
    var supportedCultures = new List<CultureInfo>
    {
        calen,
        calaz,
        calru
    };


    var defaultCulture = new CultureInfo("az-AZ");

    options.DefaultRequestCulture = new RequestCulture(defaultCulture);
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;

    options.RequestCultureProviders = new List<IRequestCultureProvider>
    {
        new QueryStringRequestCultureProvider(),
        new CookieRequestCultureProvider(),
        new AcceptLanguageHeaderRequestCultureProvider()
    };
});

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
{
    opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // Ignore cycles
    opts.JsonSerializerOptions.WriteIndented = true;
});

// Service Registrations
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddInfrastructureServices();

builder.Services.AddIdentity<AppUser, AppRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Lockout.AllowedForNewUsers = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddHttpContextAccessor();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddJWTTokenConfigurations(builder.Configuration["JwtTokenSettings:Audience"],
                                     builder.Configuration["JwtTokenSettings:Issuer"],
                                     builder.Configuration["JwtTokenSettings:SignInKey"]);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerExtension();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName); // Use full type names as schema IDs
});
builder.Services.AddCorsService("MyPolicy");

var app = builder.Build();

// Create seed data
using (var scope = app.Services.CreateScope())
{
    var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeeder>();
    var languageSeeder = scope.ServiceProvider.GetRequiredService<LanguageSeeder>();
    await roleSeeder.SeedRolesAsync();  // Ensure this line is awaited properly
    await roleSeeder.SeedSuperAdminAsync();
    await languageSeeder.SeedLanguagesAsync();
}

app.UseSwagger(c =>
{
    c.RouteTemplate = "api/swagger/{documentName}/swagger.json";
});
app.UseSwaggerUI(x =>
{
    x.SwaggerEndpoint("/api/swagger/client_v1/swagger.json", "Client API V1");
    x.SwaggerEndpoint("/api/swagger/admin_v1/swagger.json", "Admin API  V1");
    x.RoutePrefix = "api/swagger";
});

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
app.UseCors("MyPolicy");
app.UseMiddleware<GlobalExceptionHandler>();
app.UseRequestLocalization();
app.UseHttpsRedirection();

app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

app.Run();

