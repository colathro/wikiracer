using DataModels.StorageModels.Enums;
using System.Collections.Generic;

namespace DataModels.StorageModels
{
    public class Span
    {
        public string Text { get; set; }
        public string Link { get; set; }
        public SpanType Type { get; set; }
        public SpanStyle Style { get; set; }
        public List<string> Args { get; set; }
    }
}