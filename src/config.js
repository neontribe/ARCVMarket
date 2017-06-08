
// --- Defaults ---
var env = 'production',
    apiBase = 'https://arcvservice-prealpha.neontribe.org/api',
    appVersion = 'v1.0.0';

// --- Env Specific ---
if (location.hostname.match(/localhost|(\.(dev|app))$/)) {
    env = 'development';
    apiBase = 'http://arcv-service.app/api';
}

export default {
    apiBase: apiBase,
    env: env,
    appVersion: appVersion
};
