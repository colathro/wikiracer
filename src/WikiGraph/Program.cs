using System;
using System.Threading;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Diagnostics;
using DataLoader.MwParserFromScratch;
using System.Text.RegularExpressions;
using DataLoader;
using System.CommandLine;
using System.CommandLine.Invocation;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace WikiGraph
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var rootCommand = new RootCommand();

            rootCommand.Add(new Option<int>("--start"));

            rootCommand.Handler = CommandHandler.Create<int>(Run);

            await rootCommand.InvokeAsync(args);
        }

        public static void Run(int start)
        {
            // 211812 68
            // 21181268
            var con = new ConcurrentDictionary<string, WikiNode>();

            var total = 21181268 - start;
            var firstThreadAdditional = total % 20;
            Console.WriteLine($"firstThreadAdditional {firstThreadAdditional}");

            var totalWithoutFirstThreadAdditional = total - firstThreadAdditional;
            Console.WriteLine($"totalWithoutFirstThreadAdditional {totalWithoutFirstThreadAdditional}");
            var perThreadProcessing = totalWithoutFirstThreadAdditional / 20;
            Console.WriteLine($"perThreadProcessing {perThreadProcessing}");

            var tasks = new List<Task>();
            var counter = start;

            for (int i = 0; i < 20; i++)
            {
                Console.WriteLine($"starting {start}");
                var runFinish = counter + perThreadProcessing;
                var runStart = counter;
                if (i == 0)
                {
                    runFinish += firstThreadAdditional;
                }

                Console.WriteLine($"finishing {runFinish}");

                Task task = Task.Factory.StartNew(() => DoWork(runStart, runFinish, con));

                counter = runFinish;

                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());

            var newDict = new Dictionary<string, WikiNode>(con);

            FileStream stream = File.Create("test123");
            var formatter = new BinaryFormatter();
            Console.WriteLine("Serializing vector");
            formatter.Serialize(stream, newDict);
            stream.Close();
            Console.WriteLine("Done.");
        }
        public static void DoWork(int start, int stop, ConcurrentDictionary<string, WikiNode> con)
        {
            Console.WriteLine($"Starting start:{start} stop:{stop}");
            //string connectionString =
            //"Data Source=DESKTOP-CB0D7DN;Initial Catalog=wikigraph;"
            //+ "Integrated Security=true";

            int count = 0;

            // using (SqlConnection con = new SqlConnection(connectionString))
            // {
            //     con.Open();
            using (var fs = new FileStream("C:\\Users\\carlos\\Desktop\\enwiki-latest-pages-articles.xml", FileMode.Open, FileAccess.Read, FileShare.Read))
            using (var sr = new StreamReader(fs))
            {
                var parser = Parser.Create(sr.BaseStream);

                foreach (var page in parser.ReadPages())
                {
                    try
                    {
                        count += 1;
                        if (count < start)
                        {
                            continue;
                        }

                        if (count >= stop)
                        {
                            break;
                        }

                        if (count % 100 == 0)
                        {
                            Console.WriteLine($"Currently At: {count}");
                        }
                        if (page.IsRedirect)
                        {
                            if (Converter.DoesNodeExist(page.Title, con))
                            {
                                // convert it to a redirect
                                Converter.MakeRedirect(page.Title, con);

                                if (!Converter.DoesNodeExist(page.Redirect, con))
                                {
                                    Converter.InsertNode(page.Redirect, false, con);
                                }

                                var parent = Converter.GetNode(page.Title, con);
                                var child = Converter.GetNode(page.Redirect, con);

                                Converter.InsertEdge(parent, child, con);
                            }
                            else
                            {
                                // add node
                                Converter.InsertNode(page.Title, true, con);

                                if (!Converter.DoesNodeExist(page.Redirect, con))
                                {
                                    Converter.InsertNode(page.Redirect, false, con);
                                }

                                var parent = Converter.GetNode(page.Title, con);
                                var child = Converter.GetNode(page.Redirect, con);

                                Converter.InsertEdge(parent, child, con);
                            }
                            continue;
                        }
                        else
                        {
                            try
                            {
                                var textParser = new WikitextParser();
                                CancellationTokenSource source = new CancellationTokenSource();
                                source.CancelAfter(500);
                                CancellationToken token = source.Token;
                                if (page.Id == 295901)
                                {
                                    continue;
                                }
                                var ast = textParser.Parse(page.Text, token);
                                Converter.AddToGraph(ast, page.Title, con);
                                continue;
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine("Fucked up here....");
                            }
                        }
                    }
                    catch (Exception e)
                    {

                    }

                    // }
                    Console.WriteLine($"Finishing start:{start} stop:{stop}");
                }
            }
        }
    }
}
