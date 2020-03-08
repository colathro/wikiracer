using System;
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

    }
}
