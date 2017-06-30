# arcvmarket

> ARCV Market Tool

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build
```

## Testing
Uses [Testcafe](https://devexpress.github.io/testcafe/documentation/getting-started/) and [Chai](http://chaijs.com/)
run with `npm test`

## Mocking
In a development environment you can disable auto-mocks by adding a cookie in the console.

``` js
document.cookie = "arcv_ignore_mocks=true;max-age=" + 86400*30;
```

## Deployment setup with Travis CI - for how to set up or amend travis deploy with encrypted vars see ARCVService repo.

1. On every code push Travis will run npm install and tests.
2. If the push is to the release branch (as named in .travis.yml), it will build a prod version and deploy contents of `dist` to https://voucher-staging.alexandrarose.org.uk
(Note that the contents of the current `dist` dir are overwritten - there is no rolling back)

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Copyright
This project was developed by :

Neontribe Ltd (registered in England and Wales #06165574) 

Under contract for

Alexandra Rose Charity (registered in England and Wales #00279157) 

As such, unless otherwise specified in the appropriate component source, associated file or compiled asset, files in this project repository are Copyright &copy; (2017), Alexandra Rose Charity. All rights reserved.

If you wish to discuss copyright or licensing issues, please contact:

Alexandra Rose Charity

c/o Wise & Co, 
Wey Court West, 
Union Road, 
Farnham, 
Surrey, 
England,
GU9 7PT
