using System;
using Microsoft.OpenApi.Models;

namespace CA.API.Extensions
{
    public static class SwaggerExtension
    {
        public static void AddSwaggerExtension(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("admin_v1", new OpenApiInfo
                {
                    Title = "Admin API",
                    Version = "admin_v1",
                    Description = "An API to perform Admin operations",
                });
                c.SwaggerDoc("client_v1", new OpenApiInfo
                {
                    Title = "Client API",
                    Version = "client_v1",
                    Description = "An API to perform Client operations",
                });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });


            });
        }
    }
}

