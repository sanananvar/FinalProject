using CA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Contexts.Seeders;

public class LanguageSeeder
{
    private readonly ApplicationDbContext _context;

    public LanguageSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedLanguagesAsync()
    {
        var languages = new List<Language>
            {
                new() { Name = "English", Code = "en-US", CreatedAt=DateTime.UtcNow.AddHours(4) },
                new() { Name = "Azerbaijani", Code = "az-AZ", CreatedAt=DateTime.UtcNow.AddHours(4) },
                new() { Name = "Russian", Code = "ru-RU", CreatedAt=DateTime.UtcNow.AddHours(4) }
            };

        foreach (var language in languages)
        {
            var exists = await _context.Languages.AnyAsync(l => l.Code == language.Code);
            if (!exists)
            {
                await _context.Languages.AddAsync(language);
            }
        }

        await _context.SaveChangesAsync();
    }
}
