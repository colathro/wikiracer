using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace wiki_racer.Database
{
    public class User
    {
        [Key]
        public string UserName { get; set; }
    }

    public class Lobby
    {
        [Key]
        public string LobbyName { get; set; }
        public List<User> Users{ get; set; }
    }

    public class WikiPageCache
    {
        [Key]
        public string ArticleId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string PageContent { get; set; }
    }
}
