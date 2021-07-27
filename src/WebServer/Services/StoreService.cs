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
                Price = 300,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "rabbit.png",
                Price = 250,
                Type = ItemType.Avatar,
            },
            new StoreItem {
                Name = "willsmith.png",
                Price = 500,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "aoc.gif",
                Price = 5000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "bezos.gif",
                Price = 10000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "dababy.jpg",
                Price = 750,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "charli.gif",
                Price = 5000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "breaking_bad.jpg",
                Price = 750,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "john_cena.gif",
                Price = 7000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "oprah.gif",
                Price = 15000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "pulpfiction.gif",
                Price = 6500,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "harrypotter.gif",
                Price = 5500,
                Type = ItemType.Avatar
            },
             new StoreItem {
                Name = "hobbit.gif",
                Price = 4000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "minions.gif",
                Price = 8500,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "familyguy.gif",
                Price = 5000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "newgirl.gif",
                Price = 6000,
                Type = ItemType.Avatar
            },
            new StoreItem {
                Name = "kermit.gif",
                Price = 5000,
                Type = ItemType.Avatar
            }
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