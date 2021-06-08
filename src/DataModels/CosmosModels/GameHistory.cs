using System.Collections.Generic;
using System;

namespace DataModels.CosmosModels
{
    public class GameHistory
    {
        public LobbyPlayer Player { get; set; }
        public List<GameNavigation> Navigations { get; set; }
    }
}