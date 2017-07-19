import Store from '../src/store.js';
var Fixtures = {
    userTraders: {
        "1": [
            {
                "id": 1,
                "name": "Kristy Corntop",
                "pic_url": null,
                "market_id": 2,
                "created_at": "24-05-2017 14:19:22",
                "updated_at": "24-05-2017 14:19:22",
                "deleted_at": null,
                "market": {
                    "id": 5,
                    "name": "Cedar Terrace",
                    "location": "68115-2529",
                    "sponsor_id": 1,
                    "created_at": "2017-07-19 10:25:48",
                    "updated_at": "2017-07-19 10:25:48",
                    "deleted_at": null,
                    "payment_message": "Placeholder Payment Message: Error voluptatem repudiandae ut dolor repellendus quos ea maiores officiis.",
                    "sponsor_shortcode": "RVNT"
                }
            },
            {
                "id": 2,
                "name": "Barry Thistlethorn",
                "pic_url": null,
                "market_id": 5,
                "created_at": "24-05-2017 14:19:22",
                "updated_at": "24-05-2017 14:19:22",
                "deleted_at": null,
                "market": {
                    "id": 5,
                    "name": "Beechwood Hall",
                    "location": "Sylvania",
                    "sponsor_id": 2,
                    "created_at": "2017-07-19 10:25:48",
                    "updated_at": "2017-07-19 10:25:48",
                    "deleted_at": null,
                    "payment_message": "Placeholder Payment Message: Veritatis veniam aut autem sed voluptatem non officia dignissimos ipsum quo.",
                    "sponsor_shortcode": "KMJG",
                }
            }
        ]
    },
    traderVouchers: {
        "1": [
            {"code": "SOL00000010", "updated_at": "17-05-2017 12:46.15"},
            {"code": "SOL00000011", "updated_at": "17-05-2017 12:46.15"},
        ],
        "2": [
            {"code": "SOL00000015", "updated_at": "17-05-2017 13:46.15"},
            {"code": "SOL00000012", "updated_at": "17-05-2017 14:46.15"},
        ]
    },
    voucherStatus: {
        "success":
            {"success":["RVNT12345678"], "fail":[], "invalid":[]},
        "fail":
            {"success":[], "fail":["FAL11111111"], "invalid":[]},
        "invalid":
            {"success":[], "fail":[], "invalid":["INV1"]},
    },
    traderVoucherHistory: {
        "1": [
            {
                "pended_on": "13-02-2017",
                "vouchers": [
                    {"code": "RVNT12345601", "recorded_on": "12-02-2017", "reimbursed_on": "15-02-2017"},
                    {"code": "RVNT12345602", "recorded_on": "12-02-2017", "reimbursed_on": "15-02-2017"}
                ]
            },
            {
                "pended_on": "10-03-2017",
                "vouchers": [
                    {"code": "SOL10000013", "recorded_on": "09-03-2017", "reimbursed_on": "17-03-2017"},
                    {"code": "SOL10000017", "recorded_on": "09-03-2017", "reimbursed_on": "17-03-2017"},
                    {"code": "RVNT12345631", "recorded_on": "09-03-2017", "reimbursed_on": ""},
                    {"code": "RVNT12345632", "recorded_on": "09-03-2017", "reimbursed_on": ""},
                    {"code": "SOL10000032", "recorded_on": "09-03-2017", "reimbursed_on": ""},
                    {"code": "SOL10000037", "recorded_on": "09-03-2017", "reimbursed_on": ""}
                ]
            },
        ],
        "2": [
            {
                "pended_on": "09-01-2017",
                "vouchers": [
                    {"code": "RVNT12345678", "recorded_on": "08-01-2017", "reimbursed_on": "11-01-2017"},
                    {"code": "RVNT12345679", "recorded_on": "08-01-2017", "reimbursed_on": "11-01-2017"},
                    {"code": "SOL10000014", "recorded_on": "08-01-2017", "reimbursed_on": "11-01-2017"},
                    {"code": "SOL10000016", "recorded_on": "08-01-2017", "reimbursed_on": "11-01-2017"}
                ]
            }
        ],
    },
    oauthUserToken: {
        "token_type": "Bearer",
        "expires_in": 600,
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRkN2YyMjY4Nzc0YmFiNDYxNGE1OGY4MDJkZTk0ZmY4ZWVjODgwOGM2MzVhZWFhMzIzMDM2NmUzZmVjMzc2MDI0MWYxNDE1Y2Y4MDU0MTIxIn0.eyJhdWQiOiIyIiwianRpIjoiNGQ3ZjIyNjg3NzRiYWI0NjE0YTU4ZjgwMmRlOTRmZjhlZWM4ODA4YzYzNWFlYWEzMjMwMzY2ZTNmZWMzNzYwMjQxZjE0MTVjZjgwNTQxMjEiLCJpYXQiOjE0OTUwMzIwNTAsIm5iZiI6MTQ5NTAzMjA1MCwiZXhwIjoxNDk1MDMyNjUwLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.pTRPGMe_HrSvoCUV9PEvsqcL_ckzh4OKWD2Y2HxEPnmthXs8hij4yOd2kCXpR_wFu1Z_OkCS7y2ApL4v3_nvdzFlzDvaNsP3JGxgctH5yZJ7mPFHNUGukLhX5NwncRBfcldfUnkhQ0e8PtImRv7l1Dw5hyA4UX7DQBTx9eoVclY4mL02Mq1lfc2CLxi06YrUby_-rpIbj6balXFl95kl_dEvtiCn2wty4ibINOfoYBii4VeVmOroLt2Wp0zXALkN24bmlQcs4DOPUivralAhmnNmLNXQHuLqK3MSQFkZ3Wm4UDZJ6XYTWKIM3LJUFgsGvMHS3wiploZ7uyNbEhZ-SS-R1iV_yCLoKENn2aPZOZkm_pe92UcmBeqOXXRYH8s3mTklWR6USGS0KunYh1AHmwd1QVJVoQYhr0vTv4hGtD0-nmCCZV-tYNqOVENkug-Pg0AxdkhU-oI3uBDYLNG_6Q2ph20paUT9cPv1TLH4c_i_hfbH3TrvRQJRs9jWapm7sniuGDfcoCQ2J8bVeyATt3vTBGmO5u_WDDp2X65RIn1c2MvohYd30-Qoo4MbyS8XhvkpCM9mHvndsq5A3UXKrRQyX4uU4D5qgbUgxbX7lK1HQzf0t9hrNints9aze_3nBIu5jYVsFYYXm49_4302T2yQPbK_Pz88r9skx-odSu4",
        "refresh_token": "B6RvdJMzwDY7X1vK\/Eo+bLYX8Gdc2A7YYz7RgL7qMDo4zbCRuRO4DGHxt5TmF7vu8d1JSSZnSW9pYM+ztjQWBUPAclGQxymrGRnLCP+VNLMzfkyhNDHh1HJBSkEEd5cs3Itk207t5ZWiPiv1BCX9tJSpK9vx8keZyiYTDnBnvS1V\/brl+YIQhY+Gqkc6zQDmmCssGnXq4fLdrdVU\/huzKF6NDKqsVodEGS0C5q+ZUs5NGljHwllDMzk6ikH5H\/grzjJp9V41RdTMgRp5cmwK1\/HGT09oPZL2G9J75O5WfOqiBWjqyK5IVnYqUoDkxRFEsAsAgdH501n2n8KqsJOhM5fL1gpJ6nLRuradIH9Xg32\/FAUZoRJ4y1OEEvTtJt+7u1UpIw2+1jrAn4eLwwcKn5rOeXz9jH9SmM1lGZNA51PJymTttm+ynzDvTRDos4msIWn\/LLTmAj4fkGvYXX8TFHU9MI0nreVp1cjL+1tV9GpDUmZRjnoR7pOpD+kNYpORbuIXE+YD1rkQ8fBqYNfwaD1X4O9DIcFU\/5WtjhH2Pozff4XvymzGWZxxDwJZ\/ZlKrEBjUN8NzMq+SKuAHapNox1a+B5Bi+mPIF9adLSeTDfEZ6eKNlgQFQe54wMsxLiaY3iJqPCYKzJLFnbPFKIZIcYFrsE5boSrA6cRxzqeAtY="
    }
};


