using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using wiki_racer.Database;
using wiki_racer.Extensions;

namespace MyWebAPI.Controllers
{
    [Route("/api/[controller]")]
    public class GameController : ControllerBase
    {
        private ILogger<GameController> Logger;
        private GameContext Database;

        public GameController(GameContext database, ILogger<GameController> logger)
        {
            this.Logger = logger;
            this.Database = database;
        }

        [HttpPost("setname")]
        public IActionResult SetUsernameAndAvatar(string username, string avatar, string lobby, string connectionId)
        {
            try
            {
                lobby = lobby.ToLowerInvariant();
                this.Logger.LogInformation($"{connectionId} setting username.");

                var user = this.Database.GetUser(connectionId);
                var lobbyObject = this.Database.GetLobby(lobby);

                if (lobbyObject.Users.Any(u => u.UserName == username))
                {
                    throw new Exception($"{username}");
                }

                user.Avatar = avatar;
                user.UserName = username;
                user.Lobby = lobby;

                if (lobbyObject.Users.Count == 1)
                {
                    lobbyObject.Host = username;
                }

                this.Database.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}