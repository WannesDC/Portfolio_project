using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
  public class Resume
  {
    public int PortfolioId { get; set; }
    public byte[] PDF { get; set; }
    public string Extension  { get; set; }
    public string FileName { get; set; }
    public Portfolio Portfolio { get; set; }
  }
}
