using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels.CosmosModels;
using DataModels.StorageModels;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using System.IO;
using System;
using System.Text;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;


namespace DataModels.Services
{

    public class ArticleService : Service
    {
        protected readonly string storageContainerName = "articles";
        protected readonly CloudBlobContainer cloudBlobContainer;
        protected readonly CloudBlobClient cloudBlobClient;
        protected readonly CloudStorageAccount cloudStorageAccount;

        public ArticleService(string _account, string _accessKey, string _storageConnectionString) : base(_account, _accessKey, "wikiracer", "articles")
        {
            CloudStorageAccount.TryParse(_storageConnectionString, out this.cloudStorageAccount);
            this.cloudBlobClient = this.cloudStorageAccount.CreateCloudBlobClient();
            this.cloudBlobContainer = cloudBlobContainer = cloudBlobClient.GetContainerReference(storageContainerName);
        }

        public async Task AddArticleAsync(Article article, bool redirect = false, string redirectTarget = "")
        {
            if (redirect)
            {
                ArticlePointer newArticlePointer = new ArticlePointer
                {
                    Key = article.Title,
                    Id = article.Title,
                    Redirect = true,
                    RedirectTarget = redirectTarget
                };
                await this.container.UpsertItemAsync(newArticlePointer, new PartitionKey(newArticlePointer.Key));
            }
            else
            {
                var cloudBlockBlob = await this.UploadArticle(article);
                ArticlePointer newArticlePointer = new ArticlePointer
                {
                    Link = cloudBlockBlob.Uri.ToString(),
                    Key = article.Title,
                    Id = article.Title
                };
                await this.container.UpsertItemAsync(newArticlePointer, new PartitionKey(newArticlePointer.Key));
            }
        }

        private async Task<CloudBlockBlob> UploadArticle(Article article)
        {
            using (var memoryStream = new MemoryStream())
            {
                string cleanTitle = Encoding.ASCII.GetString(
                    Encoding.Convert(
                        Encoding.UTF8,
                        Encoding.GetEncoding(
                            Encoding.ASCII.EncodingName,
                            new EncoderReplacementFallback(string.Empty),
                            new DecoderExceptionFallback()
                            ),
                    Encoding.UTF8.GetBytes(article.Title)
                    )
                );

                if (cleanTitle == "")
                {
                    cleanTitle = Guid.NewGuid().ToString();
                }

                var serializedJson = JsonConvert.SerializeObject(article);
                StreamWriter writer = new StreamWriter(memoryStream);
                writer.Write(serializedJson);
                writer.Flush();
                memoryStream.Position = 0;
                CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(cleanTitle);
                await cloudBlockBlob.UploadFromStreamAsync(memoryStream);
                return cloudBlockBlob;
            }
        }

        public async Task DeleteArticleAsync(string key)
        {
            await DeleteArticle(key);
            await this.container.DeleteItemAsync<ArticlePointer>(key, new PartitionKey(key));
        }

        private async Task DeleteArticle(string key)
        {
            CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(key);
            await cloudBlockBlob.DeleteAsync();
        }

        public async Task<ArticlePointer> GetItemAsync(string key)
        {
            try
            {
                ItemResponse<ArticlePointer> response = await this.container.ReadItemAsync<ArticlePointer>(key, new PartitionKey(key));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<Article> GetArticleAsync(string key)
        {
            ItemResponse<ArticlePointer> response = await this.container.ReadItemAsync<ArticlePointer>(key, new PartitionKey(key));
            var ptr = response.Resource;

            if (ptr.Redirect)
            {
                var aptr = await this.GetItemAsync(ptr.RedirectTarget);

                CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(aptr.Key);
                string content = await cloudBlockBlob.DownloadTextAsync();
                var article = JsonConvert.DeserializeObject<Article>(content);
                return article;
            }
            else
            {
                CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(ptr.Key);
                string content = await cloudBlockBlob.DownloadTextAsync();
                var article = JsonConvert.DeserializeObject<Article>(content);
                return article;
            }
        }

        public async Task<IEnumerable<ArticlePointer>> GetPointersAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<ArticlePointer>(new QueryDefinition(queryString));
            List<ArticlePointer> results = new List<ArticlePointer>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task<IEnumerable<Article>> GetItemsAsync(string queryString)
        {
            var query = this.container.GetItemQueryIterator<ArticlePointer>(new QueryDefinition(queryString));
            List<ArticlePointer> results = new List<ArticlePointer>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            List<Article> articles = new List<Article>();

            foreach (ArticlePointer ptr in results)
            {
                if (ptr.Redirect)
                {
                    var aptr = await this.GetItemAsync(ptr.RedirectTarget);

                    CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(aptr.Key);
                    string content = await cloudBlockBlob.DownloadTextAsync();
                    var article = JsonConvert.DeserializeObject<Article>(content);
                    articles.Add(article);
                }
                else
                {
                    CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(ptr.Key);
                    string content = await cloudBlockBlob.DownloadTextAsync();
                    var article = JsonConvert.DeserializeObject<Article>(content);
                    articles.Add(article);
                }
            }

            return articles;
        }

        public async Task UpdateItemAsync(ArticlePointer articlePointer)
        {
            await this.container.UpsertItemAsync<ArticlePointer>(articlePointer, new PartitionKey(articlePointer.Key));
        }
    }
}