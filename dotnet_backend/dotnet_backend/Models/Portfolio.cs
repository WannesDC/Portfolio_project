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
		public string PicturePath { get; set; } //?
		public string ResumePath { get; set; }
		public Contact Contact { get; set; }
		public ICollection<Experience> Experiences { get; set; }
		public ICollection<Skill> Skills { get; set; }
		public ICollection<Work> Works { get; set; }
		public ICollection<Education> Educations { get; set; }

    public int IdOfUser { get; set; }
    public User User { get; set; }

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
    public void AddExperience(Experience experience) => Experiences.Add(experience);

    public void AddSkill(Skill skill) => Skills.Add(skill);

    public void AddWork(Work work) => Works.Add(work);
    public void AddEducation(Education education) => Educations.Add(education);
    public void AddContact(Contact contact) => Contact = contact;

    public Experience GetExperience(int id) => Experiences.SingleOrDefault(e => e.Id == id);
    public Skill GetSkill(int id) => Skills.SingleOrDefault(s => s.Id == id);
    public Work GetWork(int id) => Works.SingleOrDefault(w => w.Id == id);
    public Education GetEducation(int id) => Educations.SingleOrDefault(e => e.Id == id);
    public Contact GetContact(int id) => Contact;

    #endregion
  }
}
