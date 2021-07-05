using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;

namespace WebServer.Services
{

    public class GameService : Service
    {
        public GameService(string _account, string _accessKey) : base(_account, _accessKey, "wikiracer", "games") { }

        public async Task<IEnumerable<Game>> GetItemsAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<Game>(new QueryDefinition(queryString));
            List<Game> results = new List<Game>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task<Game> GetItemAsync(string key)
        {
            try
            {
                ItemResponse<Game> response = await this.container.ReadItemAsync<Game>(key, new PartitionKey(key));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task AddItemAsync(Game game)
        {
            await this.container.CreateItemAsync(game, new PartitionKey(game.Key));
        }

        public async Task DeleteItemAsync(string id, string key)
        {
            await this.container.DeleteItemAsync<Game>(id, new PartitionKey(key));
        }

        public async Task UpdateItemAsync(Game game)
        {
            await this.container.UpsertItemAsync<Game>(game, new PartitionKey(game.Key));
        }

        public async Task<IList<Game>> GetAllUnrewardedGames()
        {
            var query = "SELECT * FROM c where c.RewardIssued = false";
            var lobbys = await this.GetItemsAsync(query);
            return lobbys.ToList();
        }

        public async Task MarkRewardIssued(string key, string etag)
        {
            await this.container.Scripts.ExecuteStoredProcedureAsync<int>(
                "MarkIssued",
                new PartitionKey(key),
                new dynamic[] { key, etag });
        }
    }
}