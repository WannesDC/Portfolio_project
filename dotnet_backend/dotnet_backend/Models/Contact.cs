using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
	public class Contact
	{
    public Contact() { }
    public Contact(string name, string surname, string email, DateTime birthDate, string street, string city, int postalCode, string country)
    {
      Name = name;
      Surname = surname;
      Email = email;
      BirthDate = birthDate;
      Street = street;
      City = city;
      PostalCode = postalCode;
      Country = country;
    }

    public int Id { get; set; }
		public string Email { get; set; }
		public string Name { get; set; }
		public string Surname { get; set; }
		public string Street { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public int PostalCode { get; set; }
		public DateTime BirthDate { get; set; }
		public int PortfolioId { get; set; }

    internal void Update(Contact contact)
    {
      Name = contact.Name;
      Surname = contact.Surname;
      Email = contact.Email;
      BirthDate = contact.BirthDate;
      Street = contact.Street;
      City = contact.City;
      PostalCode = contact.PostalCode;
      Country = contact.Country;
    }
  }
}
