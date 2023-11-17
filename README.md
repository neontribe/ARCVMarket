# ARCV Market

ARCV Market Tool designed to manage a voucher collector's interactions with the ARC voucher API.

## Build Setup

``` bash
# switch to correct node
nvm install && nvm use

# install dependencies
yarn install

# serve with hot reload at localhost:8081
yarn run dev

# build for production with minification
yarn run build
```
## Versioning, branching and tags

Use [semver](https://semver.org/) for versioning. Each sprint is considered a minor release until the customer asks for a major, non backwardly compatible re-write.

### Sprint development

* Find the trello card and grab the URL, e.g. `https://trello.com/c/P5aKkOWJ/2056-market-roll-up-repo`
* Create a branch off develop that uses the ticket number and title, e.g. `dev/2056-market-roll-up-repo`
* Work on the ticket
* Raise a PR into develop
* Add a link to the PR into the Trello card
* Wait for at least one approval on the PR
* Merge and delete branch

### Create a Release candidate

* Tag develop with the incremented release number, e.g. `git checkout develop && git tag v1.16.0-rc.1`
* Push the tag, `git push --tags`
* Release to staging

### Creating a Release

* Merge `develop` into `main`
* Tag main with a release, e.g. `git checkout main && git tag v1.16.0`
* Push the tag, `git push --tags`
* Release to live

### Hotfix

* Find the trello card and grab the URL, e.g. `https://trello.com/c/P5aKkOWJ/2099-HOTFIX-something-is-broken`
* Create a branch off **main** that uses the ticket number and title, e.g. `hotfix/2099-HOTFIX-something-is-broken`
* Work on the ticket
* Raise a PR merging into **main**
* Add a link to the PR into the Trello card
* Wait for at least one approval on the PR
* Merge and delete branch
* Once testing is passed create a release with an incremented patch number e.g. `git checkout develop && git tag v1.16.1`
* Release main to staging *This will change when we are containerised*
* Test on staging *This will change when we are containerised*
* Cherry-pick the hotfix commits back into develop
* Release to live


## Deployment
We suggest developing with a `.test` TLD.

1. `yarn run build`
2. `tar -cvzf ARCVMarket_v<x.y.z>(-[beta|RC]X) ./dist`
3. copy up to the server
4. login and move in the correct directory
5. `./deploy-market.sh ARCVMarket_v<x.y.z>(-[beta|RC]X) market__v<x.y.z>(-[beta|RC]X)`

## Testing
Uses [Testcafe](https://devexpress.github.io/testcafe/documentation/getting-started/) and [Chai](http://chaijs.com/)

1. Stop market (this app) if it's running
2. Set up [ARCVService](https://github.com/neontribe/ARCVService). These tests rely on a running service.
3. Reseed the database in ARCVService `php ./artisan migrate:refresh --seed`
4. Reset passport in ARCVService `php ./artisan passport:install`, see [points 8 - 10](https://github.com/neontribe/ARCVService#installation-of-development-instance)
5. Disable the mocks by setting the cookie in your broeser console `document.cookie = "arcv_ignore_mocks=true;max-age=" + 86400*30;`
6. Run with `yarn run test`

## Mocking
In a development environment you can enable auto-mocks by adding a cookie in the console.

``` js
document.cookie = "arcv_use_mocks=true;max-age=" + 86400*30;
```

# Copyright
This project was developed by :

Neontribe Ltd (registered in England and Wales #06165574)

Under contract for the Alexandra Rose Charity (registered in England and Wales #00279157)

As such, unless otherwise specified in the appropriate component source, associated file or compiled asset, files in this project repository are Copyright &copy; (2023), Alexandra Rose Charity. All rights reserved.

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

ARCV Market 1.7

Programming Language - JavaScript

Framework - vuejs 2.7 https://github.com/vuejs/vue/releases

Licence - MIT

Third Party Packages
- https://github.com/axios/axios MIT Licence https://github.com/axios/axios/blob/master/LICENSE
- https://github.com/ctimmerm/axios-mock-adapter MIT Licence https://github.com/ctimmerm/axios-mock-adapter/blob/master/LICENSE
- https://github.com/babel/babel/tree/master/packages/babel-polyfill MIT Licence https://github.com/babel/babel/blob/master/LICENSE
- https://github.com/necolas/normalize.css MIT Licence https://github.com/necolas/normalize.css/blob/master/LICENSE.md
- https://github.com/rcs/route-parser MIT Licence https://github.com/rcs/route-parser/blob/master/LICENSE.md
