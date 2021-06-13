using DataModels.CosmosModels.Enums;
using System;

namespace DataModels.CosmosModels
{
    public class LobbyPlayer
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Avatar { get; set; }
        public AuthType AuthProvider { get; set; }
        public string CurrentArticle { get; set; }
        public bool Finished { get; set; }
        public DateTime FinishedTime { get; set; }
        public bool Active { get; set; }
        public DateTime LastUpdate { get; set; }
    }
}