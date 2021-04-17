using Microsoft.Extensions.Hosting;
using DataModels.Services;
using WebServer.Hubs;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace WebServer.BackgroundServices
{
    public class GameSynchronizer : BackgroundService
    {
        private readonly GameService gameService;
        private readonly IHubContext<GameHub> gameHub;

        public GameSynchronizer(GameService _gameService, IHubContext<GameHub> _gameHub)
        {
            this.gameHub = _gameHub;
            this.gameService = _gameService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var games = await this.gameService.GetActiveGames();
                    foreach (var game in games)
                    {
                        await this.gameHub.Clients.All.SendAsync("GameState", game);
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