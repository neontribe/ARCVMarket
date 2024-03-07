import pjson from "../package.json";

// --- Defaults ---
let env = "production",
    apiBase = "https://voucher-admin.alexandrarose.org.uk/api",
    appVersion = pjson.version,
    useMocks = false;

// --- Env Specific ---
if (location.hostname.match(/voucher-staging/)) {
    env = "staging";
    apiBase = "https://voucher-admin-staging.alexandrarose.org.uk/api";
}

if (location.hostname.match(/localhost|(\.(dev|test))$/)) {
    env = "development";
    apiBase =
        process.env.API_BASE ||
        window.location.protocol + "//arcv-service.test/api";
    useMocks =
        process.env.USE_MOCKS === "true" ||
        document.cookie.indexOf("arcv_use_mocks=true") >= 0;
}
console.log(window.location);
console.log("ENV: development");
console.log("apiBase", apiBase);
console.log("useMocks", useMocks);

export default {
    apiBase: apiBase,
    env: env,
    appVersion: appVersion,
    useMocks: useMocks,
};
