using Microsoft.Extensions.Hosting;
using DataModels.Services;
using WebServer.Hubs;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace WebServer.BackgroundServices
{
    public class LobbySynchronizer : BackgroundService
    {
        private readonly LobbyService lobbyService;
        private readonly IHubContext<LobbyHub> lobbyHub;

        public LobbySynchronizer(LobbyService _lobbyService, IHubContext<LobbyHub> _lobbyHub)
        {
            this.lobbyHub = _lobbyHub;
            this.lobbyService = _lobbyService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var lobbys = await this.lobbyService.GetActiveLobbies();
                    foreach (var lobby in lobbys)
                    {
                        await this.lobbyHub.Clients.All.SendAsync("LobbyState", lobby);
                    }
                }
                catch
                {

                }
                finally
                {
                    await Task.Delay(500);
                }
            }
        }
    }
}