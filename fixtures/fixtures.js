import Route from 'route-parser';

var Fixtures = {
    traderVouchers : {
        "1": [
            {"code": "SOL00000010", "updated_at": "2017-05-17"},
            {"code": "SOL00000011", "updated_at": "2017-05-17"},
        ],
    },
    oauthUserToken  : {
        "token_type":"Bearer",
        "expires_in":600,
        "access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRkN2YyMjY4Nzc0YmFiNDYxNGE1OGY4MDJkZTk0ZmY4ZWVjODgwOGM2MzVhZWFhMzIzMDM2NmUzZmVjMzc2MDI0MWYxNDE1Y2Y4MDU0MTIxIn0.eyJhdWQiOiIyIiwianRpIjoiNGQ3ZjIyNjg3NzRiYWI0NjE0YTU4ZjgwMmRlOTRmZjhlZWM4ODA4YzYzNWFlYWEzMjMwMzY2ZTNmZWMzNzYwMjQxZjE0MTVjZjgwNTQxMjEiLCJpYXQiOjE0OTUwMzIwNTAsIm5iZiI6MTQ5NTAzMjA1MCwiZXhwIjoxNDk1MDMyNjUwLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.pTRPGMe_HrSvoCUV9PEvsqcL_ckzh4OKWD2Y2HxEPnmthXs8hij4yOd2kCXpR_wFu1Z_OkCS7y2ApL4v3_nvdzFlzDvaNsP3JGxgctH5yZJ7mPFHNUGukLhX5NwncRBfcldfUnkhQ0e8PtImRv7l1Dw5hyA4UX7DQBTx9eoVclY4mL02Mq1lfc2CLxi06YrUby_-rpIbj6balXFl95kl_dEvtiCn2wty4ibINOfoYBii4VeVmOroLt2Wp0zXALkN24bmlQcs4DOPUivralAhmnNmLNXQHuLqK3MSQFkZ3Wm4UDZJ6XYTWKIM3LJUFgsGvMHS3wiploZ7uyNbEhZ-SS-R1iV_yCLoKENn2aPZOZkm_pe92UcmBeqOXXRYH8s3mTklWR6USGS0KunYh1AHmwd1QVJVoQYhr0vTv4hGtD0-nmCCZV-tYNqOVENkug-Pg0AxdkhU-oI3uBDYLNG_6Q2ph20paUT9cPv1TLH4c_i_hfbH3TrvRQJRs9jWapm7sniuGDfcoCQ2J8bVeyATt3vTBGmO5u_WDDp2X65RIn1c2MvohYd30-Qoo4MbyS8XhvkpCM9mHvndsq5A3UXKrRQyX4uU4D5qgbUgxbX7lK1HQzf0t9hrNints9aze_3nBIu5jYVsFYYXm49_4302T2yQPbK_Pz88r9skx-odSu4",
        "refresh_token":"B6RvdJMzwDY7X1vK\/Eo+bLYX8Gdc2A7YYz7RgL7qMDo4zbCRuRO4DGHxt5TmF7vu8d1JSSZnSW9pYM+ztjQWBUPAclGQxymrGRnLCP+VNLMzfkyhNDHh1HJBSkEEd5cs3Itk207t5ZWiPiv1BCX9tJSpK9vx8keZyiYTDnBnvS1V\/brl+YIQhY+Gqkc6zQDmmCssGnXq4fLdrdVU\/huzKF6NDKqsVodEGS0C5q+ZUs5NGljHwllDMzk6ikH5H\/grzjJp9V41RdTMgRp5cmwK1\/HGT09oPZL2G9J75O5WfOqiBWjqyK5IVnYqUoDkxRFEsAsAgdH501n2n8KqsJOhM5fL1gpJ6nLRuradIH9Xg32\/FAUZoRJ4y1OEEvTtJt+7u1UpIw2+1jrAn4eLwwcKn5rOeXz9jH9SmM1lGZNA51PJymTttm+ynzDvTRDos4msIWn\/LLTmAj4fkGvYXX8TFHU9MI0nreVp1cjL+1tV9GpDUmZRjnoR7pOpD+kNYpORbuIXE+YD1rkQ8fBqYNfwaD1X4O9DIcFU\/5WtjhH2Pozff4XvymzGWZxxDwJZ\/ZlKrEBjUN8NzMq+SKuAHapNox1a+B5Bi+mPIF9adLSeTDfEZ6eKNlgQFQe54wMsxLiaY3iJqPCYKzJLFnbPFKIZIcYFrsE5boSrA6cRxzqeAtY="
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
    mock.onPost('/oauth/token').reply(200,this.oauthUserToken);
    mock.onAny().passThrough();
};

export default Fixtures;