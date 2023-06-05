#!/bin/bash -x

# Do I have a GID in the container
echo "Current user: $CURRENT_UID"
# shellcheck disable=SC2153
GROUP_NAME=$(id -gn "$CURRENT_UID")
# shellcheck disable=SC2181
if [ "$?" != 0 ]; then
  CURRENT_GID=33
  GROUP_NAME=www-data
else
  CURRENT_GID=$(id -g "$CURRENT_UID")
fi

# Do I have a UID in the container
USER_NAME=$(id -un "${CURRENT_UID}")
if [ -z "$USER_NAME" ]; then
  echo arcuser:x:${CURRENT_UID}:${CURRENT_GID}::/var/www:/usr/sbin/nologin >> /etc/passwd
  USER_NAME=arcuser
  pwconv
fi

echo "Setting permission to $USER_NAME:$GROUP_NAME"
chown -R "${USER_NAME}:${GROUP_NAME}" /opt/project
su -c "yarn run cross-env NODE_ENV=development API_BASE=${API_BASE} webpack-dev-server --mode development --open" -s /bin/bash "$USER_NAME"
