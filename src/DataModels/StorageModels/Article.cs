using System.Collections.Generic;

namespace DataModels.StorageModels
{
    public class Article
    {
        public string Title { get; set; }

        public List<Paragraph> Paragraphs { get; set; }
    }
}