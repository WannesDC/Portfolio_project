using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using test.Models;

namespace test.Data.Repositories
{
  public class PortfolioRepository : IPortfolioRepository
  {
    private readonly ApplicationDbContext _context;
    private readonly DbSet<Portfolio> _portfolios;

    public PortfolioRepository(ApplicationDbContext context)
    {
      _context = context;
      _portfolios = context.Portfolios;
    }
    public void Add(Portfolio p)
    {
      _portfolios.Add(p);
    }

    public void Delete(Portfolio p)
    {
      _portfolios.Remove(p);
    }

    public IEnumerable<Portfolio> GetAll()
    {
      return _portfolios.ToList();
    }

    public Portfolio GetBy(int id)
    {
      return _portfolios
        .Include(p => p.Contact)
        .Include(p => p.Educations)
        .Include(p => p.Experiences)
        .Include(p => p.Skills)
        .Include(p => p.Works)
        .SingleOrDefault(p => p.Id == id);

    }

    public void SaveChanges()
    {
      _context.SaveChanges();
    }

    public void Update(Portfolio p)
    {
      _context.Update(p);
    }
  }
}
