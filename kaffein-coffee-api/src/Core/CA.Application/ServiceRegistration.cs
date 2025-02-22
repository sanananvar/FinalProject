using System;
using Microsoft.Extensions.DependencyInjection;

namespace CA.Application
{
	public static class ServiceRegistration
	{
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            return services;
        }
    }
}

