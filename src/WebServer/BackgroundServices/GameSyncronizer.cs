using Microsoft.Extensions.Hosting;
using DataModels.Services;
using System.Threading;
using System.Threading.Tasks;

namespace WebServer.BackgroundServices
{
    public class GameSynchronizer : BackgroundService
    {
        private readonly GameService gameService;

        public GameSynchronizer(GameService _gameService)
        {
            this.gameService = _gameService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
        }
    }
}