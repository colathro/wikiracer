using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebServer.Services;
using DataModels.CosmosModels;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly UserService userService;
        private readonly IConfiguration configuration;
        private readonly Random random;

        public UserController(UserService _userService, ILogger<UserController> _logger, IConfiguration _configuration)
        {
            this.logger = _logger;
            this.userService = _userService;
            this.configuration = _configuration;
            this.random = new Random();
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult> Me()
        {
            var key = this.HttpContext.User.FindFirst("sub").Value;
            var name = this.HttpContext.User.FindFirst("preferred_username").Value;
            var provider = this.HttpContext.User.FindFirst("iss").Value;
            var user = await this.userService.GetUser(key, provider);

            if (user == null)
            {
                user = await this.InitializeUser(key, name, provider);
            }

            return Ok(user);
        }

        [HttpGet("guest")]
        public async Task<ActionResult> Guest()
        {
            var resp = this.InitializeGuestUser();

            return Ok(resp);
        }

        private async Task<User> InitializeUser(string key, string name, string provider)
        {
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Key = key,
                DisplayName = name,
                AuthProvider = this.userService.MapAuthType(provider),
                CreatedOn = DateTime.UtcNow,
                GameIds = new List<string>(),
                Level = 1,
                Avatar = "default",
                Badges = new List<string> { "beta" },
                UnlockedAvatars = new List<string> { "default" }
            };
            await this.userService.AddItemAsync(user);
            return user;
        }

        private object InitializeGuestUser()
        {
            var issuer = "https://wikiracer.com";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.configuration["ENCRYPTION_KEY"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var FirstPart = GuestNameSeeds.First[this.random.Next(GuestNameSeeds.First.Length)];
            var SecondPart = GuestNameSeeds.Second[this.random.Next(GuestNameSeeds.Second.Length)];
            var ThirdPart = this.random.Next(99);

            var permClaims = new List<Claim>();
            permClaims.Add(new Claim("sub", Guid.NewGuid().GetHashCode().ToString() + "_GUEST"));
            permClaims.Add(new Claim("preferred_username", $"{FirstPart}{SecondPart}{ThirdPart}"));
            permClaims.Add(new Claim("iss", issuer));

            var token = new JwtSecurityToken(issuer,
                            issuer,
                            permClaims,
                            expires: DateTime.Now.AddDays(1),
                            signingCredentials: credentials);
            var jwt_token = new JwtSecurityTokenHandler().WriteToken(token);
            return new { data = jwt_token };
        }
    }

    public static class GuestNameSeeds
    {
        public static string[] First = new string[] { "Running", "Leaping", "Rolling", "Sprinting", "Sitting", "Squaking", "Swimming", "Clapping", "Lazy", "Fearless", "Confident", "Skeptical", "Confused", "Dizzy", "Upset", "Angry" };
        public static string[] Second = new string[] { "Monkey", "Rabbit", "Kangaroo", "Koala", "Dog", "Cat", "Mouse", "Turtle", "Whale", "Goose", "Chicken", "Wolf", "Dolphin", "Fish", "Bear", "Deer", "Alien" };
    }
}