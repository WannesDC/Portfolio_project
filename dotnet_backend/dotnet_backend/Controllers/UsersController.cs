using System;

using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using dotnet_backend.DTOs;
using dotnet_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;


namespace dotnet_backend.Controllers
{
	[ApiConventionType(typeof(DefaultApiConventions))]
	[Produces("application/json")]
	[Route("api/[controller]")]
	[ApiController]
    public class UsersController : ControllerBase
    {
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
		private readonly IUserRepisitory _userRepository;
    private readonly IConfiguration _config;

		public UsersController(SignInManager<IdentityUser> signInManager,
          UserManager<IdentityUser> userManager,
          IUserRepisitory context,
          IConfiguration config)
		{
      _signInManager = signInManager;
      _userManager = userManager;
			_userRepository = context;
      _config = config;
		}
    /// <summary>
    /// check
    /// </summary>
    /// <param name="email">check whether an email is used or not</param>
    [AllowAnonymous]
    [HttpGet("checkusername")]
    public async Task<ActionResult<Boolean>> CheckUsername(string email)
    {
      var user = await _userManager.FindByEmailAsync(email);
      return user == null;
    }

    /// <summary>
    /// Login
    /// </summary>
    /// <param name="model">the login details</param>
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<String>> CreateToken(LoginDTO model)
    {
      var user = await _userManager.FindByNameAsync(model.Email);

      if (user != null)
      {
        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

        if (result.Succeeded)
        {
          string token = GetToken(user);
          return Created("", token); //returns only the token                    
        }
      }
      return BadRequest();
    }

    /// <summary>
    /// Register a user
    /// </summary>
    /// <param name="model">the user details</param>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<String>> Register(RegisterDTO model)
    {
      IdentityUser user = new IdentityUser { UserName = model.Email, Email = model.Email };
      User u = new User { Email = model.Email, FirstName = model.FirstName, LastName = model.LastName };
      var result = await _userManager.CreateAsync(user, model.Password);

      if (result.Succeeded)
      {
        _userRepository.Add(u);
        _userRepository.SaveChanges();
        string token = GetToken(user);
        return Created("", token);
      }
      return BadRequest();
    }

    private String GetToken(IdentityUser user)
    {
      // Create the token
      var claims = new[]
      {
              new Claim(JwtRegisteredClaimNames.Sub, user.Email),
              new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));

      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
        null, null,
        claims,
        expires: DateTime.Now.AddMinutes(30),
        signingCredentials: creds);

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    }
}
