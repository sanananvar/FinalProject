using CA.Application.Services.MailServices;
using CA.Application.Services.Tokens;
using CA.Infrastructure.Services;
using CA.Infrastructure.Services.MailServices;
using CA.Infrastructure.Services.Tokens;
using Microsoft.Extensions.DependencyInjection;

namespace CA.Infrastructure
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped<ITokenHandler, TokenHandler>();
            services.AddTransient<IMailService, MailService>();
            services.AddScoped<RoleSeeder>();
            return services;
        }
    }
}

