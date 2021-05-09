using System;
using System.Threading;
using System.IO;
using MwParserFromScratch;
using DataModels.StorageModels;
using DataModels.Services;

namespace DataLoader
{
    class Program
    {
        static void Main(string[] args)
        {
            var textParser = new WikitextParser();


            var articleService = initializeArticleService();

            using (var sr = new StreamReader("D:\\enwiki-latest-pages-articles.xml"))
            {

                using (StreamWriter w = File.AppendText("log.txt"))
                {
                    int count = 0;
                    int startFrom = 58700;
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
                            articleService.AddArticleAsync(article, page.IsRedirect, page.Redirect).ConfigureAwait(false).GetAwaiter().GetResult();
                            continue;
                        }
                        else
                        {
                            try
                            {
                                CancellationTokenSource source = new CancellationTokenSource();
                                source.CancelAfter(20000);
                                CancellationToken token = source.Token;
                                var ast = textParser.Parse(page.Text, token);
                                article = Converter.ConvertWikitextToArticle(ast, page.Title.ToLower());
                                articleService.AddArticleAsync(article, page.IsRedirect, page.Redirect).ConfigureAwait(false).GetAwaiter().GetResult();
                                continue;
                            }
                            catch (OperationCanceledException ex)
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
