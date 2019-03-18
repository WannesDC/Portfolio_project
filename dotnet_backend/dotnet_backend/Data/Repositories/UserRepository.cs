using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using test.Models;

namespace test.Data.Repositories
{
	public class UserRepository : IUserRepisitory
	{
		private readonly ApplicationDbContext _context;
		private readonly DbSet<User> _users;
		public UserRepository(ApplicationDbContext dbContext)
		{
			_context = dbContext;
			_users = dbContext.Users;
		}
		public void Add(User user)
		{
			_users.Add(user);
		}

		public void Delete(User user)
		{
			_users.Remove(user);
		}

		public IEnumerable<User> GetAll()
		{
			return _users.Include(u => u.Portfolio).ToList();
		}
		public User GetBy(int id)
		{
			return _users
				.Include(u => u.Portfolio)
					.ThenInclude(p => p.Contact)
				.Include(u => u.Portfolio)
					.ThenInclude(p => p.Educations)
				.Include(u => u.Portfolio)
					.ThenInclude(p => p.Experiences)
				.Include(u => u.Portfolio)
					.ThenInclude(p => p.Skills)
				.Include(u => u.Portfolio)
					.ThenInclude(p => p.Works)
				.SingleOrDefault(u => u.Id == id);
		}

		public void SaveChanges()
		{
			_context.SaveChanges();
		}

		public void Update(User user)
		{
			_context.Update(user); 
		}
	}
}
