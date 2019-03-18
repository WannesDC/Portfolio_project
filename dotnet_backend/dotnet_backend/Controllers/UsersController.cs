using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using test.Models;

namespace test.Controllers
{
	[ApiConventionType(typeof(DefaultApiConventions))]
	[Produces("application/json")]
	[Route("api/[controller]")]
	[ApiController]
    public class UsersController : ControllerBase
    {

		private readonly IUserRepisitory _userRepository;
		public UsersController(IUserRepisitory context)
		{
			_userRepository = context;
		}

		// GET: api/Users
		/// <summary>
		/// Get all users ordered by name
		/// </summary>
		/// <returns>array of users</returns>
		/// 
		[HttpGet]
		public IEnumerable<User> GetUsers()
		{
			return _userRepository.GetAll().OrderBy(u => u.UserName);
		}
		[HttpGet("{id}")]
		public ActionResult<User> GetUser(int id)
		{
			User user = _userRepository.GetBy(id);
			if (user == null) return NotFound();
			return user;
		}


    }
}