using System.Collections.Generic;
using DataModels.CosmosModels;

public class GameResponse
{
    public IList<Game> Games { get; set; }
    public int Pages { get; set; }
}