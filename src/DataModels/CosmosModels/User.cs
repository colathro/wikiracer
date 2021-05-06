using DataModels.CosmosModels.Enums;

namespace DataModels.CosmosModels
{
    public class User : Record
    {
        public AuthType AuthProvider { get; set; }
        public string DisplayName { get; set; }
    }
}