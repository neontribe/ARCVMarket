import Route from 'route-parser';

var Fixtures = {
    traderVouchers: {
        "1": [
            {"code": "SOL00000010", "updated_at": "2017-05-17 12:46.15"},
            {"code": "SOL00000011", "updated_at": "2017-05-17 12:46.15"},
        ]
    },
    traderVoucherHistory: {
        "1": [
            {
                "payment_pending_on": "2017-02-13",
                "vouchers": [
                    {"code": "RVP12345601", "recorded_on" : "2017-02-12", "reimbursed_on": "2017-02-15"},
                    {"code": "RVP12345602", "recorded_on" : "2017-02-12", "reimbursed_on": "2017-02-15"}
                ]
            },
            {
                "payment_pending_on": "2017-03-10",
                "vouchers": [
                    {"code": "SOL10000012", "recorded_on" : "2017-03-09", "reimbursed_on": "2017-03-17"},
                    {"code": "SOL10000017", "recorded_on" : "2017-03-09", "reimbursed_on": "2017-03-17"},
                    {"code": "RVP12345631", "recorded_on" : "2017-03-09", "reimbursed_on": ""},
                    {"code": "RVP12345632", "recorded_on" : "2017-03-09", "reimbursed_on": ""},
                    {"code": "SOL10000032", "recorded_on" : "2017-03-09", "reimbursed_on": ""},
                    {"code": "SOL10000037", "recorded_on" : "2017-03-09", "reimbursed_on": ""}
                ]
            },
        ],
        "2": [
            {
                "payment_pending_on": "2017-01-09",
                "vouchers": [
                    {"code": "RVP12345678", "recorded_on": "2017-01-08", "reimbursed_on": "2017-01-11"},
                    {"code": "RVP12345679", "recorded_on": "2017-01-08", "reimbursed_on": "2017-01-11"},
                    {"code": "SOL10000011", "recorded_on": "2017-01-08", "reimbursed_on": "2017-01-11"},
                    {"code": "SOL10000015", "recorded_on": "2017-01-08", "reimbursed_on": "2017-01-11"}
                ]
            }
        ],
    }
};

Fixtures.apply = function (mock) {
    //TODO: example regex route;
    //TODO: example route-parsed route;
    mock.onGet('/traders/1/vouchers').reply(200, this.traderVouchers["1"]);

    mock.onPost('/vouchers').reply(function (request) {
        // returns a success regardless!
        // TODO : better emulation of server side validated responses;
        var data = {
            "success": JSON.parse(request.data).vouchers,
            "fail": [],
            "invalid": []
        };
        console.log(data);
        return [200, data];
    });

    // route to get nicely structured user vouchers.
    mock.onGet('/traders/1/vouchers/history').reply(200, this.traderVoucherHistory["1"]);

    // pass any other routes to actual endpoints
    mock.onAny().passThrough();
};

export default Fixtures;