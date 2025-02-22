using System;
using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class LanguageRepository : Repository<Language>, ILanguageRepository
{
    public LanguageRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}

