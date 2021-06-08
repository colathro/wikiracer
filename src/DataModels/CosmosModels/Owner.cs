using DataModels.CosmosModels.Enums;
using System.Collections.Generic;
using System;

namespace DataModels.CosmosModels
{
    public class Owner
    {
        public AuthType AuthProvider { get; set; }
        public string Id { get; set; }
        public string DisplayName { get; set; }
    }
}