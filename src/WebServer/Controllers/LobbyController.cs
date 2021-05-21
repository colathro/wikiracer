using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DataModels.Services;
using DataModels.CosmosModels;
using System.Collections.Generic;
using DataModels.StorageModels;
using System;
using System.Text;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebServer.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class LobbyController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly LobbyService lobbyService;
        private readonly UserService userService;
        private readonly ArticleService articleService;

        private static Random random = new Random((int)DateTime.Now.Ticks);

        public LobbyController(LobbyService _lobbyService, UserService _userService, ArticleService _articleService, ILogger<LobbyController> _logger)
        {
            this.logger = _logger;
            this.lobbyService = _lobbyService;
            this.userService = _userService;
            this.articleService = _articleService;
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicLobbies([FromQuery] int page)
        {
            var lobbies = await this.lobbyService.GetActiveLobbies();
            return Ok(lobbies);
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinLobby([FromQuery] string lobbyKey)
        {
            var lobby = await this.lobbyService.GetLobby(lobbyKey);
            if (lobby == default)
            {
                return NotFound();
            }

            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());

            if (lobby.Players.Count(u => u.Id == user.Key) >= 1)
            {
                return Ok(lobby);
            }
            else
            {
                if (lobby.BanList.Count(bl => bl == user.Key) >= 1)
                {
                    return BadRequest();
                }

                lobby.Players.Add(new LobbyPlayer
                {
                    Id = user.Key,
                    DisplayName = user.DisplayName,
                    Avatar = user.Avatar,
                    AuthProvider = user.AuthProvider,
                    CurrentArticle = "",
                    Finished = false,
                    Active = false,
                    LastUpdate = DateTime.UtcNow
                });

                await this.lobbyService.UpdateItemAsync(lobby);
                return Ok(lobby);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateLobby()
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
            var players = new List<LobbyPlayer>();

            players.Add(this.ConvertUserToLobbyPlayer(user));
            var lobby = new Lobby
            {
                Owner = user,
                Players = players,
                Id = Guid.NewGuid().ToString(),
                Key = this.GenerateLobbyJoinKey(),
                BanList = new List<string>(),
                Messages = new List<Message>(),
                IsPublic = false,
                IsOpen = true
            };

            await this.lobbyService.AddItemAsync(lobby);
            return Ok(lobby);
        }

        private LobbyPlayer ConvertUserToLobbyPlayer(User user)
        {
            return new LobbyPlayer
            {
                Id = user.Key,
                DisplayName = user.DisplayName,
                Avatar = user.Avatar,
                AuthProvider = user.AuthProvider
            };
        }

        private string GenerateLobbyJoinKey()
        {
            const string pool = "AAABCDEEEFGHIIIJKLMNOOOPQRSTUUUVWXYYYZ";
            var builder = new StringBuilder();

            for (var i = 0; i < 5; i++)
            {
                var c = pool[random.Next(0, pool.Length)];
                builder.Append(c);
            }

            return builder.ToString();
        }

        [HttpGet("player/article")]
        public async Task<IActionResult> GetArticle([FromQuery] string lobbyKey, [FromQuery] string key)
        {
            var userId = this.GetUserKey();
            var user = await this.userService.GetUser(userId, this.GetUserProvider());
            key = key.ToLower();
            var article = await this.articleService.GetArticleAsync(key);
            article.Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(article.Title);

            await lobbyService.SetCurrentArticle(lobbyKey, userId, key);
            return Ok(article);
        }

        [HttpPost("player/message")]
        public async Task<IActionResult> Message([FromQuery] string lobbyKey, [FromQuery] string message)
        {
            if (message.Length >= 145)
            {
                return BadRequest();
            }

            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
            var lobby = await this.lobbyService.GetLobby(lobbyKey);
            if (lobby == default)
            {
                return NotFound();
            }

            if (!CallerIsInLobby(lobby, user))
            {
                return BadRequest();
            }

            var messageObject = new Message
            {
                Author = this.ConvertUserToLobbyPlayer(user),
                Id = Guid.NewGuid().ToString(),
                Text = message
            };

            lobby.Messages.Add(messageObject);

            await this.lobbyService.UpdateItemAsync(lobby);

            return Ok();
        }

        [HttpPost("owner/ban")]
        public async Task<IActionResult> Ban([FromQuery] string lobbyKey, [FromQuery] string userKey)
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
            var lobby = await this.lobbyService.GetLobby(lobbyKey);
            if (lobby == default)
            {
                return NotFound();
            }

            if (!CallerIsOwner(lobby, user))
            {
                return BadRequest();
            }

            lobby.BanList.Add(userKey);
            lobby.Players.RemoveAll(lp => lp.Id == userKey);
            await this.lobbyService.UpdateItemAsync(lobby);

            return Ok();
        }

        [HttpGet("owner/setarticle")]
        public async Task<IActionResult> SetArticle([FromQuery] string lobbyKey, [FromQuery] string start, [FromQuery] string finish)
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
            var lobby = await this.lobbyService.GetLobby(lobbyKey);
            if (lobby == default)
            {
                return NotFound();
            }

            if (!CallerIsOwner(lobby, user))
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpGet("owner/search")]
        public async Task<IActionResult> Search([FromQuery] string lobbyKey, [FromQuery] string term)
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
            var lobby = await this.lobbyService.GetLobby(lobbyKey);
            if (lobby == default)
            {
                return NotFound();
            }

            if (!CallerIsOwner(lobby, user))
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpPost("owner/setpublic")]
        public async Task<IActionResult> SetPublic([FromQuery] string lobbyKey, [FromQuery] bool isPublic)
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
            var lobby = await this.lobbyService.GetLobby(lobbyKey);
            if (lobby == default)
            {
                return NotFound();
            }

            if (!CallerIsOwner(lobby, user))
            {
                return BadRequest();
            }

            lobby.IsPublic = isPublic;

            await this.lobbyService.UpdateItemAsync(lobby);

            return Ok();
        }

        private bool CallerIsInLobby(Lobby lobby, User user)
        {
            return lobby.Players.Count(p => p.Id == user.Key) <= 1;
        }

        private bool CallerIsOwner(Lobby lobby, User user)
        {
            return lobby.Owner.Key == user.Key;
        }

        private string GetUserKey()
        {
            return this.HttpContext.User.FindFirst("sub").Value;
        }

        private string GetUserProvider()
        {
            return this.HttpContext.User.FindFirst("iss").Value;
        }
    }
}