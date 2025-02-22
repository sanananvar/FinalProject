using System;
namespace CA.API.Extensions
{
	public static class CorsExtension
    {
        public static string AddCorsService(this IServiceCollection services, string CorsName)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            return CorsName;
        }
    }
}

