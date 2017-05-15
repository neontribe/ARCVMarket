import Route from 'route-parser';

var Fixtures = {
    traderVouchers : {
        "1": [
            {"code": "SOL00000010", "updated_at": "2017-05-17"},
            {"code": "SOL00000011", "updated_at": "2017-05-17"},
        ],
    }
};

Fixtures.apply = function(mock) {
    //TODO: example regex route;
    //TODO: example route-parsed route;
    mock.onGet('/traders/1/vouchers').reply(200,this.traderVouchers["1"]);
    mock.onPost('/vouchers').reply(function(request) {
        // returns a success regardless!
        // TODO : better emulation of server side validated responses;
        var data = {
                "success" : JSON.parse(request.data).vouchers,
                "fail":[],
                "invalid":[]
            };
        console.log(data);
        return [200, data];
        });
    mock.onAny().passThrough();
};

export default Fixtures;