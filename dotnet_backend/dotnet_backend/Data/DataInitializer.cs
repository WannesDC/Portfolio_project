using dotnet_backend.Models;
using Microsoft.AspNetCore.Identity;

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
        User u = new User { Email = "wannes.decraene.y0550@student.hogent.be", FirstName = "Wannes", LastName = "De Craene" };
        _dbContext.Users.Add(u);
        await CreateUser(u.Email, "P@ssword1111");
        _dbContext.SaveChanges();
      }
		}

    private async Task CreateUser(string email, string password)
    {
      var user = new IdentityUser { UserName = email, Email = email };
      await _userManager.CreateAsync(user, password);
    }
  }
}
