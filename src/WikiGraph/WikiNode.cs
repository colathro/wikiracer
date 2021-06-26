using System.Collections.Generic;
using System;

namespace WikiGraph
{
    [Serializable]
    public class WikiNode
    {
        public string Title;
        public bool IsRedirect;
        public List<WikiNode> Edges;
    }
}