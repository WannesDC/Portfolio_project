using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class User
	{
		public int UserId { get; set; }
		public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
		public Portfolio Portfolio { get; set; }

    public void addPortfolio(Portfolio portfolio)
    {
      this.Portfolio = portfolio;
    }

	}
}
