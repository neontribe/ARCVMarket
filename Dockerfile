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
# The way the app is written prod is hard coded to the live server "https://voucher-admin.alexandrarose.org.uk/api",
# ENV API_BASE="http://arcv-service.test:8000/api"
ENV NODE_ENV production
# Re-run the build as web pack sets the node env. Is that right?
RUN yarn build
ENV USE_MOCKS=false

FROM nginx as prod
ENV NODE_ENV production
COPY .docker/nginx_default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod_builder /opt/project/dist /usr/share/nginx/html

# docker build -t 192.168.21.97:5000/arcvouchers/market:develop --target=dev . && docker build -t 192.168.21.97:5000/arcvouchers/market:prod .

# docker push 192.168.21.97:5000/arcvouchers/market:develop &&  docker push 192.168.21.97:5000/arcvouchers/market:prod
