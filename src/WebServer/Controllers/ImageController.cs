using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using HtmlAgilityPack;
using System.Net.Http;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly IHttpClientFactory clientFactory;

        public ImageController(ILogger<ImageController> _logger, IHttpClientFactory _clientFactory)
        {
            this.logger = _logger;
            this.clientFactory = _clientFactory;
        }

        [HttpGet]
        public async Task<ActionResult> Get([FromQuery] string imageurl)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://en.wikipedia.org/wiki/{imageurl}");

            request.Headers.Add("Api-User-Agent", "colton@fivestack.io");

            var client = this.clientFactory.CreateClient();

            var response = await client.SendAsync(request);
            var responseString = await response.Content.ReadAsStringAsync();

            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(responseString);

            var htmlBody = htmlDoc.DocumentNode.SelectNodes("//span[@class='mw-filepage-other-resolutions']");

            var actualLink = htmlBody[0].ChildNodes[1].Attributes[0].Value;

            var actualRequest = new HttpRequestMessage(HttpMethod.Get,
                $"https:{actualLink}");

            var actualResponse = await client.SendAsync(actualRequest);

            var actualResponseContent = await actualResponse.Content.ReadAsStreamAsync();


            return Ok(actualResponseContent);
        }
    }
}