using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Models
{
	public interface IPortfolioRepository
	{
		Portfolio GetBy(int id);
		IEnumerable<Portfolio> GetAll();
		void Add(Portfolio p);
		void Delete(Portfolio p);
		void Update(Portfolio p);
		void SaveChanges();
	}
}
