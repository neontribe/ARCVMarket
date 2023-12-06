ARG BRANCH="develop"

FROM node:16.20.2 as dev
LABEL licence="UNLICENSED"
LABEL maintainer="tobias@neontribe.co.uk"
ARG BRANCH
RUN git clone --depth 1 --branch ${BRANCH} https://github.com/neontribe/ARCVMarket.git /opt/project && \
    git -C /opt/project rev-parse HEAD > /opt/project/current_hash
WORKDIR /opt/project
RUN yarn
ENV API_BASE "http://arcv-service.test:8000/api"
ENV USE_MOCKS true
ENTRYPOINT yarn dev

FROM dev as prod_builder
# The way the app is written prod is hard coded to the live server
# ENV API_BASE="http://arcv-service.test:8000/api"
ENV NODE_ENV production
# Re-run the build as web pack sets the node env. Is that riuht?
RUN yarn build
ENV USE_MOCKS=false

FROM nginx as prod
ENV NODE_ENV production
COPY .docker/nginx_default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod_builder /opt/project/dist /usr/share/nginx/html

# docker build -t arcvouchers/market:develop --target=dev .
# docker run -p 8081:8081 --name arcmarket --rm -e API_BASE="https://voucher-admin-staging.alexandrarose.org.uk/api" arcvouchers/market:develop

# docker build -t arcvouchers/market:prod .
# docker run -p 80:80 --name arcmarket --rm arcvouchers/market:prod
