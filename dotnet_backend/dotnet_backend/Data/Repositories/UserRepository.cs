using dotnet_backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Data.Repositories
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

    public Task<User> FindByEmailAsync(string email)
    {
      return Task.Run(() =>
     {
       return _users.SingleOrDefault(u => u.Email == email);
     }
      );
    }

    public User GetBy(string email)
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
				.SingleOrDefault(u => u.Email == email);
		}

		public void SaveChanges()
		{
			_context.SaveChanges();
		}


	}
}
