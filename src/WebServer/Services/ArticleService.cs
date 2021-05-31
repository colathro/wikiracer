using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using DataModels.CosmosModels;
using DataModels.StorageModels;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using System.IO;
using System;
using System.Text;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using DataLoader.MwParserFromScratch;
using DataLoader.MwParserFromScratch.Nodes;
using DataLoader;
using System.Diagnostics;
using System.Text.RegularExpressions;


namespace WebServer.Services
{

    public class ArticleService : Service
    {
        protected readonly string storageContainerName = "articles";
        protected readonly CloudBlobContainer cloudBlobContainer;
        protected readonly CloudBlobClient cloudBlobClient;
        protected readonly CloudStorageAccount cloudStorageAccount;

        protected const string baseURL = "https://wikiracer.blob.core.windows.net/articles/";

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

        public async Task<Article> GetArticleMediaWikiAsync(string key)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Api-User-Agent","matt@fivestack.io");

            var response = await client.GetAsync(new Uri($"https://en.wikipedia.org/w/api.php?action=parse&page={key}&prop=wikitext&formatversion=2&format=json"));
            string result = response.Content.ReadAsStringAsync().Result;
            var wikiResponse = JsonConvert.DeserializeObject<WikiResponse>(result);

            var textParser = new WikitextParser { Logger = new MyParserLogger() };
            var ast = textParser.Parse(wikiResponse.parse.wikitext);
            return Converter.ConvertWikitextToArticle(ast, wikiResponse.parse.title);
        }

        public async Task<Article> GetArticleAsync(string key)
        {
            key = key.Replace("_", " ");
            ItemResponse<ArticlePointer> response = await this.container.ReadItemAsync<ArticlePointer>(key, new PartitionKey(key));
            var ptr = response.Resource;

            if (ptr.Redirect)
            {
                try
                {
                    string target = baseURL + ptr.Key;
                    CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(ptr.Key);
                    string content = await cloudBlockBlob.DownloadTextAsync();
                    var article = JsonConvert.DeserializeObject<Article>(content);
                    return article;
                }
                catch
                {
                    try
                    {
                        var aptr = await this.GetItemAsync(ptr.RedirectTarget);

                        CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(aptr.Key);
                        string content = await cloudBlockBlob.DownloadTextAsync();
                        var article = JsonConvert.DeserializeObject<Article>(content);
                        return article;
                    }
                    catch
                    {
                        try
                        {
                            var aptr = await this.GetItemAsync(ptr.RedirectTarget.ToLower());

                            CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(aptr.Key);
                            string content = await cloudBlockBlob.DownloadTextAsync();
                            var article = JsonConvert.DeserializeObject<Article>(content);
                            return article;
                        }
                        catch
                        {
                            var aptr = await this.GetItemAsync(ptr.RedirectTarget.ToLower());

                            CloudBlockBlob cloudBlockBlob = this.cloudBlobContainer.GetBlockBlobReference(aptr.Key.ToLower());
                            string content = await cloudBlockBlob.DownloadTextAsync();
                            var article = JsonConvert.DeserializeObject<Article>(content);
                            return article;
                        }
                    }
                }

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

        public async Task<IEnumerable<string>> SearchForArticles(string searchString)
        {
            var queryString = "SELECT TOP 10 c.Key FROM c WHERE STARTSWITH(c.Key, @searchString, false)";
            var query = this.container.GetItemQueryIterator<ArticlePointer>(
                new QueryDefinition(queryString)
                .WithParameter("@searchString", searchString));
            List<ArticlePointer> results = new List<ArticlePointer>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            var ret = new List<string>();
            foreach(var article in results)
            {
                ret.Add(article.Key);
            }
            return ret;
        }
    }
}

class MyParserLogger : IWikitextParserLogger
{
  private class RegexStatistics
  {
    public int InvocationCount = 0;
    public long EllapsedTicks = 0;
    public TimeSpan Ellapsed => TimeSpan.FromTicks(EllapsedTicks);
    public TimeSpan AverageEllapsed => TimeSpan.FromTicks(EllapsedTicks / InvocationCount);
  }
  private readonly Dictionary<int, int> fallbackDict = new Dictionary<int, int>();
  private readonly Dictionary<string, RegexStatistics> regexStatDict = new Dictionary<string, RegexStatistics>();
  private int fallbackCounter;
  private readonly Stopwatch parserWatch = new Stopwatch();
  private readonly Stopwatch regexWatch = new Stopwatch();
  private string text;

  /// <inheritdoc />
  public void NotifyParsingStarted(string text)
  {
    this.text = text;
    fallbackDict.Clear();
    fallbackCounter = 0;
    parserWatch.Restart();
  }

  /// <inheritdoc />
  public void NotifyFallback(int offset, int contextStackSize)
  {
    if (!fallbackDict.TryGetValue(offset, out int counter)) counter = 0;
    fallbackDict[offset] = counter + 1;
    fallbackCounter++;
  }

  /// <inheritdoc />
  public void NotifyParsingFinished()
  {
    regexStatDict.Clear();
    fallbackDict.Clear();
  }

  /// <inheritdoc />
  public void NotifyRegexMatchingStarted(int offset, Regex expression)
  {
    regexWatch.Restart();
  }

  /// <inheritdoc />
  public void NotifyRegexMatchingFinished(int offset, Regex expression)
  {
    if (!regexStatDict.TryGetValue(expression.ToString(), out RegexStatistics stat))
    {
      stat = new RegexStatistics();
      regexStatDict.Add(expression.ToString(), stat);
    }
    stat.EllapsedTicks += regexWatch.ElapsedTicks;
    stat.InvocationCount++;
  }
}

public class WikiResponse
{
    public Parse parse {get; set;}
}

public class Parse
{
    public string title {get; set;}

    public string wikitext {get; set;}

}