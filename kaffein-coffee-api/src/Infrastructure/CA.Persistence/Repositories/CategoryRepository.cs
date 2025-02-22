using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
