# Docker

If you know what you are doing then jump straight to [components](#components) or [configuration](#configuration) sections, otherwise these instruction should get you started.

1. [Install docker desktop](#install-docker-desktop)

## Install docker desktop

Docker containers are available for Windows, Mac and Linux. Install intructions are here: [docker-composer](https://docs.docker.com/compose/install/). This guide will assume you have followed [Scenario one: Install Docker Desktop](https://docs.docker.com/compose/install/#scenario-one-install-docker-desktop).

## Start the container

Assuming you have a terminal open and have changed directory to the root of this repo:

```bash
docker compose up --build
```

The container will be ready to use when you see output something like this:

```
...
runtime modules 26.6 KiB 12 modules
orphan modules 723 bytes [orphan] 2 modules
javascript modules 1.07 MiB
modules by path ./src/ 207 KiB
modules by path ./src/components/*.vue 46.3 KiB 51 modules
modules by path ./src/pages/*.vue 46.4 KiB 35 modules
modules by path ./src/*.vue 69.8 KiB 8 modules
modules by path ./src/*.js 17.7 KiB 4 modules
modules by path ./src/mixins/*.js 1.74 KiB 4 modules
modules by path ./src/services/*.js 24.9 KiB 2 modules
modules by path ./src/fonts/*.ttf 208 bytes 2 modules
+ 1 module
modules by path ./node_modules/ 882 KiB 92 modules
./fixtures/fixtures.js 7.42 KiB [built] [code generated]
./package.json 1.81 KiB [built] [code generated]
webpack 5.77.0 compiled successfully in 3315 ms
```

If you are using Mac, Linux or WSL you can set the server to run as your user, this means that the files written by the project will be owned by you.

```bash
CURRENT_UID=$(id -u) docker compose up --build
```

Logs will appear in the terminal standard out.

## Wiring it up to ARCVService

This ARCMarket can be wired up to the ARCVService. Just checkout and start ARCVService, then checkout and start ARCVMarket.

```bash
git clone git@github.com:neontribe/ARCVService.git
CURRENT_UID=$(id -u) docker compose -f ARCVService/docker-compose.yml up --build -d
git clone git@github.com:neontribe/ARCVMarket.git
CURRENT_UID=$(id -u) docker compose -f ARCVMarket/docker-compose.yml up --build -d

```
