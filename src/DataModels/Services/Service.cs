using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;

namespace DataModels.Services
{

    public class Service : IService
    {
        protected string account;
        protected string accessKey;

        protected string databaseName { get; set; }
        protected string containerName { get; set; }
        protected string partitionKey { get; set; }

        protected Container container;
        protected CosmosClient client;

        public Service(string _account, string _accessKey, string _databaseName, string _containerName)
        {
            this.account = _account;
            this.accessKey = _accessKey;
            this.databaseName = _databaseName;
            this.containerName = _containerName;
            this.client = new CosmosClient(_account, _accessKey);
            this.container = this.client.GetContainer(this.databaseName, this.containerName);
        }
    }
}