using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;

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

        public async Task<Lobby> GetLobby(string joinKey)
        {
            QueryDefinition query = new QueryDefinition(
                "SELECT * FROM c where c.JoinKey =  @joinKey")
                .WithParameter("@joinKey", joinKey);

            var lobbys = await this.GetItemsAsync(query);

            return lobbys.FirstOrDefault();
        }


        public async Task AddItemAsync(Lobby lobby)
        {
            await this.container.CreateItemAsync(lobby, new PartitionKey(lobby.Key));
        }

        public async Task DeleteItemAsync(string key)
        {
            await this.container.DeleteItemAsync<Lobby>(key, new PartitionKey(key));
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
    }
}