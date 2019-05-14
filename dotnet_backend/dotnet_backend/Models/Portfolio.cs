using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class Portfolio
	{
		#region Properties
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
    //public string PicturePath { get; set; } //?
    //public string ResumePath { get; set; }
    public UserImage UserImage { get; set; }
    public Resume Resume { get; set; }
    public Contact Contact { get; set; }

    public ICollection<Experience> Experiences { get; set; }
		public ICollection<Skill> Skills { get; set; }
		public ICollection<Work> Works { get; set; }
		public ICollection<Education> Educations { get; set; }

    public int IdOfUser { get; set; }
    public User User { get; set; }

    public static string[] IMGEXTENSIONS = new string[] { "jpg", "gif", "jpeg", "png" };

    #endregion

    #region Constructors


    /*public Portfolio(string name, string picturePath, string description) : this()
		{
			Name = name;
			PicturePath = picturePath;
			Description = description;
		}*/

		public Portfolio()
		{
    }
    #endregion

    #region Methods

    


public void AddExperience(Experience experience) => Experiences.Add(experience);

    public void AddSkill(Skill skill) => Skills.Add(skill);

    public void AddWork(Work work) => Works.Add(work);
    public void AddEducation(Education education) => Educations.Add(education);
    public void AddContact(Contact contact) => Contact = contact;

    public ICollection<Experience> GetExperience() => Experiences.ToList();
    public ICollection<Skill> GetSkill() => Skills.ToList();
    public ICollection<Work> GetWork() => Works.ToList();
    public ICollection<Education> GetEducation() => Educations.ToList();
    public Contact GetContact() => Contact;

    #endregion
  }
}
