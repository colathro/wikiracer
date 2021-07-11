using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using WebServer.Services;
using Octokit;

namespace WebServer.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BugIdeaController : ControllerBase
    {
        private readonly ILogger<BugIdeaController> logger;
        private readonly IGitHubClient githubClient;
        private readonly UserService userService;

        public BugIdeaController(ILogger<BugIdeaController> _logger, IGitHubClient _githubClient, UserService _userService)
        {
            this.logger = _logger;
            this.githubClient = _githubClient;
            this.userService = _userService;
        }

        [HttpPost("bug")]
        public async Task<ActionResult> SubmitBug([FromBody] string bug, [FromQuery] string title)
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());

            var issue = new NewIssue(title)
            {
                Body = bug
            };

            issue.Labels.Add("bug");
            issue.Labels.Add(user.DisplayName);

            var createdIssue = await this.githubClient.Issue.Create("fivestack-engineering", "wikiracer", issue);

            return Ok(createdIssue);
        }

        [HttpPost("idea")]
        public async Task<ActionResult> SubmitIdea([FromBody] string idea, [FromQuery] string title)
        {
            var user = await this.userService.GetUser(this.GetUserKey(), this.GetUserProvider());

            var issue = new NewIssue(title)
            {
                Body = idea
            };

            issue.Labels.Add("enhancement");
            issue.Labels.Add(user.DisplayName);

            var createdIssue = await this.githubClient.Issue.Create("fivestack-engineering", "wikiracer", issue);

            return Ok(createdIssue);
        }

        private string GetUserKey()
        {
            return this.HttpContext.User.FindFirst("sub").Value;
        }

        private string GetUserProvider()
        {
            return this.HttpContext.User.FindFirst("iss").Value;
        }
    }
}