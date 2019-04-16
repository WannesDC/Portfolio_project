using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class Education
	{

    public int Id { get; set; }
		public string Institute { get; set; }
		public string Link { get; set; }
		public string Description { get; set; }
		public string Course { get; set; }
		public DateTime StartYear { get; set; }
		public DateTime EndYear { get; set; }
		public int Position { get; set; }
		public int PortfolioId { get; set; }

    public Education(string institute, string description, string course, DateTime startYear, DateTime endYear, string link):this()
    {
      Institute = institute;
      Description = description;
      Course = course;
      StartYear = startYear;
      EndYear = endYear;
      Link = link;
    }

    public Education()
    {
        
    }

    internal void Update(Education education)
    {
      Institute = education.Institute;
      Description = education.Description;
      Course = education.Course;
      StartYear = education.StartYear;
      EndYear = education.EndYear;
      Link = education.Link;
    }
  }
}
