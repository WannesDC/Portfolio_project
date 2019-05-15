using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public interface IPortfolioRepository
	{
		Portfolio GetBy(int id);
		IEnumerable<Portfolio> GetAll();
    bool TryGetPortfolio(int id, out Portfolio portfolio);
    void Add(Portfolio p);
		void Delete(Portfolio p);
		void Update(Portfolio p);
		void SaveChanges();
    Portfolio GetBySimple(int id);
  }
}
