using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace test.Models
{
	public class Portfolio
	{
		#region Properties
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string PicturePath { get; set; } //?
		public string ResumePath { get; set; }
		public Contact Contact { get; set; }
		public IEnumerable<Experience> Experiences { get; set; }
		public IEnumerable<Skill> Skills { get; set; }
		public IEnumerable<Work> Works { get; set; }
		public IEnumerable<Education> Educations { get; set; }
		public int UserId { get; set; }
		#endregion

		#region Constructors


		public Portfolio(string name, string picturePath, string description) : this()
		{
			Name = name;
			PicturePath = picturePath;
			Description = description;
		}

		public Portfolio()
		{
		}
		#endregion

		#region Methods
		#endregion
	}
}
