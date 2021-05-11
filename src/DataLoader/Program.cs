using System;
using System.Threading;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using DataLoader.MwParserFromScratch;
using System.Text.RegularExpressions;
using DataLoader.MwParserFromScratch.Nodes;
using DataModels.StorageModels;
using DataModels.Services;

namespace DataLoader
{
    class Program
    {
        static void Main(string[] args)
        {
            //var articleService = initializeArticleService();

            using (var sr = new StreamReader("./wikidumps/enwiki-latest-pages-articles1.xml-p1p41242"))
            {

                using (StreamWriter w = File.AppendText("log.txt"))
                {
                    int count = 0;
                    int startFrom = 17000;
                    var parser = Parser.Create(sr.BaseStream);

                    foreach (var page in parser.ReadPages())
                    {
                        count++;
                        if (count % 100 == 0)
                        {
                            Console.WriteLine(count);
                        }

                        if (count < startFrom)
                        {
                            continue;
                        }

                        Article article;

                        if (page.IsRedirect)
                        {
                            article = Converter.ConvertWikitextToArticle(null, page.Title.ToLower(), page.IsRedirect, page.Redirect);
                            //articleService.AddArticleAsync(article, page.IsRedirect, page.Redirect).ConfigureAwait(false).GetAwaiter().GetResult();
                            continue;
                        }
                        else
                        {
                            try
                            {
                                var textParser = new WikitextParser { Logger = new MyParserLogger() };
                                CancellationTokenSource source = new CancellationTokenSource();
                                source.CancelAfter(20000);
                                CancellationToken token = source.Token;
                                var ast = textParser.Parse(page.Text, token);
                                article = Converter.ConvertWikitextToArticle(ast, page.Title.ToLower());
                                //articleService.AddArticleAsync(article, page.IsRedirect, page.Redirect).ConfigureAwait(false).GetAwaiter().GetResult();
                                continue;
                            }
                            catch (Exception ex)
                            {
                                Log(page.Title, w);
                            }
                        }
                    }
                }
            }
        }

        public static ArticleService initializeArticleService()
        {
            string account = "https://wikiracer.documents.azure.com:443/";
            string key = Environment.GetEnvironmentVariable("COSMOS_KEY");
            string connectionString = Environment.GetEnvironmentVariable("STORAGE_KEY");
            return new ArticleService(account, key, connectionString);
        }

        public static void Log(string logMessage, TextWriter w)
        {
            w.WriteLine(logMessage);
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
