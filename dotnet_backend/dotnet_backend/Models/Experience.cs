using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Models
{
	public class Experience
	{
		public int Id { get; set; }
		public string Company { get; set; }
		public string Link { get; set; }
		public string Description { get; set; }
		public DateTime StartYear { get; set; }
		public DateTime EndYear { get; set; }
		public int Position { get; set; }
		public int PortfolioId { get; set; }
	}
}
