using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DataModels.Services;
using DataModels.CosmosModels;
using System;

namespace WebServer.Hubs
{
    public class LobbyHub : Hub
    {
        private readonly LobbyService lobbyService;

        public LobbyHub(LobbyService _lobbyService)
        {
            this.lobbyService = _lobbyService;
        }

        public async Task SendMessage(string message)
        {
            // var x = new Game { Id = Guid.NewGuid().ToString(), Key = "test" };

            // await this.gameService.AddItemAsync(x);

            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("Hello", message);
        }
    }
}