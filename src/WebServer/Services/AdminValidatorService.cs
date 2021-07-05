using System.Collections.Generic;

namespace WebServer.Services
{
    public static class AdminValidatorService
    {
        public static readonly List<string> Admins = new List<string> { "185619355", "565941023" };

        public static bool IsAdmin(string id)
        {
            return Admins.Contains(id);
        }
    }
}