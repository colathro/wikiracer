using System.Collections.Generic;

namespace DataModels.CosmosModels
{
    public class Lobby : Record
    {
        public List<LobbyPlayer> Players { get; set; }

        public List<string> BanList { get; set; }

        public User Owner { get; set; }

        public bool Running { get; set; }

        public bool IsPublic { get; set; }

        public bool IsOpen { get; set; }

        public string StartArticle { get; set; }

        public string EndArticle { get; set; }

        public List<Message> Messages { get; set; }
    }
}