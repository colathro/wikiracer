using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DataModels.Services;
using DataModels.StorageModels;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly ArticleService articleService;

        public SampleController(ArticleService _articleService, ILogger<SampleController> _logger)
        {
            this.logger = _logger;
            this.articleService = _articleService;
        }

        [HttpGet]
        public async Task<ActionResult<string>> Get([FromQuery] int num)
        {
            var article = new Article
            {
                Title = "Anarchism"
            };
            await this.articleService.AddArticleAsync(article);
            return "Success";
        }

        [HttpGet("add")]
        public async Task<ActionResult<string>> Add()
        {
            var id = "e3df9c39-2c30-47e2-a5e3-10490424d2cf";
            var key = "Anarchism";
            await this.articleService.DeleteArticleAsync(key, id);
            return "Success";
        }
    }
}