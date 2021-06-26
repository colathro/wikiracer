using DataLoader.MwParserFromScratch.Nodes;
using DataModels.StorageModels;
using DataModels.StorageModels.Enums;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;

namespace WikiGraph
{
    public static class Converter
    {
        public static void AddToGraph(Wikitext wikiText, string title, ConcurrentDictionary<string, WikiNode> con, bool isRedirect = false, string redirectTarget = "")
        {
            try
            {
                if (Converter.DoesNodeExist(title, con))
                {
                    var node = GetNode(title, con);
                    AddEdges(wikiText, node, title, con);
                }
                else
                {
                    InsertNode(title, false, con);
                    var node = GetNode(title, con);

                    AddEdges(wikiText, node, title, con);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        private static void AddEdges(Wikitext wikiText, WikiNode node, string title, ConcurrentDictionary<string, WikiNode> con)
        {
            var lines = wikiText.EnumChildren();
            foreach (var line in lines)
            {
                foreach (var inline in line.EnumChildren())
                {
                    switch (inline)
                    {
                        case WikiLink wl:
                            ProcessWikiLink(wl, title, node, con);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        private static void ProcessWikiLink(WikiLink wl, string title, WikiNode node, ConcurrentDictionary<string, WikiNode> con)
        {
            var ptTarget = wl.Target.ToPlainText();

            if (Converter.DoesNodeExist(ptTarget, con))
            {
                var child = GetNode(ptTarget, con);
                Converter.InsertEdge(node, child, con);
            }
            else
            {
                InsertNode(ptTarget, false, con);
                var child = GetNode(ptTarget, con);
                Converter.InsertEdge(node, child, con);
            }
        }



        public static bool DoesNodeExist(string title, ConcurrentDictionary<string, WikiNode> con)
        {
            return con.ContainsKey(title);
        }

        public static WikiNode GetNode(string title, ConcurrentDictionary<string, WikiNode> con)
        {
            if (con.TryGetValue(title, out WikiNode node))
            {
                return node;
            }
            else
            {
                return null;
            }
        }

        public static void MakeRedirect(string title, ConcurrentDictionary<string, WikiNode> con)
        {
            if (con.TryGetValue(title, out WikiNode node))
            {
                node.IsRedirect = true;
            }
        }

        public static void InsertNode(string title, bool redirect, ConcurrentDictionary<string, WikiNode> con)
        {
            var node = new WikiNode
            {
                Title = title,
                IsRedirect = redirect,
                Edges = new List<WikiNode>()
            };

            con.TryAdd(title, node);
        }

        public static void InsertEdge(WikiNode parent, WikiNode child, ConcurrentDictionary<string, WikiNode> con)
        {
            parent.Edges.Add(child);
        }
    }
}