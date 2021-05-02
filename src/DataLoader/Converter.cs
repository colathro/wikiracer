using MwParserFromScratch;
using System;
using MwParserFromScratch.Nodes;
using DataModels.StorageModels;
using System.Collections.Generic;

namespace DataLoader
{
    public static class Converter
    {
        public static Article ConvertWikitextToArticle(Wikitext wikiText, string title)
        {
            var article = new Article();
            AddParagraphs(wikiText, article);

            return article;
        }

        private static void AddParagraphs(Wikitext wikiText, Article article)
        {
            var lines = wikiText.EnumDescendants();

            foreach (var line in lines)
            {
                var paragraph = new DataModels.StorageModels.Paragraph();
                paragraph.Spans = new List<Span>();

                foreach (var inline in line.EnumDescendants())
                {
                    var span = new Span();
                    var type = inline.GetType();
                    if (type == typeof(PlainText))
                    {
                        PlainText plainText = (PlainText)inline;
                        Console.WriteLine(plainText.Content);
                    }
                }
            }
        }
    }
}