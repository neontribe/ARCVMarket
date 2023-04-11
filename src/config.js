import pjson from "../package.json";

// --- Defaults ---
let env = "production",
    apiBase = "https://voucher-admin.neontribe.org/api",
    appVersion = pjson.version;

// --- Env Specific ---
if (location.hostname.match(/voucher-staging/)) {
    env = "staging";
    apiBase = "https://voucher-admin-staging.neontribe.org/api";
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
