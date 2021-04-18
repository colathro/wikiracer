using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using DataModels.Services;
using WebServer.Hubs;
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

            if (!this.Environment.IsDevelopment())
            {
                services.AddApplicationInsightsTelemetry();
            }

            services.AddSingleton<GameService>(initializeGameService());
            services.AddSingleton<ArticleService>(initializeArticleService());

            services.AddSignalR();

            services.AddHostedService<GameSynchronizer>();

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

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/gamehub");
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

        private GameService initializeGameService()
        {
            string account = "https://wikiracer.documents.azure.com:443/";
            string key = this.Configuration["COSMOS_KEY"];
            return new GameService(account, key);
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
