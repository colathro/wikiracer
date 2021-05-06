using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DataModels.Services;
using DataModels.CosmosModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System;

namespace WebServer.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly UserService userService;

        public UserController(UserService _userService, ILogger<SampleController> _logger)
        {
            this.logger = _logger;
            this.userService = _userService;
        }

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

        private async Task<User> InitializeUser(string key, string name, string provider)
        {
            var user = new User { Id = Guid.NewGuid().ToString(), Key = key, DisplayName = name, AuthProvider = this.userService.MapAuthType(provider) };
            await this.userService.AddItemAsync(user);
            return user;
        }
    }
}