import Config from '../src/config.js';

var Fixtures = {
    traderVouchers : {
        "1": [
            {"code": "SOL00000010", "updated_at": "2017-05-17"},
            {"code": "SOL00000011", "updated_at": "2017-05-17"},
        ],
    },
    postVouchers : {
            "success": [],
            "failure" : []
    }
};

Fixtures.apply = function(mock) {
    mock
        .onGet(Config.apiBase+'/traders/1/vouchers').reply(200,this.traderVouchers["1"])
        .onPost(Config.apiBase+'/vouchers').reply(200,this.postVouchers)
        .onAny().passThrough();
};

export default Fixtures;