using System;
using MwParserFromScratch.Nodes;
using DataModels.StorageModels;
using DataModels.StorageModels.Enums;
using System.Collections.Generic;

namespace DataLoader
{
    public static class Converter
    {
        public static Article ConvertWikitextToArticle(Wikitext wikiText, string title)
        {
            var article = new Article();
            article.Title = title;
            article.Paragraphs = new List<DataModels.StorageModels.Paragraph>();
            AddParagraphs(wikiText, article);

            return article;
        }

        private static void AddParagraphs(Wikitext wikiText, Article article)
        {
            var lines = wikiText.EnumChildren();

            foreach (var line in lines)
            {
                var flag = new FormatFlag();
                var paragraph = new DataModels.StorageModels.Paragraph();
                paragraph.Spans = new List<Span>();

                switch (line)
                {
                    case Heading heading:
                        paragraph.Level = heading.Level;
                        break;
                    default:
                        break;
                }

                foreach (var inline in line.EnumChildren())
                {
                    switch (inline)
                    {
                        case PlainText pt:
                            ProcessPlainText(pt, paragraph.Spans, flag);
                            break;
                        case WikiLink wl:
                            ProcessWikiLink(wl, paragraph.Spans, flag);
                            break;
                        case FormatSwitch fm:
                            if (fm.SwitchBold)
                            {
                                if (flag.Style == SpanStyle.Bold)
                                {
                                    flag.SetNone();
                                }
                                else
                                {
                                    flag.SetBold();
                                }
                            }
                            else if (fm.SwitchItalics)
                            {
                                if (flag.Style == SpanStyle.Italic)
                                {
                                    flag.SetNone();
                                }
                                else
                                {
                                    flag.SetItalic();
                                }
                            }
                            else
                            {
                                flag.SetNone();
                            }
                            break;
                        default:
                            break;
                    }
                }

                article.Paragraphs.Add(paragraph);
            }
        }

        private static void ProcessPlainText(PlainText node, List<Span> spans, FormatFlag flag)
        {
            var span = new Span();
            span.Style = flag.Style;
            span.Type = SpanType.Text;
            if (IsValidText(node.Content))
            {
                span.Text = CleanText(node.Content);
                spans.Add(span);
            }
        }

        private static void ProcessWikiLink(WikiLink node, List<Span> spans, FormatFlag flag)
        {
            var span = new Span();
            var ptTarget = (PlainText)node.Target.Inlines.FirstNode;
            var ptText = (PlainText)node.Text?.Inlines.FirstNode;
            if (ptText == null)
            {
                span.Text = ptTarget.Content;
            }
            else
            {
                span.Text = ptText.Content;
            }

            span.Link = ptTarget.Content;
            span.Style = flag.Style;
            span.Type = SpanType.Link;

            spans.Add(span);
        }

        private static bool IsValidText(string text)
        {
            if (text == "\r\n")
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        private static string CleanText(string text)
        {
            string output;

            output = text.Replace("\r", "");
            output = output.Replace("\n", "");

            return output;
        }
    }

    public class FormatFlag
    {
        public SpanStyle Style { get; set; }

        public void SetNone()
        {
            this.Style = SpanStyle.None;
        }

        public void SetItalic()
        {
            this.Style = SpanStyle.Italic;
        }

        public void SetBold()
        {
            this.Style = SpanStyle.Bold;
        }

        public void SetUnderline()
        {
            this.Style = SpanStyle.Underline;
        }
    }
}