Fixtures.apply = function (mock) {
    // Using regex because url contains params as well. And this is shorter.
    mock.onGet(/\/traders\/1\/vouchers/).reply(200, this.traderVouchers["1"]);
    mock.onGet(/\/traders\/2\/vouchers/).reply(200, this.traderVouchers["2"]);

    mock.onPost('/vouchers').reply((request) => {
        const voucherPayload = JSON.parse(request.data).vouchers;
        var response = {};
        if (voucherPayload.length > 1) {
            // This is a list of vouchers from an offline session.
            // Build response. For now, just return fail fixture.
            response = this.voucherStatus["fail"];
        } else {
            // We can use our single value fixtures. Response by sponsor code.
            switch(voucherPayload[0].substring(0,3)) {
                case 'FAL':
                    response = this.voucherStatus["fail"];
                    break;
                case 'INV':
                    response = this.voucherStatus["invalid"];
                    break;
                default:
                    response = this.voucherStatus["success"];
                    break;
            }

       }
       return [200, response];
    });

    mock.onPost('/login').reply(200, this.oauthUserToken);

    // route to get nicely structured user vouchers.
    mock.onGet('/traders/1/voucher-history').reply(200, this.traderVoucherHistory["1"]);
    mock.onGet('/traders/2/voucher-history').reply(200, this.traderVoucherHistory["2"]);
    mock.onPost(/\/traders\/\d\/voucher-history-email/).reply(202, "Thanks. If you don\'t receive an email with your voucher history, please try again later.");
    mock.onGet('/traders').reply(200, this.userTraders["1"]);

    // pass any other routes to actual endpoints
    mock.onAny().passThrough();
};

export default Fixtures;
