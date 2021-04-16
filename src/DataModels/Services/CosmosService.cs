using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;

namespace DataModels.Services
{

    public class CosmosService : ICosmosService
    {
        private Container _container;

        public CosmosService(
            CosmosClient dbClient,
            string databaseName,
            string containerName)
        {
            this._container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddItemAsync(Record record)
        {
            await this._container.CreateItemAsync(record, new PartitionKey(record.Key));
        }

        public async Task DeleteItemAsync(string key)
        {
            await this._container.DeleteItemAsync<Record>(key, new PartitionKey(key));
        }

        public async Task<Record> GetItemAsync(string key)
        {
            try
            {
                ItemResponse<Record> response = await this._container.ReadItemAsync<Record>(key, new PartitionKey(key));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }

        }

        public async Task<IEnumerable<Record>> GetItemsAsync(string queryString)
        {
            var query = this._container.GetItemQueryIterator<Record>(new QueryDefinition(queryString));
            List<Record> results = new List<Record>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateItemAsync(Record record)
        {
            await this._container.UpsertItemAsync<Record>(record, new PartitionKey(record.Key));
        }
    }
}