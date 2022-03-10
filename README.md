# ARCV Market

ARCV Market Tool designed to manage a voucher collector's interactions with the ARC voucher API.

## Build Setup

``` bash
# switch to correct node
nvm install && nvm use

# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build
```

## Deployment
We suggest developing with a `.test` TLD.

1. `npm run build`
2. `tar -cvzf ARCVMarket_v<x.y.z>(-[beta|RC]X) ./dist`
3. copy up to the server
4. login and move in the correct directory
5. `./deploy-market.sh ARCVMarket_v<x.y.z>(-[beta|RC]X) market__v<x.y.z>(-[beta|RC]X)`

## Testing
Uses [Testcafe](https://devexpress.github.io/testcafe/documentation/getting-started/) and [Chai](http://chaijs.com/)

run with `npm run test`

## Mocking
In a development environment you can disable auto-mocks by adding a cookie in the console.

``` js
document.cookie = "arcv_ignore_mocks=true;max-age=" + 86400*30;
```

# Copyright
This project was developed by :

Neontribe Ltd (registered in England and Wales #06165574)

Under contract for the Alexandra Rose Charity (registered in England and Wales #00279157)

As such, unless otherwise specified in the appropriate component source, associated file or compiled asset, files in this project repository are Copyright &copy; (2022), Alexandra Rose Charity. All rights reserved.

If you wish to discuss copyright or licensing issues, please contact:

Alexandra Rose Charity

c/o Wise & Co,\
Wey Court West,\
Union Road,\
Farnham,\
Surrey,\
England,\
GU9 7PT

# Licensing and use of Third Party Applications
These are the languages and packages used to create ARCV Market and where available the licences associated with them.

ARCV Market 1.5

Programming Language - JavaScript

Framework - vuejs 2 https://github.com/vuejs/vue/releases

Licence - MIT

Third Party Packages
- https://github.com/axios/axios MIT Licence https://github.com/axios/axios/blob/master/LICENSE
- https://github.com/ctimmerm/axios-mock-adapter MIT Licence https://github.com/ctimmerm/axios-mock-adapter/blob/master/LICENSE
- https://github.com/babel/babel/tree/master/packages/babel-polyfill MIT Licence https://github.com/babel/babel/blob/master/LICENSE
- https://github.com/necolas/normalize.css MIT Licence https://github.com/necolas/normalize.css/blob/master/LICENSE.md
- https://github.com/rcs/route-parser MIT Licence https://github.com/rcs/route-parser/blob/master/LICENSE.md
