using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using wiki_racer.Database;
using wiki_racer.Extensions;

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
            var lobby = this.Database.GetLobby(user.Lobby);

            if (user != null)
            {
                this.Database.Remove(user);
                this.Database.SaveChanges();
            }

            if (lobby != null)
            {
                if (!lobby.Users.Any())
                {
                    this.Database.Remove(lobby);
                }
                else if (!lobby.Users.Where(u => u.ConnectionId == lobby.Host).Any())
                {
                    lobby.Host = lobby.Users.First().UserName;
                }

                this.Database.SaveChanges();

                try
                {
                    Clients.Group(lobby.LobbyName).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(user.Lobby)));
                    this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {user.Lobby}.");
                }
                catch
                {
                    this.Logger.LogError($"Unable to send gamestate on disconnect. Likely lobby does not exist.");
                }
            }

            return base.OnDisconnectedAsync(e);
        }

        public Task CreateLobby(string lobbyName)
        {
            this.Logger.LogInformation($"{Context.ConnectionId} Creating Lobby.");
            lobbyName = lobbyName.ToLowerInvariant();
            if (this.Database.LobbyExists(lobbyName))
            {
                throw new Exception();
            }

            var lobby = new Lobby
            {
                LobbyName = lobbyName
            };

            var currentUser = this.Database.GetUser(Context.ConnectionId);

            lobby.Users = new List<User> { currentUser };

            this.Database.Add(lobby);
            this.Database.SaveChanges();

            this.Logger.LogInformation($"{Context.ConnectionId} finished creating lobby.");

            Groups.AddToGroupAsync(Context.ConnectionId, lobbyName).Wait();

            return Clients.Group(lobbyName).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobbyName)));

        }

        public Task JoinLobby(string lobby)
        {
            this.Logger.LogInformation($"{Context.ConnectionId} Joining lobby.");
            lobby = lobby.ToLowerInvariant();

            if (!this.Database.LobbyExists(lobby))
            {
                throw new Exception();
            }

            var lobbyObject = this.Database.GetLobby(lobby);

            var user = this.Database.GetUser(Context.ConnectionId);

            user.Lobby = lobby;

            lobbyObject.Users.Add(user);

            this.Database.SaveChanges();
            this.Logger.LogInformation($"{Context.ConnectionId} joined lobby.");

            Groups.AddToGroupAsync(Context.ConnectionId, lobby).Wait();

            return Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
        }

        public Task LeaveLobby(string lobby)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby);
        }

        public async Task SetStartAndFinish(string lobby, string start, string finish)
        {
            lobby = lobby.ToLowerInvariant();

            var lobbyObject = this.Database.GetLobby(lobby);
            var userObject = this.Database.GetUser(this.Context.ConnectionId);

            if (userObject.UserName != lobbyObject.Host)
            {
                throw new Exception("You are not the lobby host!");
            }

            string startPage = "";

            if (!string.IsNullOrWhiteSpace(start))
            {
                try
                {
                    startPage = WikiCore.GetWikiPage(start, Database, Logger);
                    lobbyObject.StartArticle = start;
                }
                catch (Exception e)
                {
                    Logger.LogError(e, $"Unable to set article: {start}");
                }
            }

            if (!string.IsNullOrWhiteSpace(finish))
            {
                try
                {
                    WikiCore.GetWikiPage(finish, Database, Logger);
                    lobbyObject.FinishArticle = finish;
                }
                catch (Exception e)
                {
                    Logger.LogError(e, $"Unable to set article: {finish}");
                }
            }

            Database.SaveChanges();

            await Clients.Group(lobby).SendAsync("WikiReceive", startPage);

            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
            this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {lobby}.");
        }

        public async Task RandomizeStartAndFinish(string lobby)
        {
            lobby = lobby.ToLowerInvariant();

            var lobbyObject = this.Database.GetLobby(lobby);

            lobbyObject.StartArticle = "Avocado";
            lobbyObject.FinishArticle = "Tree";

            Database.SaveChanges();


            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
            this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {lobby}.");
        }

        public Task GetGameState(string lobby)
        {
            return Clients.Caller.SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
