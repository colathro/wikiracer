using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Azure.Cosmos.Scripts;

namespace DataModels.Services
{

    public class LobbyService : Service
    {
        public LobbyService(string _account, string _accessKey) : base(_account, _accessKey, "wikiracer", "lobbies") { }

        public async Task<IList<Lobby>> GetActiveLobbies()
        {
            var query = "SELECT * FROM c where c.IsPublic = true";
            var lobbys = await this.GetItemsAsync(query);
            return lobbys.ToList();
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

        public async Task<Lobby> SetCurrentArticle(string lobbyKey, string userId, string articleKey)
        {
            return await this.container.Scripts.ExecuteStoredProcedureAsync<Lobby>(
                "SetCurrentArticle",
                new PartitionKey(lobbyKey),
                new[] { lobbyKey, userId, articleKey });
        }

        public async Task<Lobby> SetStartEndArticle(string lobbyKey, string startArticleKey, string endArticleKey)
        {
            return await this.container.Scripts.ExecuteStoredProcedureAsync<Lobby>(
                "SetStartEndArticle",
                new PartitionKey(lobbyKey),
                new[] { lobbyKey, startArticleKey, endArticleKey });
        }
        
        public async Task CleanClosedLobbies()
        {
            var query = "SELECT * FROM c where c.IsOpen = false";
            var lobbys = await this.GetItemsAsync(query);

            foreach (var lobby in lobbys)
            {
                await this.DeleteItemAsync(lobby.Id, lobby.Key);
            }
        }
    }
}