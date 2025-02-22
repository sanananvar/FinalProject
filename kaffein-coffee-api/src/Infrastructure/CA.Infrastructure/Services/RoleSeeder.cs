using CA.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace CA.Infrastructure.Services
{
    public class RoleSeeder
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public RoleSeeder(RoleManager<AppRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task SeedSuperAdminAsync()
        {
            string superAdminEmail = "superadmin@gmail.com";
            string defaultPassword = "Admin123@"; // Change this in production

            var existingUser = await _userManager.FindByEmailAsync(superAdminEmail);

            if (existingUser == null)
            {
                var user = new AppUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, defaultPassword);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "SuperAdmin");
                    Console.WriteLine("SuperAdmin user created successfully.");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"Error creating SuperAdmin user: {error.Description}");
                    }
                }
            }
            else
            {
                Console.WriteLine("SuperAdmin user already exists.");
            }
        }
        public async Task SeedRolesAsync()
        {
            string[] roleNames = { "SuperAdmin", "admin" };

            foreach (var roleName in roleNames)
            {
                // Check if the role already exists
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    // Create the role without manually setting the Id
                    var role = new AppRole { Name = roleName };
                    var result = await _roleManager.CreateAsync(role);

                    if (!result.Succeeded)
                    {
                        // Log the errors if role creation fails
                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"Error creating role {roleName}: {error.Description}");
                        }
                    }
                }
            }
        }
    }
}

