using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleController : ControllerBase
    {
        private readonly ILogger _logger;

        public SampleController(ILogger<SampleController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<string>> Get([FromQuery] int num)
        {
            _logger.LogWarning("An example of a Warning trace.");
            _logger.LogError("An example of an Error level message.");
            return new string[] { "value1", "value2", $"{num}" };
        }
    }
}