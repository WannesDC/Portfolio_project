
using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_backend.DTOs;
using dotnet_backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
      PortfolioDTO pdto = new PortfolioDTO { Id = p.Id, Name = p.Name, Description = p.Description, PicturePath = p.PicturePath, ResumePath = p.ResumePath };
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

      PortfolioDTO pdto = new PortfolioDTO {Name = p.Name, Description = p.Description, PicturePath = p.PicturePath, ResumePath = p.ResumePath };

      return CreatedAtAction(nameof(GetPortfolio), new { id = p.Id }, pdto);
    }

    //update
    // PUT: api/Portfolios/5
    /// <summary>
    /// Modifies a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio to be modified</param>
    /// <param name="portfolio">the modified portfolio</param>
    [HttpPut("{id}")]
    public IActionResult putPortfolio(int id, Portfolio p)
    {
      if (id != p.Id)
      {
        return BadRequest();
      }
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

    #region Experience
    /// <summary>
    /// Get an experience for a Portfolio
    /// </summary>
    /// <param name="id">id of the Portfolio</param>
    /// <param name="experienceId">id of the Experience</param>
    [HttpGet("{id}/experiences/{experienceId}")]
    public ActionResult<Experience> GetExperience(int id, int experienceId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Experience e = portfolio.GetExperience(experienceId);
      if (e == null)
        return NotFound();
      return e;
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
      var experienceToCreate = new Experience(experience.Company, experience.Description, experience.StartYear, experience.EndYear, experience.Link);
      portfolio.AddExperience(experienceToCreate);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetExperience", new { id = portfolio.Id, ExperienceId = experienceToCreate.Id }, experienceToCreate);
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
    /// <param name="workId">id of the Work</param>
    [HttpGet("{id}/works/{workId}")]
    public ActionResult<Work> GetWork(int id, int workId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Work e = portfolio.GetWork(workId);
      if (e == null)
        return NotFound();
      return e;
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
      var workToCreate = new Work(work.WorkName, work.TimePublished, work.Link, work.ImagePath);
      portfolio.AddWork(workToCreate);
      _pRepository.SaveChanges();
      return CreatedAtAction("GetWork", new { id = portfolio.Id, WorkId = workToCreate.Id }, workToCreate);
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
    /// <param name="educationId">id of the Education</param>
    [HttpGet("{id}/educations/{educationId}")]
    public ActionResult<Education> GetEducation(int id, int educationId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Education e = portfolio.GetEducation(educationId);
      if (e == null)
        return NotFound();
      return e;
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
      return CreatedAtAction("GetEducation", new { id = portfolio.Id, WorkId = eduToCreate.Id }, eduToCreate);
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
    /// <param name="skillId">id of the skill</param>
    [HttpGet("{id}/skills/{skillId}")]
    public ActionResult<Skill> GetSkill(int id, int skillId)
    {
      if (!_pRepository.TryGetPortfolio(id, out var portfolio))
      {
        return NotFound();
      }
      Skill e = portfolio.GetSkill(skillId);
      if (e == null)
        return NotFound();
      return e;
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
      return CreatedAtAction("GetSkill", new { id = portfolio.Id, WorkId = skillToCreate.Id }, skillToCreate);
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
