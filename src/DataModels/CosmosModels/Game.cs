using System.Collections.Generic;
using System;

namespace DataModels.CosmosModels
{
    public class Game : Record
    {
        public string StartArticle { get; set; }
        public string FinishArticle { get; set; }
        public bool Finished { get; set; }
        public List<GameHistory> GameHistories { get; set; }
    }
}