using System.Collections.Generic;

namespace DataModels.CosmosModels
{
    public class Lobby : Record
    {
        public string LobbyCode { get; set; }

        public List<User> Users { get; set; }

        public User Owner { get; set; }

        public bool Running { get; set; }

        public string ActiveGame { get; set; }

        public string Start { get; set; }

        public string End { get; set; }
    }
}