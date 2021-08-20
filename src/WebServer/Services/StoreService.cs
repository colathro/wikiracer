using System.Collections.Generic;
using DataModels.CosmosModels;
using System.Linq;

namespace WebServer.Services
{
    public static class StoreService
    {
        public static List<StoreItem> GetAvailableItems(User user)
        {
            return StoreItems;
        }

        public static readonly List<StoreItem> StoreItems = new List<StoreItem> {
            new StoreItem {
                Name = "chicken.png",
                Price = 30,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "rabbit.png",
                Price = 25,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "willsmith.png",
                Price = 50,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "aoc.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "bezos.gif",
                Price = 300,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "dababy.jpg",
                Price = 50,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "charli.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "breaking_bad.jpg",
                Price = 50,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "john_cena.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "oprah.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "pulpfiction.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "harrypotter.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
             new StoreItem {
                Name = "hobbit.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "minions.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "familyguy.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "newgirl.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "kermit.gif",
                Price = 250,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "amongus.jpeg",
                Price = 30,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "bbgroot.jpeg",
                Price = 30,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "bbyoda.jpeg",
                Price = 40,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "captainamerica.png",
                Price = 20,
                Type = ItemType.Avatar,
            },
        };
    }

    public class StoreItem
    {
        public string Name { get; set; }
        public int Price { get; set; }
        public ItemType Type { get; set; }
    }

    public enum ItemType
    {
        Avatar,
        Badge
    }
}