using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace wiki_racer.Database
{
    public class GameContext : DbContext
    {
        public GameContext(DbContextOptions<GameContext> options)
            : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Lobby> Lobbies { get; set; }
        public DbSet<WikiPageCache> WikiPageCache { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Lobby>().ToTable("Lobbies");
            modelBuilder.Entity<WikiPageCache>().ToTable("WikiPageCache");
        }

        public User GetUser(string connectionId)
        {
            return this.Users.Where(u => u.ConnectionId == connectionId).First();
        }

        public Lobby? GetLobby(string lobby)
        {
            var lobbyReturn = this.Lobbies.Where(l => l.LobbyName == lobby)
                .Include(l => l.Users);

            if (lobbyReturn.Any())
            {
                return lobbyReturn.First();
            }
            else
            {
                return null;
            }
        }

        public bool LobbyExists(string lobby)
        {
            return this.Lobbies.Where(l => l.LobbyName == lobby).Any();
        }

        public bool LobbyExists(string lobby, string lang)
        {
            return this.Lobbies.Where(l => l.LobbyName == lobby && l.Language == lang).Any();
        }

        public GameState GetGameState(string lobby)
        {
            if (string.IsNullOrWhiteSpace(lobby))
            {
                return new GameState();
            }

            var lobbyObject = this.Lobbies.Where(l => l.LobbyName == lobby).Include(l => l.Users).First();

            var output = new GameState { Lobby = lobbyObject };

            return output;
        }

    }
}
