using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using wiki_racer.Database;

namespace wiki_racer.WikipediaExtensions
{
    public class WikiCore
    {

        public static string GetWikiPage(string id, string lang, GameContext db, ILogger logger)
        {
            id = id.ToLowerInvariant();

            return TryGetWikiPageFromCache(id, lang, db, logger);
        }

        private static string TryGetWikiPageFromCache(string id, string lang, GameContext db, ILogger logger)
        {
            var article = db.WikiPageCache.Where(w => w.ArticleId == id && w.Language == lang);

            string output;

            if (article.Any()) 
            {
                if (article.First().TimeStamp < (DateTime.UtcNow + TimeSpan.FromDays(30))) // cache expires in 30 days
                {
                    output = article.First().PageContent;
                }
                else
                {
                    output = GetWikiPageFromWikipedia(id, lang, db, logger); // update cache
                    article.First().PageContent = output;
                }
            }
            else
            {
                output = GetWikiPageFromWikipedia(id, lang, db, logger);
                db.WikiPageCache.Add(new WikiPageCache
                {
                    ArticleId = id,
                    Language = lang,
                    PageContent = output,
                    TimeStamp = DateTime.UtcNow
                });
            }

            db.SaveChanges();

            return output;
        }

        private static string GetWikiPageFromWikipedia(string id, string lang, GameContext db, ILogger logger)
        {
            string data = "";

            string urlAddress = $"https://{lang}.wikipedia.org/wiki/{id}";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(urlAddress);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();

            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream receiveStream = response.GetResponseStream();
                StreamReader readStream = null;

                if (String.IsNullOrWhiteSpace(response.CharacterSet))
                    readStream = new StreamReader(receiveStream);
                else
                    readStream = new StreamReader(receiveStream, Encoding.GetEncoding(response.CharacterSet));

                data = readStream.ReadToEnd();

                response.Close();
                readStream.Close();
            }
            else
            {
                throw new Exception($"bad url {urlAddress}");
            }

            var element = ParseHTML(data);

            return element.OuterHtml;
        }

        public static HtmlNode ParseHTML(string data)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(data);
            foreach (HtmlNode link in doc.DocumentNode.SelectNodes("//a[@href]"))
            {
                // Get the value of the HREF attribute
                string hrefValue = link.GetAttributeValue("href", string.Empty);
                if (hrefValue.StartsWith("/wiki/"))
                {
                    link.Attributes.Append("onClick");
                    link.SetAttributeValue("onClick", $"traverse_page('{hrefValue.Substring(1)}')");
                    link.Attributes.Append("role");
                    link.SetAttributeValue("role", $"button");
                    link.Attributes.Remove("href");
                }
                else
                {
                    link.Attributes.Remove("href");
                    link.RemoveClass();
                    link.AddClass("notlink");
                }
            }

            var element = doc.GetElementbyId("content");

            return TrimPage(element);
        }

        public static HtmlNode TrimPage(HtmlNode doc)
        {
            var rootNode = doc.SelectSingleNode("//div[@class='mw-parser-output']");

            bool startRemoval = false;
            List<HtmlNode> toRemove = new List<HtmlNode>();

            // bop the top locks
            toRemove.Add(doc.SelectSingleNode("//div[@class='mw-indicators mw-body-content']"));

            // bop the edit spans
            try
            {
                var editNodes = doc.SelectNodes("//span[@class='mw-editsection']");
                if (editNodes != null)
                {
                    foreach (var sup in editNodes) { toRemove.Add(sup); }
                }
            }
            catch
            {
            }

            // bop the footer
            toRemove.Add(doc.SelectSingleNode("//div[@class='printfooter']"));

            // bop the catlink
            toRemove.Add(doc.SelectSingleNode("//div[@id='catlinks']"));

            // bop to table of contents
            toRemove.Add(doc.SelectSingleNode("//div[@id='toc']"));

            try
            {
                // bop the super script
                var superScriptNodes = doc.SelectNodes("//sup");
                foreach (var sup in superScriptNodes) { toRemove.Add(sup); }
            }
            catch
            {
            }

            foreach (var e in rootNode.ChildNodes)
            {
                if (startRemoval)
                {
                    toRemove.Add(e);
                }
                if (e.Name == "h2")
                {
                    foreach (var ee in e.ChildNodes)
                    {
                        if (ee.InnerText == "See also")
                        {
                            startRemoval = true;
                            toRemove.Add(e);
                        }
                    }
                }
            }

            foreach (var e in toRemove)
            {
                try
                {
                    e.Remove();
                }
                catch
                {
                    continue;
                }
            }

            return doc;
        }
    }
}
