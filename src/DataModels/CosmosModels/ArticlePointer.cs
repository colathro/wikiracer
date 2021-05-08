namespace DataModels.CosmosModels
{
    public class ArticlePointer : Record
    {
        public string Link { get; set; }

        public bool Redirect { get; set; }

        public string RedirectTarget { get; set; }
    }
}