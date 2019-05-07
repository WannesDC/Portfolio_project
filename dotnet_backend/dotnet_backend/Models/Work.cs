using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
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


 

    public Work()
    {

    }

    public Work(string workName, string description, DateTime timePublished, string link, string imagePath):this()
    {
      WorkName = workName;
      Description = description;
      TimePublished = timePublished;
      Link = link;
      ImagePath = imagePath;
    }

    internal void Update(Work work)
    {
      WorkName = work.WorkName;
      TimePublished = work.TimePublished;
      Link = work.Link;
      ImagePath = work.ImagePath;

    }
  }
}
