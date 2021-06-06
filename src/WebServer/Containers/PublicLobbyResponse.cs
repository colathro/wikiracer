using System.Collections.Generic;
using DataModels.CosmosModels;

public class PublicLobbyResponse
{
    public IList<Lobby> Lobbies { get; set;}
    public int Pages { get; set; }
}