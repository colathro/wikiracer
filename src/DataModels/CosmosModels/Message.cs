using System.Collections.Generic;

namespace DataModels.CosmosModels
{
    public class Message
    {
        public string Id { get; set; }
        public LobbyPlayer Author { get; set; }
        public string Text { get; set; }
    }
}