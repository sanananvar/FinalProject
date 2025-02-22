using CA.Application.Repositories;
using CA.Application.Services;
using CA.Application.Services.AuthServices;
using CA.Application.Services.Tokens;
using CA.Infrastructure.Services.Tokens;
using CA.Persistence.Contexts;
using CA.Persistence.Contexts.Seeders;
using CA.Persistence.Repositories;
using CA.Persistence.Services;
using CA.Persistence.Services.AuthServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CA.Persistence
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultSenan")));
            services.AddMemoryCache();

            #region BackgroundServices

            #endregion
            #region Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenHandler, TokenHandler>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICarouselService, CarouselService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddScoped<ICandidateService, CandidateService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IBranchService, BranchService>();
            services.AddScoped<IContactSourceService, ContactSourceService>();
            services.AddScoped<ISurveyService, SurveyService>();
            services.AddScoped<ICategoryService, CategoryService>();
            #endregion
            #region Repositories
            services.AddScoped<ISurveyRepository, SurveyRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ILanguageRepository, LanguageRepository>();
            services.AddScoped<ICarouselRepository, CarouselRepository>();
            services.AddScoped<ICandidateRepository, CandidateRepository>();
            services.AddScoped<ISatisfactionRepository, SatisfactionRepository>();
            services.AddScoped<IContactSourceRepository, ContactSourceRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IBranchRepository, BranchRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            #endregion
            services.AddScoped<LanguageSeeder>();

            return services;
        }
    }
}

