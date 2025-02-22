using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace CA.API.Extensions
{
    public static class JWTExtension
    {
        public static IServiceCollection AddJWTTokenConfigurations(this IServiceCollection services, string audience, string issuer, string signInKey)
        {
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidAudience = audience,
                    ValidIssuer = issuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signInKey)),
                    LifetimeValidator = (_, expires, _, _) => expires != null ? expires > DateTime.UtcNow : false,

                    NameClaimType = ClaimTypes.Name

                };
            });
            return services;
        }
    }
}
