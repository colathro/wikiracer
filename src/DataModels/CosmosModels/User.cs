using DataModels.CosmosModels.Enums;
using System;

namespace DataModels.CosmosModels
{
    public class User : Record
    {
        public AuthType AuthProvider { get; set; }
        public string DisplayName { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}