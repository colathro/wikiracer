using DataModels.CosmosModels.Enums;

namespace DataModels.CosmosModels
{
    public class LobbyPlayer
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Avatar { get; set; }
        public AuthType AuthProvider { get; set; }
        public string CurrentArticle { get; set; }
        public string Finished { get; set; }
    }
}