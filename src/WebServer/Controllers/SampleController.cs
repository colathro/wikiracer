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
        public async Task<ActionResult> Get()
        {
            var articles = await this.articleService.GetItemsAsync("SELECT * FROM c");
            return Ok(articles);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromQuery] string title)
        {
            var article = new Article
            {
                Title = title
            };
            await this.articleService.AddArticleAsync(article);
            return Ok(article);
        }

        [HttpDelete]
        public async Task<ActionResult> Delete([FromQuery] string title)
        {
            await this.articleService.DeleteArticleAsync(title);
            return Ok();
        }
    }
}