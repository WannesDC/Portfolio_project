using dotnet_backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace dotnet_backend.Data
{
	public class ApplicationDbContext : IdentityDbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){

		}

		protected override void OnModelCreating(ModelBuilder mb)
		{
			base.OnModelCreating(mb);

      //User
      //associations
      //reset back to many to one add p to u in frontend?
      mb.Entity<User>()
          .HasOne(p => p.Portfolio)
          .WithOne(u => u.User)
          .HasForeignKey<Portfolio>(u => u.IdOfUser)
          .OnDelete(DeleteBehavior.Cascade);
        
			//mapping
			mb.Entity<User>()
				.Property(u => u.Email)
				.IsRequired()
				.HasMaxLength(100);
      mb.Entity<User>()
        .Property(u => u.FirstName)
        .IsRequired()
        .HasMaxLength(50);
      mb.Entity<User>()
        .Property(u => u.LastName)
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

      //mb.Entity<Portfolio>().HasData(
      //    new Portfolio
      //    {
      //      Id = 1,
      //      Name = "testjes",
      //      PicturePath = "randompath",
      //      Description = "test the db"
      //    }
      //    );

      //mb.Entity<Contact>().HasData(
      //    new Contact
      //    {
      //      Id = 1,
      //      BirthDate = DateTime.Today,
      //      Surname = "De Craene",
      //      Name = "Wannes",
      //      City = "Sint-Denijs-Westrem",
      //      PostalCode = 9051,
      //      Street = "Maurice Dewulflaan 5",
      //      Country = "Belgium",
      //      Email = "wannes_decraene@hotmail.com",
      //            //PortfolioId=1
      //          }
      //    );

      //mb.Entity<Skill>().HasData(
      //    new Skill
      //    {
      //      Id = 1,
      //      Type = "Angular",
      //      Description = "Framework for front end web pages.",
      //      IconPath = "randompath",
      //            //PortfolioId=1,
      //            Position = 2
      //    }
      //    );
      //mb.Entity<Skill>().HasData(
      //    new Skill
      //    {
      //      Id = 2,
      //      Type = ".NET",
      //      Description = "Framework for back end web pages.",
      //      IconPath = "randompath",
      //            //PortfolioId = 1,
      //            Position = 1
      //    }
      //    );

      //mb.Entity<Education>().HasData(
      //    new Education
      //    {
      //      Id = 1,
      //      Course = "Applied Computer Siences",
      //      Description = "A course where you learn IT",
      //      Institute = "University College Ghent",
      //      Link = "www.hogent.be",
      //      Position = 1,
      //      StartYear = new DateTime(2016, 9, 25),
      //      EndYear = new DateTime(2020, 6, 30),
      //            //PortfolioId=1
      //          }
      //    );

      //mb.Entity<Work>().HasData(
      //    new Work
      //    {
      //      Id = 1,
      //      WorkName = "Portfolio",
      //      Description = "A program to build portfolios without having to code.",
      //      ImagePath = "somepath",
      //      Link = "somelink",
      //      TimePublished = DateTime.Today,
      //            //PortfolioId=1,
      //            Position = 1
      //    }
      //    );

      //mb.Entity<Experience>().HasData(
      //    new Experience
      //    {
      //      Id = 1,
      //      Company = "Carrefour",
      //      Description = "Cashier for Carrefour",
      //      Link = "www.carrefour.be",
      //      StartYear = new DateTime(2016, 8, 25),
      //      EndYear = new DateTime(2016, 9, 25),
      //            //PortfolioId=1,
      //            Position = 1
      //    }
      //    );



    }
    public DbSet<Portfolio> Portfolios { get; set; }
    public DbSet<User> Users { get; set; }

  }
}
