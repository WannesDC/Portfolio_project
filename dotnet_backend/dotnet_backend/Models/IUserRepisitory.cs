using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Models
{
	public interface IUserRepisitory
	{
		IEnumerable<User> GetAll();
		User GetBy(int id);
		void Add(User user);
		void Update(User user);
		void Delete(User user);
		void SaveChanges();
	}
}
