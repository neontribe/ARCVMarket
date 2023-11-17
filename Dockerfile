ARG BRANCH="develop"

FROM node:16.20.2 as base
ARG BRANCH

RUN git clone --depth 1 --branch ${BRANCH} https://github.com/neontribe/ARCVService.git /opt/project && \
    git -C /opt/project rev-parse HEAD > /opt/project/current_hash

WORKDIR /opt/project
RUN yarn

FROM base as dev
ENTRYPOINT yarn run dev

FROM base as prod
ENTRYPOINT yarn prod

