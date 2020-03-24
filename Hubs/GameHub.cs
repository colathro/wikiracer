using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using wiki_racer.Database;
using wiki_racer.WikipediaExtensions;

namespace wiki_racer.Hubs
{
    public class GameHub : Hub
    {
        private ILogger<GameHub> Logger;
        private GameContext Database;

        public GameHub(GameContext database, ILogger<GameHub> logger)
        {
            this.Logger = logger;
            this.Database = database;
        }

        public override Task OnConnectedAsync()
        {
            this.Logger.LogInformation($"{Context.ConnectionId} Connected.");
            var user = new User { ConnectionId = Context.ConnectionId };
            this.Database.Add(user);
            this.Database.SaveChanges();

            this.Logger.LogInformation($"{Context.ConnectionId} added to database.");

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception e)
        {
            this.Logger.LogInformation($"{Context.ConnectionId} Disconnected.");

            var user = this.Database.Users.Where(u => u.ConnectionId == Context.ConnectionId).First();

            if (user != null)
            {
                this.Database.Remove(user);
                this.Database.SaveChanges();
            }

            var lobby = this.Database.GetLobby(user.Lobby);

            if (lobby != null)
            {
                this.Logger.LogInformation($"{Context.ConnectionId} removed from database.");

                try
                {
                    Clients.Group(user.Lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(user.Lobby)));
                    this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {user.Lobby}.");
                }
                catch
                {
                    this.Logger.LogError($"Unable to send gamestate on disconnect. Likely lobby does not exist.");
                }

                if (!lobby.Users.Any())
                {
                    this.Database.Remove(lobby);
                }

                this.Database.SaveChanges();
            }

            return base.OnDisconnectedAsync(e);
        }

        public Task CreateLobby(string lobbyName, string lang)
        {
            this.Logger.LogInformation($"{Context.ConnectionId} Creating Lobby.");
            lobbyName = lobbyName.ToLowerInvariant();
            if (this.Database.LobbyExists(lobbyName))
            {
                throw new Exception();
            }

            var lobby = new Lobby {
                LobbyName = lobbyName,
                Language = lang
            };

            var currentUser = this.Database.GetUser(Context.ConnectionId);

            lobby.Users = new List<User> { currentUser };

            this.Database.Add(lobby);
            this.Database.SaveChanges();

            this.Logger.LogInformation($"{Context.ConnectionId} finished creating lobby.");

            return Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        }

        public Task JoinLobby(string lobby, string lang)
        {
            this.Logger.LogInformation($"{Context.ConnectionId} Joining lobby.");
            lobby = lobby.ToLowerInvariant();

            if (!this.Database.LobbyExists(lobby, lang))
            {
                throw new Exception();
            }

            var lobbyObject = this.Database.GetLobby(lobby);

            var user = this.Database.GetUser(Context.ConnectionId);

            user.Lobby = lobby;

            lobbyObject.Users.Add(user);

            this.Database.SaveChanges();
            this.Logger.LogInformation($"{Context.ConnectionId} joined lobby.");

            return Groups.AddToGroupAsync(Context.ConnectionId, lobby);
        }

        public Task LeaveLobby(string lobby)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby);
        }

        public async void SetUsernameAndAvatar(string username, string avatar, string lobby)
        {
            lobby = lobby.ToLowerInvariant();
            this.Logger.LogInformation($"{Context.ConnectionId} setting username.");
            var user = this.Database.GetUser(Context.ConnectionId);

            user.Avatar = avatar;
            user.UserName = username;
            user.Lobby = lobby;

            this.Database.SaveChanges();
            this.Logger.LogInformation($"{Context.ConnectionId} saved username.");

            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
            this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {lobby}.");


            return;
        }

        public async void SetStartAndFinish(string lobby, string start, string finish)
        {
            lobby = lobby.ToLowerInvariant();
            var output = new Dictionary<string, bool>();
            output.Add("start", false);
            output.Add("finish", false);

            var lobbyObject = this.Database.GetLobby(lobby);

            if (!string.IsNullOrWhiteSpace(start))
            {
                try
                {
                    WikiCore.GetWikiPage(start, lobbyObject.Language, Database, Logger);
                    output["start"] = true;
                    lobbyObject.StartArticle = start;
                }
                catch (Exception e)
                {
                    Logger.LogError(e, $"Unable to set article: {start} language:{lobbyObject.Language}");
                }
            }

            if (!string.IsNullOrWhiteSpace(finish))
            {
                try
                {
                    WikiCore.GetWikiPage(finish, lobbyObject.Language, Database, Logger);
                    output["finish"] = true;
                    lobbyObject.FinishArticle = finish;
                }
                catch (Exception e)
                {
                    Logger.LogError(e, $"Unable to set article: {finish} language:{lobbyObject.Language}");
                }
            }

            Database.SaveChanges();

            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
            this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {lobby}.");
        }

        public async void RandomizeStartAndFinish(string lobby)
        {
            lobby = lobby.ToLowerInvariant();

            var lobbyObject = this.Database.GetLobby(lobby);

            lobbyObject.StartArticle = "Avocado";
            lobbyObject.FinishArticle = "Tree";

            Database.SaveChanges();


            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
            this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {lobby}.");
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
