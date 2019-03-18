using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Data
{
	
	public class DataInitializer
	{
		private readonly ApplicationDbContext _dbContext;

		public DataInitializer(ApplicationDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public void InitializeData()
		{
			_dbContext.Database.EnsureDeleted();
			if (_dbContext.Database.EnsureCreated())
			{
				//seeding the database with users, see DBContext  
			}
		}
	}
}
