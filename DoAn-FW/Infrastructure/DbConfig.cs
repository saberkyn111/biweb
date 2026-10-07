using System;
using Microsoft.Extensions.Configuration;

namespace DoAn_FW.Infrastructure
{
    /// <summary>
    /// Centralized Database Configuration for BIWEB Platform.
    /// Reads connection strings from appsettings.json or falls back to local MySQL instances.
    /// Allows the entire application to be configured from a single setting.
    /// </summary>
    public static class DbConfig
    {
        // Default connection string (standard MySQL port 3306, biweb_db database)
        private const string DefaultConnection = "server=localhost;port=3306;database=biweb_db;uid=root;password=;";

        public static string ConnectionString { get; set; } = DefaultConnection;

        public static void Initialize(IConfiguration configuration)
        {
            if (configuration == null) return;

            var configured = configuration.GetConnectionString("DefaultConnection");
            if (!string.IsNullOrWhiteSpace(configured))
            {
                ConnectionString = configured;
            }
        }
    }
}
