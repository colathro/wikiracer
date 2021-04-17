using Newtonsoft.Json;

namespace DataModels.CosmosModels
{
    public class Record
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        public string Key { get; set; }
    }
}