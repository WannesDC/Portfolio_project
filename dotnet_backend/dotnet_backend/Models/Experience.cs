using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class Experience
	{


    public int Id { get; set; }
		public string Company { get; set; }
    public string JobPos { get; set; }
    public string Link { get; set; }
		public string Description { get; set; }
		public DateTime StartYear { get; set; }
		public DateTime EndYear { get; set; }
		public int Position { get; set; }
		public int PortfolioId { get; set; }

    public Experience(string company, string jobPos, string description, DateTime startYear, DateTime endYear, string link):this()
    {
      Company = company;
      JobPos = jobPos;
      Description = description;
      StartYear = startYear;
      EndYear = endYear;
      Link = link;
    }

    public Experience()
    {

    }

    internal void Update(Experience exp)
    {
      Company = exp.Company;
      JobPos = exp.JobPos;
      Description = exp.Description;
      StartYear = exp.StartYear;
      EndYear = exp.EndYear;
      Link = exp.Link;
    }
  }
}
