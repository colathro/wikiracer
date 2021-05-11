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
    public class ArticleController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly ArticleService articleService;

        public ArticleController(ArticleService _articleService, ILogger<ArticleController> _logger)
        {
            this.logger = _logger;
            this.articleService = _articleService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string key)
        {
            key = key.ToLower();
            return Ok(await this.articleService.GetArticleAsync(key));
        }
    }
}