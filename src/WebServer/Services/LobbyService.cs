using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;


namespace WebServer.Services
{

    public class LobbyService : Service
    {
        public LobbyService(string _account, string _accessKey) : base(_account, _accessKey, "wikiracer", "lobbies") { }

        public async Task<IList<Lobby>> GetActiveLobbies(int page = 0)
        {
            var query = "SELECT * FROM c where c.IsPublic = true and ARRAY_CONTAINS(c.Players, {'Active': true}, true)";
            var lobbys = await this.GetItemsPagedAsync(query, page);
            return lobbys.ToList();
        }

        public async Task<int> GetActiveLobbiesCount()
        {
            var query = "SELECT VALUE COUNT(c) FROM c where c.IsPublic = true and ARRAY_CONTAINS(c.Players, {'Active': true}, true)";
            return await this.GetCountAsync(query);
        }

        public async Task<IList<Lobby>> GetAllLobbies()
        {
            var query = "SELECT * FROM c";
            var lobbys = await this.GetItemsAsync(query);
            return lobbys.ToList();
        }

        public async Task<Lobby> GetLobby(string joinKey)
        {
            QueryDefinition query = new QueryDefinition(
                "SELECT * FROM c where c.Key =  @joinKey")
                .WithParameter("@joinKey", joinKey);

            var lobbys = await this.GetItemsAsync(query);

            return lobbys.FirstOrDefault();
        }


        public async Task AddItemAsync(Lobby lobby)
        {
            await this.container.CreateItemAsync(lobby, new PartitionKey(lobby.Key));
        }

        public async Task<int> GetCountAsync(string queryString)
        {
            var qd = new QueryDefinition(queryString);
            var query = this.container.GetItemQueryIterator<int>(qd);
            var response = await query.ReadNextAsync();
            return response.First();
        }

        public async Task DeleteItemAsync(string id, string key)
        {
            await this.container.DeleteItemAsync<Lobby>(id, new PartitionKey(key));
        }

        public async Task<Lobby> GetItemAsync(string key)
        {
            try
            {
                ItemResponse<Lobby> response = await this.container.ReadItemAsync<Lobby>(key, new PartitionKey(key));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Lobby>> GetItemsAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<Lobby>(new QueryDefinition(queryString));
            List<Lobby> results = new List<Lobby>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task<IEnumerable<Lobby>> GetItemsPagedAsync(string queryString, int page)
        {
            var requestOptions = new QueryRequestOptions
            {
                MaxItemCount = 10
            };
            var query = this.container.GetItemQueryIterator<Lobby>(new QueryDefinition(queryString), null, requestOptions);
            List<Lobby> results = new List<Lobby>();
            FeedResponse<Lobby> response;

            response = await query.ReadNextAsync(); // first page always

            for (int i = 0; i < page; i++)
            {
                response = await query.ReadNextAsync(); // if we are requesting more get next pages
            }

            return response.ToList();
        }

        public async Task<IEnumerable<Lobby>> GetItemsAsync(QueryDefinition queryDef)
        {
            var query = this.container.GetItemQueryIterator<Lobby>(queryDef);
            List<Lobby> results = new List<Lobby>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateItemAsync(Lobby lobby)
        {
            await this.container.UpsertItemAsync<Lobby>(lobby, new PartitionKey(lobby.Key));
        }

        public async Task SetCurrentArticle(string lobbyKey, string userId, string articleKey, bool isFinished)
        {
            await this.container.Scripts.ExecuteStoredProcedureAsync<int>(
                "SetCurrentArticle",
                new PartitionKey(lobbyKey),
                new[] { lobbyKey, userId, articleKey, isFinished.ToString() });
        }

        public async Task SendMesage(string lobbyKey, Message message)
        {
            await this.container.Scripts.ExecuteStoredProcedureAsync<int>(
                "AddMessage",
                new PartitionKey(lobbyKey),
                new dynamic[] { lobbyKey, message });
        }

        public async Task<Lobby> SetStartEndArticle(string lobbyKey, string startArticleKey, string endArticleKey, string gameLength)
        {
            return await this.container.Scripts.ExecuteStoredProcedureAsync<Lobby>(
                "SetStartEndArticle",
                new PartitionKey(lobbyKey),
                new[] { lobbyKey, startArticleKey, endArticleKey, gameLength });
        }

        public async Task CleanClosedLobbies()
        {
            var query = $"SELECT * FROM c where c._ts <= {DateTimeOffset.UtcNow.AddDays(-1).ToUnixTimeSeconds()}";
            var lobbys = await this.GetItemsAsync(query);

            foreach (var lobby in lobbys)
            {
                await this.DeleteItemAsync(lobby.Id, lobby.Key);
            }
        }
    }
}