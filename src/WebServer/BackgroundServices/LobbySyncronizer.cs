using Microsoft.Extensions.Hosting;
using DataModels.Services;
using WebServer.Hubs;
using DataModels.CosmosModels;
using System.Threading;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace WebServer.BackgroundServices
{
    public class LobbySynchronizer : BackgroundService
    {
        private readonly LobbyService lobbyService;
        private readonly IHubContext<LobbyHub> lobbyHub;
        private readonly IMemoryCache lobbyCache;

        public LobbySynchronizer(LobbyService _lobbyService, IHubContext<LobbyHub> _lobbyHub)
        {
            this.lobbyHub = _lobbyHub;
            this.lobbyService = _lobbyService;
            this.lobbyCache = new MemoryCache(new MemoryCacheOptions());
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var lobbys = await this.lobbyService.GetAllLobbies();
                    foreach (var lobby in lobbys)
                    {
                        if (!this.lobbyCache.TryGetValue<Lobby>(lobby.Key, out Lobby cachedLobby)
                            || lobby._etag != cachedLobby._etag)
                        {
                        this.lobbyCache.Set<Lobby>(lobby.Key,
                            lobby,
                            new MemoryCacheEntryOptions
                            {
                                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                            });
                        await this.lobbyHub.Clients.Group(lobby.Key).SendAsync("LobbyState", lobby);
                        }
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