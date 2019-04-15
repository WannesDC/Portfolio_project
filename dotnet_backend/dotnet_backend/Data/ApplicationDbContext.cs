using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using test.Models;

namespace test.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){

		}

		protected override void OnModelCreating(ModelBuilder mb)
		{
			base.OnModelCreating(mb);

			//User
			//associations
			mb.Entity<User>()
				.HasOne(u => u.Portfolio)
				.WithOne()
				.HasForeignKey<Portfolio>(p => p.UserId)
				.IsRequired();
			//mapping
			mb.Entity<User>()
				.Property(u => u.UserName)
				.IsRequired()
				.HasMaxLength(25);
			mb.Entity<User>()
				.Property(u => u.Email)
				.IsRequired()
				.HasMaxLength(50);


			//Portfolio
			//associations
			mb.Entity<Portfolio>()
				.HasOne(p => p.Contact)
				.WithOne()
				.HasForeignKey<Contact>(c => c.PortfolioId);
				
			mb.Entity<Portfolio>()
				.HasMany(p => p.Educations)
				.WithOne()
				;
			mb.Entity<Portfolio>()
				.HasMany(p => p.Experiences)
				.WithOne();
			mb.Entity<Portfolio>()
				.HasMany(p => p.Skills)
				.WithOne();
			mb.Entity<Portfolio>()
				.HasMany(p => p.Works)
				.WithOne();
			//mapping
			mb.Entity<Portfolio>()
				.Property(p => p.Name)
				.IsRequired()
				.HasMaxLength(25);

			//Seed Db:
			byte[] data = System.Text.Encoding.ASCII.GetBytes("testjes");
			data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
			String hash = System.Text.Encoding.ASCII.GetString(data);

			mb.Entity<User>().HasData(
				new User
				{
					Id = 1,
					UserName = "Wannes",
					Email = "wannes_decraene@hotmail.com",
					Password = hash,				
				}
				);

			mb.Entity<Portfolio>().HasData(
				new Portfolio
				{
					Id=1,
					Name="testjes",
					PicturePath="randompath",
					Description="test the db",
					UserId=1
				}
				);

			mb.Entity<Contact>().HasData(
				new Contact
				{
					Id=1,
					BirthDate=DateTime.Today,
					Surname="De Craene",
					Name="Wannes",
					City="Sint-Denijs-Westrem",
					PostalCode=9051,
					Street="Maurice Dewulflaan 5",
					Country="Belgium",
					Email="wannes_decraene@hotmail.com",
					PortfolioId=1
				}
				);

			mb.Entity<Skill>().HasData(
				new Skill
				{
					Id = 1,
					Type= "Angular",
					Description="Framework for front end web pages.",
					IconPath="randompath",
					PortfolioId=1,
					Position=2				
				}
				);
			mb.Entity<Skill>().HasData(
				new Skill
				{
					Id = 2,
					Type = ".NET",
					Description = "Framework for back end web pages.",
					IconPath = "randompath",
					PortfolioId = 1,
					Position = 1
				}
				);

			mb.Entity<Education>().HasData(
				new Education
				{
					Id=1,
					Course="Applied Computer Siences",
					Description="A course where you learn IT",
					Institute="University College Ghent",
					Link="www.hogent.be",
					Position=1,
					StartYear= new DateTime(2016,9,25),
					EndYear = new DateTime(2020,6,30),
					PortfolioId=1
				}
				);

			mb.Entity<Work>().HasData(
				new Work
				{
					Id=1,
					WorkName="Portfolio",
					Description="A program to build portfolios without having to code.",
					ImagePath="somepath",
					Link="somelink",
					TimePublished= DateTime.Today,
					PortfolioId=1,
					Position=1
				}
				);

			mb.Entity<Experience>().HasData(
				new Experience
				{
					Id=1,
					Company="Carrefour",
					Description="Cashier for Carrefour",
					Link="www.carrefour.be",
					StartYear= new DateTime(2016, 8, 25),
					EndYear = new DateTime(2016, 9, 25),
					PortfolioId=1,
					Position=1
				}
				);



		}

		public DbSet<User> Users { get; set; }
    public DbSet<Portfolio> Portfolios { get; set; }
  }
}
