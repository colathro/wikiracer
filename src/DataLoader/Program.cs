using System;
using System.IO;
using MwParserFromScratch;
using DataModels.Services;

namespace DataLoader
{
    class Program
    {
        static void Main(string[] args)
        {
            //var parser = new WikitextParser();

            //var ast = parser.Parse(text);
            //var article = Converter.ConvertWikitextToArticle(ast, "Anarchism");
            //var articleService = initializeArticleService();
            //articleService.AddArticleAsync(article).ConfigureAwait(false).GetAwaiter().GetResult();

            using (var sr = new StreamReader("/Users/colton/wikiracer/src/DataLoader/wikidumps/enwiki-latest-pages-articles1.xml-p1p41242"))
            {
                var parser = Parser.Create(sr.BaseStream);
                foreach (var page in parser.ReadPages())
                {
                    Console.WriteLine(page.Title);
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
