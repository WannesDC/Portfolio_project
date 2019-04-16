using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class Skill
	{

    public int Id { get; set; }
		public string Type { get; set; }
		public string Description { get; set; }
		public string IconPath { get; set; }
		public int Position { get; set; }
		public int PortfolioId { get; set; }
    public Skill(string type, string description, string iconPath) : this()
    {
      Type = type;
      Description = description;
      IconPath = iconPath;
    }

    public Skill()
    {

    }
    internal void Update(Skill skill)
    {
      Type = skill.Type;
      Description = skill.Description;
      IconPath = skill.IconPath;
    }
  }
}
