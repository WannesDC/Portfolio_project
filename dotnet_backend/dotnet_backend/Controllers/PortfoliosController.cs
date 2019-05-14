
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using dotnet_backend.DTOs;
using dotnet_backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace dotnet_backend.Controllers
{
  [ApiConventionType(typeof(DefaultApiConventions))]
  [Produces("application/json")]
  [Route("api/[controller]")]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  [ApiController]
  public class PortfoliosController : ControllerBase
  {
    private readonly IUserRepisitory _uRepository;
    private readonly IPortfolioRepository _pRepository;
    public static string[] ALLOWED_IMAGE_EXT = { "jpg", "jpeg", "gif", "tiff", "bmp", "png" };
    public static string[] ALLOWED_PDF_EXT = { "pdf"};
    public PortfoliosController(IPortfolioRepository context, IUserRepisitory uContext)
    {
      _uRepository = uContext;
      
      _pRepository = context;
    }
    #region Portfolios
    // GET: api/Portfolios
    /// <summary>
    /// Get all portfolios ordered by id
    /// </summary>
    /// <returns>array of portfolios</returns>
    /// 
    [HttpGet]
    [AllowAnonymous]
    public IEnumerable<Portfolio> GetPortfolios()
    {
      return _pRepository.GetAll().OrderBy(p => p.Id);
    }

    // GET: api/PortfoliosByUser
    /// <summary>
    /// Get a User's Portfolio
    /// </summary>
    /// <returns>a portfolio of a user</returns>
    /// 
    [HttpGet("byUser")]
    public ActionResult<PortfolioDTO> GetPortfolioByUser()
    {
      string email = Request.HttpContext.User.Identity.Name;
      User u = _uRepository.GetBy(email);

      Portfolio p = u.Portfolio;
      if (p == null) return NoContent();
      PortfolioDTO pdto = new PortfolioDTO { Id = p.Id, Name = p.Name, Description = p.Description, UserImage = p.UserImage, Resume = p.Resume /*PicturePath = p.PicturePath, ResumePath = p.ResumePath*/ };
      return pdto;
    }

    // GET: api/Portfolios/5
    /// <summary>
    /// Get the portfolio with given id
    /// </summary>
    /// <param name="id">the id of the Portfolio</param>
    /// <returns>The Portfolio</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public ActionResult<Portfolio> GetPortfolio(int id)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null) return NotFound();
      return p;
    }

    //Create
    // POST: api/Portfolios
    /// <summary>
    /// Adds a new portfolio
    /// </summary>
    /// <param name="portfolio">the new portfolio</param>
    [HttpPost]
    public ActionResult<PortfolioDTO> PostPortfolio(Portfolio p)
    {
      string email = Request.HttpContext.User.Identity.Name;
      User u = _uRepository.GetBy(email);
     // Console.WriteLine(email);
      u.Portfolio = p;
      _pRepository.Add(p);
      _pRepository.SaveChanges();

      PortfolioDTO pdto = new PortfolioDTO {Name = p.Name, Description = p.Description /*PicturePath = p.PicturePath, ResumePath = p.ResumePath*/ };

      return CreatedAtAction(nameof(GetPortfolio), new { id = p.Id }, pdto);
    }

    //update
    // PUT: api/Portfolios/5
    /// <summary>
    /// Modifies a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio to be modified</param>
    [HttpPut("{id}")]
    public IActionResult putPortfolio(int id, PortfolioDTO por)
    {

      Portfolio p = _pRepository.GetBy(id);
      if(p == null)
      {
        return NotFound();
      }

      if (por.Name != "") { p.Name = por.Name; }
      if (por.Description != "") { p.Description = por.Description; }
      //if (por.UserImage != null) { p.UserImage = por.UserImage; }
      //if (por.Resume != null) { p.Resume = por.Resume;  }
      

      _pRepository.Update(p);
      _pRepository.SaveChanges();
      return NoContent();
    }

    // DELETE: api/Portfolios/5
    /// <summary>
    /// Deletes a Portfolio
    /// </summary>
    /// <param name="id">the id of the Portfolio to be deleted</param>
    [HttpDelete("{id}")]
    public ActionResult<Portfolio> DeletePortfolio(int id)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null)
      {
        return NotFound();

      }
      _pRepository.Delete(p);
      _pRepository.SaveChanges();
      return p;

    }
    #endregion

    #region Image & PDF

    [HttpPost("image")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> PostUserImage([FromForm]IFormFile file)
    {
      if (file.Length > 20000000)
      {
        return BadRequest("Your file is too big.");
      }
      var fileNameSplit = file.FileName.Split(".");
      string extension = fileNameSplit[fileNameSplit.Length - 1];
      if (!ALLOWED_IMAGE_EXT.Contains(extension.ToLower()))
      {
        return BadRequest("Your file is not an image.");
      }
      string email = Request.HttpContext.User.Identity.Name;
      User u = _uRepository.GetBy(email);

      Portfolio por = u.Portfolio;

      string name = file.FileName.Substring(0, file.FileName.Length - extension.Length - 2);
      using (var ms = new MemoryStream())
      {
        file.CopyTo(ms);
        var fileBytes = ms.ToArray();
        por.UserImage = new UserImage { Image = fileBytes, Portfolio = por, FileName = name, Extension = extension };
      }
      _pRepository.SaveChanges();
      return NoContent();
    }

    [HttpGet("image/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetUserImage(int id)
    {
      Portfolio por = _pRepository.GetBy(id);
      var image = por.UserImage;
      if (image == null)
      {
        return NotFound();
      }
      return File(image.Image, $"image/{image.Extension.ToLower()}", $"{image.FileName}.{image.Extension}");
    }

    [HttpDelete("image")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public IActionResult ResetUserImage()
    {
      string email = Request.HttpContext.User.Identity.Name;
      User u = _uRepository.GetBy(email);

      Portfolio por = u.Portfolio;
      por.UserImage = null;
      _pRepository.SaveChanges();
      return NoContent();
    }


    [HttpPost("resume")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> PostResume([FromForm]IFormFile file)
    {
      if (file.Length > 20000000)
      {
        return BadRequest("Your file is too big.");
      }
      var fileNameSplit = file.FileName.Split(".");
      string extension = fileNameSplit[fileNameSplit.Length - 1];
      if (!ALLOWED_PDF_EXT.Contains(extension.ToLower()))
      {
        return BadRequest("Your file is not a pdf.");
      }
      string email = Request.HttpContext.User.Identity.Name;
      User u = _uRepository.GetBy(email);
      Portfolio por = u.Portfolio;

      string name = file.FileName.Substring(0, file.FileName.Length - extension.Length - 2);
      using (var ms = new MemoryStream())
      {
        file.CopyTo(ms);
        var fileBytes = ms.ToArray();
        por.Resume = new Resume { PDF = fileBytes, Portfolio = por, FileName = name, Extension = extension };
      }
      _pRepository.SaveChanges();
      return NoContent();
    }

    [HttpGet("resume/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetResume(int id)
    {
      Portfolio por = _pRepository.GetBy(id);
      var image = por.UserImage;
      if (image == null)
      {
        return NotFound();
      }
      return File(image.Image, $"image/{image.Extension.ToLower()}", $"{image.FileName}.{image.Extension}");
    }

    [HttpDelete("resume")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public IActionResult ResetResume()
    {
      string email = Request.HttpContext.User.Identity.Name;
      User u = _uRepository.GetBy(email);

      Portfolio por = u.Portfolio;
      por.UserImage = null;
      _pRepository.SaveChanges();
      return NoContent();
    }


    #endregion

    #region Contact
    /// <summary>
    /// Get Contact for a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio</param>
    [HttpGet("{id}/contact/")]
    public ActionResult<Contact> GetContact(int id)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Contact c = portfolio.GetContact();
      if (c == null)
        return NotFound();
      return c;
    }

    /// <summary>
    /// Adds contact to Portfolio
    /// </summary>
    /// <param name="id">the id of the Portfolio</param>
    /// <param name="contact">the experience to be added</param>
    [HttpPost("{id}/contact")]
    public ActionResult<Contact> PostContact(int id, Contact contact)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Contact tempContact = new Contact(contact.Name, contact.Surname, contact.Email, contact.BirthDate, contact.Street, contact.City, contact.PostalCode, contact.Country);
      portfolio.AddContact(tempContact);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetContact", new { id = portfolio.Id, contactId = portfolio.Contact.Id }, portfolio.Contact);
    }

    /// <summary>
    /// Modifies a contact
    /// </summary>
    /// <param name="id">id of the portfolio to be modified</param>
    /// <param name="contactId">id of the contact to be modified</param>
    /// <param name="contact">the modified Contact</param>
    [HttpPut("{id}/contact/{contactId}")]
    public IActionResult putContact(int id, Contact contact, int contactId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Contact c = portfolio.Contact;
      if (c == null)
      {
        return BadRequest("contact does not exist for portfolio.");
      }
      c.Update(contact);
      _pRepository.SaveChanges();
      return NoContent();
    }

    /// <summary>
    /// Deletes a Contact
    /// </summary>
    /// <param name="id">the id of the portfolio on which the contact is deleted</param>
    /// /// <param name="contactId">id of the contact to be modified</param>
    [HttpDelete("{id}/contact/{contactId}")]
    public ActionResult<Contact> DeleteContact(int id, int contactId)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null)
      {
        return NotFound();

      }
      Contact contact = p.Contact;

      p.Contact = null;
      _pRepository.SaveChanges();
      return contact;

    }
    #endregion

    #region Experience
    /// <summary>
    /// Get an experience for a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio</param>
    [HttpGet("{id}/experiences/")]
    public ActionResult<Experience[]> GetExperience(int id)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      ICollection<Experience> e = portfolio.GetExperience();
      if (e == null)
        return NotFound();
      return e.ToArray();
    }

    /// <summary>
    /// Adds an experience to Portfolio
    /// </summary>
    /// <param name="id">the id of the Portfolio</param>
    /// <param name="experience">the experience to be added</param>
    [HttpPost("{id}/experiences")]
    public ActionResult<Experience> PostExperience(int id, Experience experience)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      var experienceToCreate = new Experience(experience.Company,experience.JobPos, experience.Description, experience.StartYear, experience.EndYear, experience.Link);
      portfolio.AddExperience(experienceToCreate);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetExperience", new { id = portfolio.Id, experienceId = experienceToCreate.Id }, experienceToCreate);
    }

    /// <summary>
    /// Modifies an experience
    /// </summary>
    /// <param name="id">id of the portfolio to be modified</param>
    /// <param name="experienceId">id of the experience to be modified</param>
    /// <param name="exp">the modified Experience</param>
    [HttpPut("{id}/experiences/{experienceId}")]
    public IActionResult putExperience(int id, Experience exp, int experienceId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Experience experience = portfolio.Experiences.SingleOrDefault(e => e.Id == experienceId);
      if (experience == null)
      {
        return BadRequest("experience does not exist for portfolio.");
      }
      experience.Update(exp);
      _pRepository.SaveChanges();
      return NoContent();
    }

    /// <summary>
    /// Deletes an experience
    /// </summary>
    /// <param name="id">the id of the portfolio on which the experience is deleted</param>
    /// /// <param name="experienceId">id of the experience to be modified</param>
    [HttpDelete("{id}/experiences/{experienceId}")]
    public ActionResult<Experience> DeleteExperience(int id, int experienceId)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null)
      {
        return NotFound();

      }
      Experience experience = p.Experiences.SingleOrDefault(e => e.Id == experienceId);

      p.Experiences.Remove(experience);
      _pRepository.SaveChanges();
      return experience;

    }

    #endregion

    #region Works
    /// <summary>
    /// Get a work for a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio</param>

    [HttpGet("{id}/works/")]
    public ActionResult<Work[]> GetWork(int id)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      ICollection<Work> e = portfolio.GetWork();
      if (e == null)
        return NotFound();
      return e.ToArray();
    }
    /// <summary>
    /// Adds a work to Portfolio
    /// </summary>
    /// <param name="id">the id of the Portfolio</param>
    /// <param name="work">the work to be added</param>
    [HttpPost("{id}/works")]
    public ActionResult<Work> PostWork(int id, Work work)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      var workToCreate = new Work(work.WorkName, work.Description, work.TimePublished, work.Link, work.ImagePath);
      portfolio.AddWork(workToCreate);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetWork", new { id = portfolio.Id, workId = workToCreate.Id }, workToCreate);
    }

    /// <summary>
    /// Modifies a work
    /// </summary>
    /// <param name="id">id of the portfolio to be modified</param>
    /// <param name="workId">id of the work to be modified</param>
    /// <param name="work">the modified work</param>
    [HttpPut("{id}/works/{workId}")]
    public IActionResult putWork(int id, Work work, int workId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Work w = portfolio.Works.SingleOrDefault(e => e.Id == workId);
      if (w == null)
      {
        return BadRequest("work does not exist for portfolio.");
      }
      w.Update(work);
      _pRepository.SaveChanges();
      return NoContent();
    }

    /// <summary>
    /// Deletes a work
    /// </summary>
    /// <param name="id">the id of the portfolio on which the work is deleted</param>
    /// <param name="workId">id of the work to be modified</param>
    [HttpDelete("{id}/works/{workId}")]
    public ActionResult<Work> DeleteWork(int id, int workId)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null)
      {
        return NotFound();

      }
      Work work = p.Works.SingleOrDefault(e => e.Id == workId);

      p.Works.Remove(work);
      _pRepository.SaveChanges();
      return work;

    }
    #endregion

    #region Educations
    /// <summary>
    /// Get an education for a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio</param>
    [HttpGet("{id}/educations/")]
    public ActionResult<Education[]> GetEducation(int id)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      ICollection<Education> e = portfolio.GetEducation();
      if (e == null)
        return NotFound();
      return e.ToArray();
    }
    /// <summary>
    /// Adds an education to Portfolio
    /// </summary>
    /// <param name="id">the id of the Portfolio</param>
    /// <param name="edu">the education to be added</param>
    [HttpPost("{id}/educations")]
    public ActionResult<Education> PostEducation(int id, Education edu)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      var eduToCreate = new Education(edu.Institute, edu.Description, edu.Course, edu.StartYear, edu.EndYear, edu.Link);
      portfolio.AddEducation(eduToCreate);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetEducation", new { id = portfolio.Id, educationId = eduToCreate.Id }, eduToCreate);
    }

    /// <summary>
    /// Modifies an education
    /// </summary>
    /// <param name="id">id of the portfolio to be modified</param>
    /// <param name="educationId">id of the education to be modified</param>
    /// <param name="education">the modified education</param>
    [HttpPut("{id}/educations/{educationId}")]
    public IActionResult putEducation(int id, Education education, int educationId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Education w = portfolio.Educations.SingleOrDefault(e => e.Id == educationId);
      if (w == null)
      {
        return BadRequest("education does not exist for portfolio.");
      }
      w.Update(education);
      _pRepository.SaveChanges();
      return NoContent();
    }

    /// <summary>
    /// Deletes an education
    /// </summary>
    /// <param name="id">the id of the portfolio on which the education is deleted</param>
    /// <param name="educationId">id of the education to be modified</param>
    [HttpDelete("{id}/educations/{educationId}")]
    public ActionResult<Education> DeleteEducation(int id, int educationId)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null)
      {
        return NotFound();

      }
      Education edu = p.Educations.SingleOrDefault(e => e.Id == educationId);

      p.Educations.Remove(edu);
      _pRepository.SaveChanges();
      return edu;

    }
    #endregion

    #region Skills
    /// <summary>
    /// Get a skill for a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio</param>
    [HttpGet("{id}/skills/")]
    public ActionResult<Skill[]> GetSkill(int id)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      ICollection<Skill> e = portfolio.GetSkill();
      if (e == null)
        return NotFound();
      return e.ToArray();
    }
    /// <summary>
    /// Adds a skill to Portfolio
    /// </summary>
    /// <param name="id">the id of the Portfolio</param>
    /// <param name="skill">the skill to be added</param>
    [HttpPost("{id}/skills")]
    public ActionResult<Skill> PostSkill(int id, Skill skill)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      var skillToCreate = new Skill(skill.Type, skill.Description, skill.IconPath);
      portfolio.AddSkill(skillToCreate);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetSkill", new { id = portfolio.Id, skillId = skillToCreate.Id }, skillToCreate);
    }

    /// <summary>
    /// Modifies a skill
    /// </summary>
    /// <param name="id">id of the portfolio to be modified</param>
    /// <param name="skillId">id of the skill to be modified</param>
    /// <param name="skill">the modified skill</param>
    [HttpPut("{id}/skills/{skillId}")]
    public IActionResult putSkill(int id, Skill skill, int skillId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Skill w = portfolio.Skills.SingleOrDefault(e => e.Id == skillId);
      if (w == null)
      {
        return BadRequest("skill does not exist for portfolio.");
      }
      w.Update(skill);
      _pRepository.SaveChanges();
      return NoContent();
    }

    /// <summary>
    /// Deletes a skill
    /// </summary>
    /// <param name="id">the id of the portfolio on which the skill is deleted</param>
    /// <param name="skillId">id of the skill to be modified</param>
    [HttpDelete("{id}/skills/{skillId}")]
    public ActionResult<Skill> DeleteSkill(int id, int skillId)
    {
      Portfolio p = _pRepository.GetBy(id);
      if (p == null)
      {
        return NotFound();

      }
      Skill skill = p.Skills.SingleOrDefault(e => e.Id == skillId);

      p.Skills.Remove(skill);
      _pRepository.SaveChanges();
      return skill;

    }
    #endregion
  }
}
