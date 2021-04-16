using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DataModels.Services;
using DataModels.CosmosModels;
using System;

namespace WebServer.Hubs
{
    public class TestHub : Hub
    {
        private readonly ICosmosService gamesService;
        public TestHub(ICosmosService _gamesService)
        {
            this.gamesService = _gamesService;
        }

        public async Task SendMessage(string message)
        {
            var x = new Lobby { Id = Guid.NewGuid().ToString(), Key = "test" };

            await this.gamesService.AddItemAsync(x);

            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}