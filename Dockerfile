ARG BRANCH="develop"

FROM node:16.20.2 as base
LABEL licence="UNLICENSED"
LABEL maintainer="tobias@neontribe.co.uk"

ARG BRANCH

RUN git clone --depth 1 --branch ${BRANCH} https://github.com/neontribe/ARCVMarket.git /opt/project && \
    git -C /opt/project rev-parse HEAD > /opt/project/current_hash

WORKDIR /opt/project
RUN yarn && yarn build

FROM base as dev
ENTRYPOINT yarn run dev

FROM nginx as prod
COPY --from=base /opt/project/dist /usr/share/nginx/html


# docker build -t arcvouchers/market:develop --target=dev .
# docker run -p 8081:8081 --name arcmarket --rm arcvouchers/market:develop

# docker build -t arcvouchers/market:prod .
# docker run -p 80:80 --name arcmarket --rm  arcvouchers/market:prod
