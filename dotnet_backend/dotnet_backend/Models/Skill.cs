using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Models
{
	public class Skill
	{
		public int Id { get; set; }
		public string Type { get; set; }
		public string Description { get; set; }
		public string IconPath { get; set; }
		public int Position { get; set; }
		public int PortfolioId { get; set; }
	}
}
