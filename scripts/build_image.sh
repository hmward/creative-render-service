#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

# color definition
# Num  Colour    #define         R G B
# 0    black     COLOR_BLACK     0,0,0
# 1    red       COLOR_RED       1,0,0
# 2    green     COLOR_GREEN     0,1,0
# 3    yellow    COLOR_YELLOW    1,1,0
# 4    blue      COLOR_BLUE      0,0,1
# 5    magenta   COLOR_MAGENTA   1,0,1
# 6    cyan      COLOR_CYAN      0,1,1
# 7    white     COLOR_WHITE     1,1,1

declare local red=""
declare local green=""
declare local cyan=""
declare local bold=""
declare local unset=""

if ! [ -x "$(command -v tput)" ]; then
  echo 'tput is not installed.'
else
  echo 'tput is installed.'
  red=$(tput setaf 1)
  green=$(tput setaf 2)
  cyan=$(tput setaf 3)
  bold=$(tput bold)
  unset=$(tput sgr0)
fi

print_error() {
  if [[ -z ${1:+x} ]]; then
    echo "No message is passed to print_error()."
    exit 1
  fi

  local message="$1"

  echo "${red}${bold}${message}${unset}"
}

print_info() {
  if [[ -z ${1:+x} ]]; then
    echo "No message is passed to print_info()."
    exit 1
  fi

  local message="$1"

  echo "${cyan}${bold}${message}${unset}"
}

print_info "Building Node Widgets image..."

# Declare image name
declare local IMAGE_NAME="nodeinc/node-widgets"

# Stash unstaged changes
declare local requires_pop=!$(git diff-index --quiet HEAD --)
if [[ "$requires_pop"=true ]]; then
  git stash
fi

# Pop unstaged changes
function cleanup {
  if [[ "$requires_pop"=true ]]; then
    git stash pop
  fi
  unset requires_pop
}
trap cleanup EXIT

# Get package version
declare local VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Build and tag images
docker build --no-cache --build-arg ENV=${ENV} -t "$IMAGE_NAME:latest" .
docker tag "$IMAGE_NAME:latest" "$IMAGE_NAME:$VERSION"
docker push "$IMAGE_NAME:latest"
docker push "$IMAGE_NAME:$VERSION"

exit 0

# Run application:
# docker run -p 127.0.0.1:8889:8889 nodeinc/node-widgets