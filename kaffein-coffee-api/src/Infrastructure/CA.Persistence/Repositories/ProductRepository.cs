using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class ProductRepository(ApplicationDbContext dbContext) : Repository<Product>(dbContext), IProductRepository {}