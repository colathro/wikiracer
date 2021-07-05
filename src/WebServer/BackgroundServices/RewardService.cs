using Microsoft.Extensions.Hosting;
using WebServer.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using DataModels.CosmosModels;

namespace WebServer.BackgroundServices
{
    public class RewardService : BackgroundService
    {
        private readonly UserService userService;
        private readonly GameService gameService;

        public RewardService(UserService _userService, GameService _gameService)
        {
            this.userService = _userService;
            this.gameService = _gameService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var unrewardedGames = await this.gameService.GetAllUnrewardedGames();

                    foreach (Game game in unrewardedGames)
                    {
                        if (game.FinishTime > DateTime.UtcNow)
                        {
                            continue; // not finished yet
                        }

                        try
                        {
                            await this.gameService.MarkRewardIssued(game.Key, game.ETag);
                        }
                        catch
                        {
                            continue;
                            // etag validation so we are probably OK and another service got it.
                        }

                        foreach (GameHistory history in game.GameHistories)
                        {
                            var user = await this.userService.GetUser(history.Player.Id, history.Player.AuthProvider);
                            user.Coins += game.CoinReward;
                            user.Experience += game.ExperienceReward;

                            if (user.Experience >= 1000)
                            {
                                user.Experience = user.Experience % 1000;
                                user.Level = user.Level += 1;
                            }

                            await this.userService.UpdateItemAsync(user);
                        }
                    }
                }
                catch
                {

                }
                finally
                {
                    await Task.Delay(30 * 1000);
                }
            }
        }
    }
}