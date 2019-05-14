using dotnet_backend.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace dotnet_backend.Data
{
	
	public class DataInitializer
	{
		private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<IdentityUser> _userManager;

    public DataInitializer(ApplicationDbContext dbContext, UserManager<IdentityUser> userManager)
		{
			_dbContext = dbContext;
      _userManager = userManager;
		}

		public async Task InitializeData()
		{
			_dbContext.Database.EnsureDeleted();
			if (_dbContext.Database.EnsureCreated())
			{
        //seeding the database with users, see DBContext
        //
        await InitializeProfiles();
        _dbContext.SaveChanges();
        
      }
		}

    private async Task InitializeProfiles()
    {
      User u = new User { Email = "wannes.decraene.y0550@student.hogent.be", FirstName = "Wannes", LastName = "De Craene" };
      await CreateUser(u.Email, "P@ssword1111");

      Portfolio p = new Portfolio
      {
        Name = "testjes",
        //PicturePath = "randompath",
        Description = "test the db"
      };


      Contact c = new Contact
      {
        BirthDate = DateTime.Today,
        Surname = "De Craene",
        Name = "Wannes",
        City = "Sint-Denijs-Westrem",
        PostalCode = 9051,
        Street = "Maurice Dewulflaan 5",
        Country = "Belgium",
        Email = "wannes_decraene@hotmail.com",
      };

      Skill s1 = new Skill
      {
        Type = "Angular",
        Description = "Framework for front end web pages.",
        IconPath = "randompath",
        Position = 2
        
      };

          Skill s2 = new Skill
          {
            Type = ".NET",
            Description = "Framework for back end web pages.",
            IconPath = "randompath",
            Position = 1
          };

         Education e = new Education
          {
            Course = "Applied Computer Siences",
            Description = "A course where you learn IT",
            Institute = "University College Ghent",
            Link = "www.hogent.be",
            Position = 1,
            StartYear = new DateTime(2016, 9, 25),
            EndYear = new DateTime(2020, 6, 30),

          };

          Work w=new Work
          {
            WorkName = "Portfolio",
            Description = "A program to build portfolios without having to code.",
            ImagePath = "somepath",
            Link = "somelink",
            TimePublished = DateTime.Today,
            Position = 1
          };

         Experience ex= new Experience
          {
            Company = "Carrefour",
            Description = "Cashier for Carrefour",
            Link = "www.carrefour.be",
            StartYear = new DateTime(2016, 8, 25),
            EndYear = new DateTime(2016, 9, 25),
            Position = 1
          };

      p.Contact = c;
      _dbContext.Users.Add(u);
      u.Portfolio = p;
      _dbContext.SaveChanges();

    }

    private async Task CreateUser(string email, string password)
    {
      var user = new IdentityUser { UserName = email, Email = email };
      await _userManager.CreateAsync(user, password);
    }
  }
}
