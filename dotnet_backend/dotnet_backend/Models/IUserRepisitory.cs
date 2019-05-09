using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public interface IUserRepisitory
	{
		User GetBy(string email);
		void Add(User user);
		void SaveChanges();
    
  }
}
