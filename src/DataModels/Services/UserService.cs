using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using DataModels.CosmosModels.Enums;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;

namespace DataModels.Services
{

    public class UserService : Service
    {
        public UserService(string _account, string _accessKey) : base(_account, _accessKey, "wikiracer", "users") { }

        public async Task<DataModels.CosmosModels.User> GetUser(string key, string provider)
        {
            try
            {
                var authType = MapAuthType(provider);
                var query = $"SELECT * FROM c where c.Key = '{key}' and c.AuthProvider = {(int)authType}";
                var users = await this.GetItemsAsync(query);
                return users.FirstOrDefault();
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<DataModels.CosmosModels.User>> GetItemsAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<DataModels.CosmosModels.User>(new QueryDefinition(queryString));
            List<DataModels.CosmosModels.User> results = new List<DataModels.CosmosModels.User>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task AddItemAsync(DataModels.CosmosModels.User user)
        {
            await this.container.CreateItemAsync(user, new PartitionKey(user.Key));
        }

        public AuthType MapAuthType(string provider)
        {
            if (provider == "https://id.twitch.tv/oauth2")
            {
                return AuthType.Twitch;
            }
            else
            {
                throw new Exception("Unknown auth provider. How did you do this?");
            }
        }
    }
}