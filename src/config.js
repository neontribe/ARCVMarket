/* Copyright (c) 2017, Alexander Rose Charity (reg. in England and Wales, #00279157) */
// --- Defaults ---
var env = 'production',
    apiBase = 'https://arcvservice-prealpha.neontribe.org/api',
    appVersion = 'v0.1.0';

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
