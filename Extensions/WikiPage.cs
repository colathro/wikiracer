using System;
using System.Linq;
using System.Collections.Generic;

namespace wiki_racer.Extensions
{
    public class WikiTag
    {
        public string Id { get; set; }
        public string ClassName { get; set; }
        public string Tag { get; set; }
        public string InnerText { get; set; }
        public List<WikiTag> ChildElements { get; set; }
    }
}