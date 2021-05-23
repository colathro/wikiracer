using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using DataModels.Services;
using WebServer.Hubs;
using System.Threading.Tasks;
using System.Text;
using WebServer.BackgroundServices;

namespace WebServer
{
    public class Startup
    {
        public IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddResponseCompression();

            if (!Environment.IsDevelopment())
            {
                services.AddApplicationInsightsTelemetry("3b402ab6-f9a9-4597-bac3-1bf57241ddf5");
            }

            services.AddSingleton<UserService>(initializeUserService());
            services.AddSingleton<LobbyService>(initializeLobbyService());
            services.AddSingleton<ArticleService>(initializeArticleService());
            services.AddSingleton<IConfiguration>(Configuration);

            services.AddAuthentication()
                .AddJwtBearer("Twitch", options =>
                {
                    options.TokenValidationParameters.ValidateLifetime = false;
                    options.Audience = "fprj9ag7iy0cq29pbkaarxw26qe2i0";
                    options.Authority = "https://id.twitch.tv/oauth2";

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/lobbyhub")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                })
                .AddJwtBearer("WikiRacer", options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "https://wikiracer.com",
                        ValidAudience = "https://wikiracer.com",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.Configuration["ENCRYPTION_KEY"]))
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/lobbyhub")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder("Twitch", "WikiRacer")
                    .AddAuthenticationSchemes("Twitch", "WikiRacer")
                    .RequireAuthenticatedUser()
                    .Build();
            });

            services.AddSignalR();

            services.AddHostedService<LobbySynchronizer>();
            services.AddHostedService<CleanupService>();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "WebClient/build";
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseResponseCompression();
            app.UseRouting();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<LobbyHub>("/lobbyhub");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "../WebClient";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private LobbyService initializeLobbyService()
        {
            string account = "https://wikiracer.documents.azure.com:443/";
            string key = this.Configuration["COSMOS_KEY"];
            return new LobbyService(account, key);
        }

        private UserService initializeUserService()
        {
            string account = "https://wikiracer.documents.azure.com:443/";
            string key = this.Configuration["COSMOS_KEY"];
            return new UserService(account, key);
        }

        private ArticleService initializeArticleService()
        {
            string account = "https://wikiracer.documents.azure.com:443/";
            string key = this.Configuration["COSMOS_KEY"];
            string connectionString = this.Configuration["STORAGE_KEY"];
            return new ArticleService(account, key, connectionString);
        }
    }
}
