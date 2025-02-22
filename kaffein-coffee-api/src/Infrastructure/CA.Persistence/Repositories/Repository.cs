using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CA.Persistence.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity, new()
{
    readonly ApplicationDbContext _dbContext;
    public Repository(ApplicationDbContext dbContext)
    => _dbContext = dbContext;

    public DbSet<T> Table => _dbContext.Set<T>();



    public async Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>> expression, bool isTracking, bool isRelation, params string[] Includes)
    {
        IQueryable<T> query = Table.Where(expression);
        if (!isRelation && !isTracking)
        {
            query.AsNoTrackingWithIdentityResolution();
        }
        else
        {
            if (!isTracking)
            {
                query.AsNoTracking();
            }
        }

        if (Includes is not null)
        {
            foreach (var include in Includes)
            {
                query = query.Include(include);
            }
        }
        return query;
    }

    public async Task<T> GetAsync(Expression<Func<T, bool>> expression, bool isTracking, bool isRelation, params string[] Includes)
    {
        IQueryable<T> query = Table.Where(expression);
        if (!isRelation && !isTracking)
        {
            query.AsNoTrackingWithIdentityResolution();
        }
        else
        {
            if (!isTracking)
            {
                query.AsNoTracking();
            }
        }

        if (Includes is not null)
        {
            foreach (var include in Includes)
            {
                query = query.Include(include);
            }
        }
        return await query.FirstOrDefaultAsync();
    }

    public IQueryable<T> GetQuery(Expression<Func<T, bool>>? expression, bool isTracking, bool isRelation, params string[] Includes)
    {
        IQueryable<T> query = Table.AsQueryable();
        if (expression != null)
        {
            query = query.Where(expression);
        }
        if (!isRelation && !isTracking)
        {
            query.AsNoTrackingWithIdentityResolution();
        }
        else
        {
            if (!isTracking)
            {
                query.AsNoTracking();
            }
        }

        if (Includes is not null)
        {
            foreach (var include in Includes)
            {
                query = query.Include(include);
            }
        }
        return query;
    }

    public bool IsExsist(Expression<Func<T, bool>> expression)
    {
        return Table.Where(expression).Count() > 0;
    }
    public async Task AddAsync(T entity)
    {
        _dbContext.Add(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbContext.AddRangeAsync(entities);
    }

    public async Task UpdateAsync(T entity)
    {
        _dbContext.Update(entity);
    }

    public int Save()
    {
        return _dbContext.SaveChanges();
    }

    public async Task<int> SaveAsync()
    {
        return await _dbContext.SaveChangesAsync();
    }

    public T Get(Expression<Func<T, bool>> expression, bool IsTracking, bool isRelation, params string[] Includes)
    {
        IQueryable<T> query = Table.Where(expression);
        if (!isRelation && !IsTracking)
        {
            query.AsNoTrackingWithIdentityResolution();
        }
        else
        {
            if (!IsTracking)
            {
                query.AsNoTracking();
            }
        }

        if (Includes is not null)
        {
            foreach (var include in Includes)
            {
                query = query.Include(include);
            }
        }
        return query.FirstOrDefault();
    }
}