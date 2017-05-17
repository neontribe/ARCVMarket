
// --- Defaults ---
var env = 'production',
    apiBase = 'https://arcvservice-prealpha.neontribe.org/api',
    appVersion = 'v0.2.0';

// --- Env Specific ---
if (location.hostname.match(/localhost|(\.(dev|app))$/)) {
    env = 'development';
    apiBase = 'http://arcv-service.app/api';
}

export default {
    apiBase: apiBase,
    env: env,
    appVersion: appVersion,
    apiCredentials : { // change this for your endpoint
        client_id: 2,
        client_secret: "GWtzXL3XF9VfarYWJ4ocJQGBg4Rx2Jp7KI1y8PzH"
    }
};
