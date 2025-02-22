using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CA.Persistence.Repositories;

public class SatisfactionRepository : Repository<Statisfaction>, ISatisfactionRepository
{
    public SatisfactionRepository(ApplicationDbContext dbContext) : base(dbContext) {}
}
