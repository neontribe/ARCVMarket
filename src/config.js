
// --- Defaults ---
var env = 'production',
    apiBase = 'https://voucher-admin.alexandrarose.org.uk/api',
    appVersion = 'v1.0.0';

// --- Env Specific ---
if (location.hostname.match(/voucher-staging/) {
    env = 'staging';
    apiBase = 'https://voucher-admin-staging.alexandrarose.org.uk/api';
}

if (location.hostname.match(/localhost|(\.(dev|app))$/)) {
    env = 'development';
    apiBase = 'http://arcv-service.app/api';
}

export default {
    apiBase: apiBase,
    env: env,
    appVersion: appVersion
};
