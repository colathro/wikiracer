using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DataModels.Services;
using DataModels.StorageModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebServer.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class LobbyController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly LobbyService lobbyService;
        private readonly UserService userService;

        public LobbyController(LobbyService _lobbyService, UserService _userService, ILogger<LobbyController> _logger)
        {
            this.logger = _logger;
            this.lobbyService = _lobbyService;
            this.userService = _userService;
        }
    }
}