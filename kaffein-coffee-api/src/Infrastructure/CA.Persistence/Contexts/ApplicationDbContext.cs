using CA.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Contexts;

public class ApplicationDbContext : IdentityDbContext
{
    public DbSet<AppRole> Roles { get; set; }
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Branch> Branches { get; set; }
    public DbSet<BranchDictionary> BranchDictionaries { get; set; }
    public DbSet<BranchImage> BranchImages { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Carousel> Carousels { get; set; }
    public DbSet<CarouselDictionary> CarouselDictionaries { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CategoryDictionary> CategoryDictionaries { get; set; }
    public DbSet<ContactSource> ContactSources { get; set; }
    public DbSet<ContactSourceDictionary> ContactSourceDictionaries { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductDictionary> ProductDictionaries { get; set; }
    public DbSet<Reviews> Reviews { get; set; }
    public DbSet<Setting> Settings { get; set; }
    public DbSet<SettingDictionary> SettingDictionaries { get; set; }
    public DbSet<Statisfaction> Statisfactions { get; set; }
    public DbSet<StatisfactionDictionary> StatisfactionDictionaries { get; set; }
    public DbSet<Survey> Surveys { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
}