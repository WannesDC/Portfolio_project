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
    
    public string Name { get; set; }
    
    public string Description { get; set; }
    
    public string PicturePath { get; set; }
    
    public string ResumePath { get; set; }
  }
}
