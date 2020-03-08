using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace wiki_racer.Hubs
{
    public class GameHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
