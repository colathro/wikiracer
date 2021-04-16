using System.Collections.Generic;
using System.Threading.Tasks;
using DataModels.CosmosModels;

namespace DataModels.Services
{
    public interface ICosmosService
    {
        Task<IEnumerable<Record>> GetItemsAsync(string query);
        Task<Record> GetItemAsync(string id);
        Task AddItemAsync(Record record);
        Task UpdateItemAsync(Record record);
        Task DeleteItemAsync(string id);
    }
}