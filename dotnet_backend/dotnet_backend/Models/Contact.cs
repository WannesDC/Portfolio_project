using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class Contact
	{
		public int Id { get; set; }
		public string Email { get; set; }
		public string Name { get; set; }
		public string Surname { get; set; }
		public string Street { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public int PostalCode { get; set; }
		public DateTime BirthDate { get; set; }
		public int PortfolioId { get; set; }

	}
}
