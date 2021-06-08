using System.Collections.Generic;
using System;

namespace DataModels.CosmosModels
{
    public class Lobby : Record
    {
        public List<LobbyPlayer> Players { get; set; }

        public List<string> BanList { get; set; }

        // owner of lobby who has access to owner actions (set articles, settings, start)
        public Owner Owner { get; set; }

        //public lobbies show up to client in publiclobby list
        public bool IsPublic { get; set; }

        // used by client to know which lobbies are joinable
        public bool IsOpen { get; set; }

        public string GameId { get; set;}

        // used by client to know when a game is started.
        public DateTime StartTime { get; set; }

        // used by client to calculate timer and tell when game is not started.
        public DateTime EndTime { get; set; }

        public string StartArticle { get; set; }

        public string EndArticle { get; set; }

        public List<Message> Messages { get; set; }
    }
}