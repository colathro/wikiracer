using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace wiki_racer.Database
{
    public class User
    {
        [Key]
        public string ConnectionId { get; set; }
        public string UserName { get; set; }
        public string Avatar { get; set; }
        public string Lobby { get; set; }
        public int Clicks { get; set; }
    }

    public class Lobby
    {
        [Key]
        public string LobbyName { get; set; }
        public List<User> Users { get; set; }
        public string Game { get; set; }
        public string Host { get; set; }
        public string StartArticle { get; set; }
        public string FinishArticle { get; set; }
        public bool GameRunning { get; set; }
        public string Winner { get; set; }
    }

    public class WikiPageCache
    {
        [Key]
        public string ArticleId { get; set; }
        public string Language { get; set; }
        public DateTime TimeStamp { get; set; }
        public string PageContent { get; set; }
    }
}
