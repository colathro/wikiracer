using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArianaController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            return Ok("https://drive.google.com/file/d/14zAxYFIJme47b2Rno69SeVQHJbEgjM9r/view?usp=sharing");
        }
    }
}