using Microsoft.Extensions.Hosting;
using DataModels.Services;
using System.Threading;
using System.Threading.Tasks;

namespace WebServer.BackgroundServices
{
    public class CleanupService : BackgroundService
    {
        private readonly UserService userService;

        public CleanupService(UserService _userService)
        {
            this.userService = _userService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await this.userService.CleanGuestUsers();
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