using System;
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

            using (var sr = new StreamReader("/Users/colton/wikiracer/src/DataLoader/wikidumps/enwiki-latest-pages-articles1.xml-p1p41242"))
            {
                var parser = Parser.Create(sr.BaseStream);
                foreach (var page in parser.ReadPages())
                {
                    Console.WriteLine(page.Title);

                    Article article;

                    if (page.IsRedirect)
                    {
                        article = Converter.ConvertWikitextToArticle(null, page.Title.ToLower(), page.IsRedirect, page.Redirect);
                    }
                    else
                    {
                        var ast = textParser.Parse(page.Text);
                        article = Converter.ConvertWikitextToArticle(ast, page.Title.ToLower());
                    }

                    articleService.AddArticleAsync(article, page.IsRedirect, page.Redirect).ConfigureAwait(false).GetAwaiter().GetResult();
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
    }
}
