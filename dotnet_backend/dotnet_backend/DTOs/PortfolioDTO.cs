using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.DTOs
{
  public class PortfolioDTO
  {
    
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string PicturePath { get; set; }
    [Required]
    public string ResumePath { get; set; }
  }
}
