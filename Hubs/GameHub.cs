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
            var user = new User { ConnectionId = Context.ConnectionId };
            this.Database.Add(user);
            this.Database.SaveChanges();

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception e)
        {
            var user = this.Database.Users.Where(u => u.ConnectionId == Context.ConnectionId);

            foreach (var id in user)
            {
                this.Database.Remove(id);
            }

            this.Database.SaveChanges();

            return base.OnDisconnectedAsync(e);
        }

        public Task CreateLobby(string lobbyName)
        {
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

            return Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        }

        public Task JoinLobby(string lobby)
        {
            lobby = lobby.ToLowerInvariant();

            if (!this.Database.LobbyExists(lobby))
            {
                throw new Exception();
            }

            var lobbyObject = this.Database.GetLobby(lobby);

            lobbyObject.Users.Add(this.Database.GetUser(Context.ConnectionId));

            this.Database.SaveChanges();

            return Groups.AddToGroupAsync(Context.ConnectionId, lobby);
        }

        public Task LeaveLobby(string lobby)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby);
        }

        public async void SetUsernameAndAvatar(string username, string avatar, string lobby)
        {
            var user = this.Database.GetUser(Context.ConnectionId);

            user.Avatar = avatar;
            user.UserName = username;

            this.Database.SaveChanges();

            await Clients.Group(lobby).SendAsync("GameState", JsonSerializer.Serialize(this.Database.GetGameState(lobby)));

            return;
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
