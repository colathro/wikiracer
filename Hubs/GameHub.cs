using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using wiki_racer.Database;

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
            var user = this.Database.Users.Where(u => u.ConnectionId == Context.ConnectionId);

            foreach (var id in user)
            {
                this.Database.Remove(id);
            }

            this.Database.SaveChanges();

            this.Logger.LogInformation($"{Context.ConnectionId} removed from database.");

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

            var lobby = new Lobby { LobbyName = lobbyName };

            var currentUser = this.Database.GetUser(Context.ConnectionId);

            lobby.Users = new List<User> { currentUser };

            this.Database.Add(lobby);
            this.Database.SaveChanges();

            this.Logger.LogInformation($"{Context.ConnectionId} finished creating lobby.");

            return Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
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

            lobbyObject.Users.Add(this.Database.GetUser(Context.ConnectionId));

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
            this.Logger.LogInformation($"{Context.ConnectionId} setting username.");
            var user = this.Database.GetUser(Context.ConnectionId);

            user.Avatar = avatar;
            user.UserName = username;

            this.Database.SaveChanges();

            this.Logger.LogInformation($"{Context.ConnectionId} saved username.");

            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));
            this.Logger.LogInformation($"{Context.ConnectionId} sent gamestate to all {lobby}.");


            return;
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
