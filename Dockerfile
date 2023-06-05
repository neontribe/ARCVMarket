FROM node:16.20.0

COPY . /opt/project
WORKDIR /opt/project
RUN yarn install && yarn

ENV CURRENT_UID 1000
ENTRYPOINT /opt/project/.docker/docker-entrypoint.sh
