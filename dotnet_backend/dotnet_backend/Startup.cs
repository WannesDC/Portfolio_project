using System;
using System.Text;
using System.Threading.Tasks;
using dotnet_backend.Data;
using dotnet_backend.Data.Repositories;
using dotnet_backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.SwaggerGeneration.Processors.Security;

namespace dotnet_backend
{
  public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

			services.AddDbContext<ApplicationDbContext>(options =>
			options.UseSqlServer(Configuration.GetConnectionString("ApplicationDbContext")));

			services.AddScoped<DataInitializer>();
			services.AddScoped<IUserRepisitory, UserRepository>();
      services.AddScoped<IPortfolioRepository, PortfolioRepository>();

      services.AddOpenApiDocument(c =>
      {
        c.DocumentName = "apidocs";
        c.Title = "Portfolio API";
        c.Version = "v1";
        c.Description = "The Portfolio API documentation description.";
        c.DocumentProcessors.Add(new SecurityDefinitionAppender("JWT Token", new SwaggerSecurityScheme
        {
          Type = SwaggerSecuritySchemeType.ApiKey,
          Name = "Authorization",
          In = SwaggerSecurityApiKeyLocation.Header,
          Description = "Copy 'Bearer' + valid JWT token into field"
        }));
        c.OperationProcessors.Add(new OperationSecurityScopeProcessor("JWT Token"));
      });

      //no UI will be added (<-> AddDefaultIdentity)
      services.AddIdentity<IdentityUser, IdentityRole>(cfg => {
        cfg.User.RequireUniqueEmail = true;
        cfg.Password.RequireDigit = false;
        cfg.Password.RequiredLength = 6;
        cfg.Password.RequireNonAlphanumeric = false;
        cfg.Password.RequireUppercase = false;
        cfg.Password.RequireLowercase = false;
      }).AddEntityFrameworkStores<ApplicationDbContext>();

      services.AddAuthentication(x =>
      {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(x => {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Configuration["Tokens:Key"])),
          ValidateIssuer = false,
          ValidateAudience = false,
          RequireExpirationTime = true, //Ensure token hasn't expired
        };
      });

      services.Configure<IdentityOptions>(options =>
      {
        // Password settings.
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
        options.Password.RequiredUniqueChars = 1;

        // Lockout settings.
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;

        // User settings.
        options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
        options.User.RequireUniqueEmail = true;
      });

      services.AddCors(options => options.AddPolicy("AllowAllOrigins", builder => builder.AllowAnyOrigin()));
    }

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, DataInitializer dataInitializer)
		{
      app.Use(async (HttpContext context, Func<Task> next) =>
      {
        await next.Invoke();

        if (context.Response.StatusCode == 404 && !context.Request.Path.Value.Contains("/api"))
        {
          context.Request.Path = new PathString("/index.html");
          await next.Invoke();
        }
      });
      DefaultFilesOptions options = new DefaultFilesOptions();
      options.DefaultFileNames.Clear();
      options.DefaultFileNames.Add("index.html");
      app.UseDefaultFiles();
      app.UseStaticFiles();

      if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
      app.UseAuthentication();
			app.UseMvc();


      app.UseSwaggerUi3();
      app.UseSwagger();

      
      //dataInitializer.InitializeData().Wait();
		}
	}
}
