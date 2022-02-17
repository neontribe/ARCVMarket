// --- Defaults ---
let env = "production",
    apiBase = "https://voucher-admin.alexandrarose.org.uk/api",
    appVersion = "v1.4.1";

// --- Env Specific ---
if (location.hostname.match(/voucher-staging/)) {
    env = "staging";
    apiBase = "https://voucher-admin-staging.alexandrarose.org.uk/api";
}

if (location.hostname.match(/localhost|(\.(dev|test))$/)) {
    env = "development";
    apiBase = "http://arcv-service.test/api";
}

export default {
    apiBase: apiBase,
    env: env,
    appVersion: appVersion,
};
