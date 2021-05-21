using Microsoft.Extensions.Hosting;
using DataModels.Services;
using System.Threading;
using System.Threading.Tasks;

namespace WebServer.BackgroundServices
{
    public class CleanupService : BackgroundService
    {
        private readonly UserService userService;
        private readonly LobbyService lobbyService;

        public CleanupService(UserService _userService, LobbyService _lobbyService)
        {
            this.userService = _userService;
            this.lobbyService = _lobbyService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await this.userService.CleanGuestUsers();
                    await this.lobbyService.CleanClosedLobbies();
                }
                catch
                {

                }
                finally
                {
                    await Task.Delay(10 * 60 * 1000);
                }
            }
        }
    }
}