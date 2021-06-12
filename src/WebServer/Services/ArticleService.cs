using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using DataModels.StorageModels;
using System;
using DataLoader.MwParserFromScratch;
using DataLoader.MwParserFromScratch.Nodes;
using DataLoader;
using System.Diagnostics;
using System.Text.RegularExpressions;

public interface IMediaWikiService{
    Task<Article> GetArticleMediaWikiAsync(string key);
    Task<object> GetSearchMediaWikiAsync(string searchString);
}

namespace WebServer.Services
{
    public class MediaWikiService : IMediaWikiService
    {
        private readonly HttpClient _httpClient;

        public MediaWikiService(HttpClient httpClient)
        {
            this._httpClient = httpClient;
        }

        public async Task<Article> GetArticleMediaWikiAsync(string key)
        {
            var response = await this._httpClient.GetAsync(
                    $"?action=parse&page={key}&prop=wikitext&formatversion=2&format=json&redirects=true"
                );
            string result = response.Content.ReadAsStringAsync().Result;
            var wikiResponse = JsonSerializer.Deserialize<WikiResponse>(result);

            var textParser = new WikitextParser { Logger = new MyParserLogger() };
            var ast = textParser.Parse(wikiResponse.parse.wikitext);

            return Converter.ConvertWikitextToArticle(ast, wikiResponse.parse.title);
        }

        public async Task<object> GetSearchMediaWikiAsync(string searchString)
        {
            var response = await this._httpClient.GetAsync(
                    $"?action=opensearch&search={searchString}&redirects=resolve&namespace=0"
                );
            string result = response.Content.ReadAsStringAsync().Result;
            dynamic wikiResponse = JsonSerializer.Deserialize<dynamic>(result);

            var searchResponse = wikiResponse[1].EnumerateArray();

            return searchResponse;
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
