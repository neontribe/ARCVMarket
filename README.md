# arcvmarket

> ARCV Market Tool

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Deployment setup with Travis CI

1. On every code push Travis will run npm install and tests.
2. If the push is to the release branch (as named in .travis.yml), it will build a prod version and deploy to gh-pages branch.

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
