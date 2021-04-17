using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;

namespace DataModels.Services
{

    public class GameService : Service
    {
        public GameService(string _account, string _accessKey) : base(_account, _accessKey, "wikiracer", "games") { }

        public async Task AddItemAsync(Game game)
        {
            await this.container.CreateItemAsync(game, new PartitionKey(game.Key));
        }

        public async Task DeleteItemAsync(string key)
        {
            await this.container.DeleteItemAsync<Game>(key, new PartitionKey(key));
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

        public async Task UpdateItemAsync(Game game)
        {
            await this.container.UpsertItemAsync<Game>(game, new PartitionKey(game.Key));
        }
    }
}