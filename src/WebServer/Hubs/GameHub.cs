using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DataModels.Services;
using DataModels.CosmosModels;
using System;

namespace WebServer.Hubs
{
    public class GameHub : Hub
    {
        private readonly GameService gameService;

        public GameHub(GameService _gameService)
        {
            this.gameService = _gameService;
        }

        public async Task SendMessage(string message)
        {
            var x = new Game { Id = Guid.NewGuid().ToString(), Key = "test" };

            await this.gameService.AddItemAsync(x);

            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}