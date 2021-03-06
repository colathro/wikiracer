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
    public class WikiPageController : ControllerBase
    {
        private ILogger<WikiPageController> Logger;
        private GameContext Database;

        public WikiPageController(GameContext database, ILogger<WikiPageController> logger)
        {
            this.Logger = logger;
            this.Database = database;
        }

        [HttpGet]
        public IActionResult GetPage(string page, string lobby, string connectionId)
        {
            try
            {
                if (this.ValidateUserAndWinningPage(page, lobby, connectionId))
                {
                    var response = WikiCore.GetWikiPage(page, Database, Logger);
                    return Ok(response);
                }
                else
                {
                    throw new Exception("Failed to validate user.");
                }
            }
            catch (Exception e)
            {
                this.Logger.LogError($"Error fetching page {page}", e);
                return StatusCode(500);
            }
        }

        private bool ValidateUserAndWinningPage(string page, string lobby, string connectionId)
        {
            var lobbyObject = this.Database.GetLobby(lobby);
            var userObject = this.Database.GetUser(connectionId);

            if (lobbyObject == null)
            {
                this.Logger.LogError($"Lobby {lobby} not found.");
                return false;
            }

            if (!lobbyObject.Users.Where(u => u.ConnectionId == connectionId).Any())
            {
                this.Logger.LogError($"ConnectionId: {connectionId} not in {lobby}");
                return false;
            }

            if (lobbyObject.FinishArticle.ToLower() == page.ToLower() & lobbyObject.Winner == null)
            {
                lobbyObject.Winner = userObject.UserName;
                lobbyObject.GameRunning = false;

                foreach (var user in lobbyObject.Users)
                {
                    user.Clicks = 0;
                }
            }

            userObject.Clicks += 1;

            this.Database.SaveChanges();

            return true;
        }
    }
}