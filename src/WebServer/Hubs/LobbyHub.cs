using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DataModels.Services;
using Microsoft.AspNetCore.Authorization;
using DataModels.CosmosModels;
using System;
using System.Linq;

namespace WebServer.Hubs
{
    [Authorize]
    public class LobbyHub : Hub
    {
        private readonly LobbyService lobbyService;
        private readonly UserService userService;

        public LobbyHub(LobbyService _lobbyService, UserService _userService)
        {
            this.lobbyService = _lobbyService;
            this.userService = _userService;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (Context.Items.TryGetValue("joinKey", out var joinKey))
            {
                // set player inactive - when they join they technically resume.
                var lobby = await this.lobbyService.GetLobby((string)joinKey);
                var player = lobby.Players.FirstOrDefault(lp => lp.Id == this.GetUserKey());

                if (player == default)
                {
                    return;
                }

                player.Active = false;
                player.LastUpdate = DateTime.UtcNow;

                // pass ownership if owner disconnected
                if (player.Id == lobby.Owner.Key)
                {
                    var newOwner = lobby.Players.FirstOrDefault(pl => pl.Active == true);

                    if (newOwner != default)
                    {
                        var newOwnerUser = await this.userService.GetUser(newOwner.Id, newOwner.AuthProvider);
                        lobby.Owner = newOwnerUser;
                    }
                    else
                    {
                        lobby.IsOpen = false;
                    }
                }

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby.Key);
                await this.lobbyService.UpdateItemAsync(lobby);
            }
        }

        public async Task JoinLobby(string joinKey)
        {
            // this prevent users from join without join via rest api first
            var lobby = await this.lobbyService.GetLobby(joinKey);
            if (lobby == null)
            {
                await Clients.Caller.SendAsync("LobbyClosed");
                return;
            }

            var player = lobby.Players.FirstOrDefault(lp => lp.Id == this.GetUserKey());

            if (player == default)
            {
                return;
            }

            // ui should only show active users
            player.Active = true;
            player.LastUpdate = DateTime.UtcNow;
            await this.lobbyService.UpdateItemAsync(lobby);
            await Groups.AddToGroupAsync(Context.ConnectionId, joinKey);
            Context.Items["joinKey"] = joinKey;
        }

        public async Task LeaveLobby()
        {
            if (Context.Items.TryGetValue("joinKey", out var joinKey))
            {
                // explicitly leaving the lobby removes progress
                var lobby = await this.lobbyService.GetLobby((string)joinKey);

                var player = lobby.Players.RemoveAll(lp => lp.Id == this.GetUserKey());

                // pass ownership if owner disconnected
                if (this.GetUserKey() == lobby.Owner.Key)
                {
                    var newOwner = lobby.Players.FirstOrDefault(pl => pl.Active == true);

                    if (newOwner != default)
                    {
                        var newOwnerUser = await this.userService.GetUser(newOwner.Id, newOwner.AuthProvider);
                        lobby.Owner = newOwnerUser;
                    }
                    else
                    {
                        lobby.IsOpen = false;
                    }
                }

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby.Key);
                await this.lobbyService.UpdateItemAsync(lobby);
            }
        }

        private string GetUserKey()
        {
            return this.Context.GetHttpContext().User.FindFirst("sub").Value;
        }

        private string GetUserProvider()
        {
            return this.Context.GetHttpContext().User.FindFirst("iss").Value;
        }
    }
}