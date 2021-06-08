using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebServer.Services;
using DataModels.CosmosModels;
using System.Collections.Generic;
using DataModels.StorageModels;
using System;
using System.Text;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebServer.Controllers
{
  [ApiController]
  [Authorize]
  [Route("api/[controller]")]
  public class LobbyController : ControllerBase
  {
    private readonly ILogger logger;
    private readonly LobbyService lobbyService;
    private readonly UserService userService;
    private readonly ArticleService articleService;
    private readonly GameService gameService;

    private static Random random = new Random((int)DateTime.Now.Ticks);

    public LobbyController(LobbyService _lobbyService,
      UserService _userService,
      ArticleService _articleService,
      GameService _gameService,
      ILogger<LobbyController> _logger)
    {
      this.logger = _logger;
      this.lobbyService = _lobbyService;
      this.userService = _userService;
      this.articleService = _articleService;
      this.gameService = _gameService;
    }

    [HttpGet("public")]
    public async Task<IActionResult> GetPublicLobbies([FromQuery] int page)
    {
      var response = new PublicLobbyResponse();
      response.Lobbies = await this.lobbyService.GetActiveLobbies(page);
      response.Pages = await this.lobbyService.GetActiveLobbiesCount() / 10;
      return Ok(response);
    }

    [HttpPost("join")]
    public async Task<IActionResult> JoinLobby([FromQuery] string lobbyKey)
    {
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());

      if (lobby.Players.Count(u => u.Id == user.Key) >= 1)
      {
        return Ok(lobby);
      }
      else
      {
        if (lobby.BanList.Count(bl => bl == user.Key) >= 1)
        {
          return BadRequest();
        }

        lobby.Players.Add(new LobbyPlayer
        {
          Id = user.Key,
          DisplayName = user.DisplayName,
          Avatar = user.Avatar,
          AuthProvider = user.AuthProvider,
          CurrentArticle = "",
          Finished = false,
          Active = false,
          LastUpdate = DateTime.UtcNow
        });

        await this.lobbyService.UpdateItemAsync(lobby);
        return Ok(lobby);
      }
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateLobby()
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var players = new List<LobbyPlayer>();

      players.Add(this.ConvertUserToLobbyPlayer(user));
      var lobby = new Lobby
      {
        Owner = new Owner{Id = user.Key, AuthProvider = user.AuthProvider},
        Players = players,
        Id = Guid.NewGuid().ToString(),
        Key = this.GenerateLobbyJoinKey(),
        BanList = new List<string>(),
        Messages = new List<Message>(),
        IsPublic = false,
        IsOpen = true
      };

      await this.lobbyService.AddItemAsync(lobby);
      return Ok(lobby);
    }

    private LobbyPlayer ConvertUserToLobbyPlayer(User user)
    {
      return new LobbyPlayer
      {
        Id = user.Key,
        DisplayName = user.DisplayName,
        Avatar = user.Avatar,
        AuthProvider = user.AuthProvider
      };
    }

    private string GenerateLobbyJoinKey()
    {
      const string pool = "AAABCDEEEFGHIIIJKLMNOOOPQRSTUUUVWXYYYZ";
      var builder = new StringBuilder();

      for (var i = 0; i < 5; i++)
      {
        var c = pool[random.Next(0, pool.Length)];
        builder.Append(c);
      }

      return builder.ToString();
    }

    [HttpGet("player/article")]
    public async Task<IActionResult> GetArticle([FromQuery] string lobbyKey, [FromQuery] string key, [FromQuery] bool useStorageAccount)
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);

      if (!CallerIsInLobby(lobby, user))
      {
        return BadRequest();
      }

      bool updateGame = true;
      key = key.ToLower();

      if (key != lobby.StartArticle) // if its not the start article
      {
        if (!IsGameRunning(lobby)) // and the game is not running
        {
          return BadRequest("not started");
        }
      }

      if (!IsGameRunning(lobby)) // if game is runnning
      {
        updateGame = false; // dont update game as its not there yet - start will
      }

      var article = useStorageAccount ? 
        await this.articleService.GetArticleAsync(key) 
        : await this.articleService.GetArticleMediaWikiAsync(key);
      article.Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(article.Title);

      await lobbyService.SetCurrentArticle(lobbyKey, user.Key, key);
      
      if (updateGame)
      {
        var game = await this.gameService.GetItemAsync(lobby.GameId);
        var nagivation = new GameNavigation{
          Timestamp = DateTime.UtcNow,
          Article = article.Title
        };
        game.GameHistories.FirstOrDefault(gh => gh.Player.Id == user.Key)?.Navigations.Add(nagivation);
        await this.gameService.UpdateItemAsync(game);
      }

      return Ok(article);
    }

    [HttpPost("player/message")]
    public async Task<IActionResult> Message([FromQuery] string lobbyKey, [FromQuery] string message)
    {
      if (message.Length >= 145)
      {
        return BadRequest();
      }

      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      if (!CallerIsInLobby(lobby, user))
      {
        return BadRequest();
      }

      var messageObject = new Message
      {
        Author = this.ConvertUserToLobbyPlayer(user),
        Id = Guid.NewGuid().ToString(),
        Text = message
      };

      lobby.Messages.Add(messageObject);

      await this.lobbyService.UpdateItemAsync(lobby);

      return Ok();
    }

    [HttpPost("owner/ban")]
    public async Task<IActionResult> Ban([FromQuery] string lobbyKey, [FromQuery] string userKey)
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      if (!CallerIsOwner(lobby, user))
      {
        return BadRequest();
      }

      lobby.BanList.Add(userKey);
      lobby.Players.RemoveAll(lp => lp.Id == userKey);
      await this.lobbyService.UpdateItemAsync(lobby);

      return Ok();
    }

    [HttpGet("owner/setarticle")]
    public async Task<IActionResult> SetArticle([FromQuery] string lobbyKey, [FromQuery] string start, [FromQuery] string finish)
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      if (!CallerIsOwner(lobby, user))
      {
        return BadRequest();
      }

      await this.lobbyService.SetStartEndArticle(lobbyKey, start, finish);
      return Ok();
    }

    [HttpGet("owner/search")]
    public async Task<IActionResult> Search([FromQuery] string lobbyKey, [FromQuery] string term)
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      if (!CallerIsOwner(lobby, user))
      {
        return BadRequest();
      }

      var searchResults = await this.articleService.SearchForArticles(term);
      return Ok(searchResults);
    }

    [HttpPost("owner/setpublic")]
    public async Task<IActionResult> SetPublic([FromQuery] string lobbyKey, [FromQuery] bool isPublic)
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      if (!CallerIsOwner(lobby, user))
      {
        return BadRequest();
      }

      lobby.IsPublic = isPublic;

      await this.lobbyService.UpdateItemAsync(lobby);

      return Ok();
    }

    [HttpPost("owner/start")]
    public async Task<IActionResult> Start([FromQuery] string lobbyKey)
    {
      var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());
      var lobby = await this.lobbyService.GetLobby(lobbyKey);
      if (lobby == default)
      {
        return NotFound();
      }

      if (!CallerIsOwner(lobby, user))
      {
        return BadRequest("not owner");
      }

      if (lobby.EndTime.AddSeconds(20) > DateTime.UtcNow)
      {
        return BadRequest("cooldown"); // game isn't over - can't start another
      }

      if (!IsStartAndFinishSet(lobby)){
        return BadRequest("startfinish");
      }

      var gameId = Guid.NewGuid().ToString();

      var now = DateTime.UtcNow;

      var game = new Game{
        Id = gameId,
        Key = gameId,
        Finished = false,
        GameHistories = new List<GameHistory>(),
        StartArticle = lobby.StartArticle,
        FinishArticle = lobby.EndArticle
      };

      foreach(var player in lobby.Players)
      {
        if (player.Active){
          // foreach player in the lobby, add a history for them
          var gameHistory = new GameHistory{
            Player = player,
            Navigations = new List<GameNavigation>{ 
              new GameNavigation{Article=lobby.StartArticle, Timestamp=now
              }
            }
          };

          game.GameHistories.Add(gameHistory);

          var playerUser = await this.userService.GetUser(player.Id, player.AuthProvider);
          playerUser.GameIds.Add(gameId);
          await this.userService.UpdateItemAsync(playerUser);
        }
      }

      lobby.GameId = gameId;
      lobby.StartTime = now.AddSeconds(10); 
      lobby.EndTime = now.AddMinutes(4);

      await this.lobbyService.UpdateItemAsync(lobby);
      await this.gameService.AddItemAsync(game);

      return Ok();
    }

    private bool CallerIsInLobby(Lobby lobby, User user)
    {
      return lobby.Players.Count(p => p.Id == user.Key) <= 1;
    }

    private bool CallerIsOwner(Lobby lobby, User user)
    {
      return lobby.Owner.Id == user.Key;
    }

    private string GetUserKey()
    {
      return this.HttpContext.User.FindFirst("sub").Value;
    }

    private string GetUserProvider()
    {
      return this.HttpContext.User.FindFirst("iss").Value;
    }

    private bool IsGameRunning(Lobby lobby){
      return lobby.StartTime <= DateTime.UtcNow 
        && DateTime.UtcNow <= lobby.EndTime;
    }

    private bool IsStartAndFinishSet(Lobby lobby){
      return !string.IsNullOrWhiteSpace(lobby.StartArticle) && !string.IsNullOrWhiteSpace(lobby.EndArticle);
    }
  }
}