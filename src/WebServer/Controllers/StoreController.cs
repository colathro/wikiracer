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
using System.Linq;
using System.Security.Claims;
using System.Text;
using System;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly UserService userService;
        private readonly GameService gameService;
        private readonly IConfiguration configuration;
        private readonly Random random;

        public StoreController(
            UserService _userService,
            ILogger<UserController> _logger,
            IConfiguration _configuration)
        {
            this.logger = _logger;
            this.userService = _userService;
            this.configuration = _configuration;
            this.random = new Random();
        }

        [Authorize]
        [HttpGet("available")]
        public async Task<ActionResult> GetAvailableItems()
        {
            var key = this.HttpContext.User.FindFirst("sub").Value;
            var name = this.HttpContext.User.FindFirst("preferred_username").Value;
            var provider = this.HttpContext.User.FindFirst("iss").Value;
            var user = await this.userService.GetUser(key, provider);

            if (user == null)
            {
                return BadRequest("user does not exist");
            }

            return Ok(StoreService.GetAvailableItems(user));
        }

        [Authorize]
        [HttpPost("unlock")]
        public async Task<ActionResult> UnlockItem([FromQuery] string itemName, [FromQuery] ItemType itemType)
        {
            var key = this.HttpContext.User.FindFirst("sub").Value;
            var name = this.HttpContext.User.FindFirst("preferred_username").Value;
            var provider = this.HttpContext.User.FindFirst("iss").Value;
            var user = await this.userService.GetUser(key, provider);

            if (user == null)
            {
                return BadRequest("user does not exist");
            }

            var item = StoreService.StoreItems.FirstOrDefault(si => si.Name == itemName && si.Type == itemType);

            if (item == default || user.Coins < item.Price)
            {
                return BadRequest("not enough currency");
            }

            switch (itemType)
            {
                case ItemType.Avatar:
                    if (user.UnlockedAvatars.Contains(itemName))
                    {
                        return BadRequest("already unlocked");
                    }

                    user.UnlockedAvatars.Add(item.Name);
                    user.Coins -= item.Price;

                    await this.userService.UpdateItemAsync(user);

                    return Ok();
                case ItemType.Badge:
                    if (user.Badges.Contains(itemName))
                    {
                        return BadRequest("already unlocked");
                    }

                    user.Badges.Add(item.Name);
                    user.Coins -= item.Price;

                    await this.userService.UpdateItemAsync(user);

                    return Ok();
                default:
                    return BadRequest("unknown item type");
            }
        }
    }
}