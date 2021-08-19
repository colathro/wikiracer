using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using Microsoft.Azure.Cosmos;

namespace WebServer.Services
{

    public class PageStatisticService : Service
    {
        public PageStatisticService(string _account, string _accessKey) : base(_account, _accessKey, "wikiracer", "pagestats") { }

        private ConcurrentDictionary<string, PageStatisticCacheEntry> StatisticCache = new ConcurrentDictionary<string, PageStatisticCacheEntry>();

        private async Task<IEnumerable<PageStatistic>> GetItemsAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<PageStatistic>(new QueryDefinition(queryString));
            List<PageStatistic> results = new List<PageStatistic>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        private async Task<PageStatistic> GetItemAsync(string key)
        {
            try
            {
                ItemResponse<PageStatistic> response = await this.container.ReadItemAsync<PageStatistic>(key, new PartitionKey(key));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        private async Task AddItemAsync(PageStatistic statistic)
        {
            await this.container.CreateItemAsync(statistic, new PartitionKey(statistic.Key));
        }

        private async Task DeleteItemAsync(string id, string key)
        {
            await this.container.DeleteItemAsync<PageStatistic>(id, new PartitionKey(key));
        }

        private async Task UpdateItemAsync(PageStatistic statistic)
        {
            await this.container.UpsertItemAsync<PageStatistic>(statistic, new PartitionKey(statistic.Key));
        }

        public async void LogStatistic(string articleTitle)
        {
            await this.container.Scripts.ExecuteStoredProcedureAsync<int>(
                "LogStatistic",
                new PartitionKey(articleTitle),
                new[] { articleTitle });
        }

        public async Task<IEnumerable<PageStatistic>> GetTop100()
        {
            IEnumerable<PageStatistic> cachedResult = this.GetFromCache("GetTop100");

            if (cachedResult == null)
            {
                cachedResult = await this.GetItemsAsync("SELECT TOP 100 * FROM c order by c.Hits desc");
                this.AddToCache("GetTop100", cachedResult);
                return cachedResult;
            }
            else
            {
                return cachedResult;
            }
        }

        public IEnumerable<PageStatistic> GetFromCache(string cacheId)
        {
            if (StatisticCache.TryGetValue(cacheId, out PageStatisticCacheEntry cacheEntry))
            {
                if (cacheEntry.LastUpdated < DateTime.UtcNow.AddMinutes(-15))
                {
                    return null;
                }
                else
                {
                    return cacheEntry.CachedResult;
                }
            }
            else
            {
                return null;
            }
        }

        public void AddToCache(string cacheId, IEnumerable<PageStatistic> cacheValue)
        {
            var cacheEntry = new PageStatisticCacheEntry
            {
                LastUpdated = DateTime.UtcNow,
                CachedResult = cacheValue.ToList()
            };

            StatisticCache.AddOrUpdate(cacheId, cacheEntry, (key, oldValue) => cacheEntry);
        }
    }

    public class PageStatisticCacheEntry
    {
        public DateTime LastUpdated { get; set; }
        public List<PageStatistic> CachedResult { get; set; }
    }
}