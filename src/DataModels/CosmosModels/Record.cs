using Newtonsoft.Json;

namespace DataModels.CosmosModels
{
    public class Record
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        public string Key { get; set; }

        [JsonProperty(PropertyName = "_ts")]
        public long TimeStamp { get; set; }

        [JsonProperty(PropertyName = "_etag")]
        public string ETag { get; set; }
    }
}