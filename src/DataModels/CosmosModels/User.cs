using DataModels.CosmosModels.Enums;
using System.Collections.Generic;
using System;

namespace DataModels.CosmosModels
{
    public class User : Record
    {
        public AuthType AuthProvider { get; set; }
        public string DisplayName { get; set; }
        public DateTime CreatedOn { get; set; }

        public List<string> GameIds { get; set; }

        public string Avatar { get; set; }
        public List<string> UnlockedAvatars { get; set; }

        public int Level { get; set; }
        public int Experience { get; set; }
        public int Coins { get; set; }

        public List<string> Badges { get; set; }
    }
}