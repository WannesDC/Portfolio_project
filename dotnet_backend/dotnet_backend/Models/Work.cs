using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Models
{
	public class Work
	{
		public int Id { get; set; }
		public string WorkName { get; set; }
		public string Description { get; set; }
		public DateTime TimePublished { get; set; }
		public string Link { get; set; }
		public string ImagePath { get; set; }
		public int Position { get; set; }
		public int PortfolioId { get; set; }

	}
}