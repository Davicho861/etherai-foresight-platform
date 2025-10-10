#!/usr/bin/env bash
set -euo pipefail

# Bootstrap script for first-time setup during local development.
# - Ensures named Docker volumes used for node_modules are populated from the
#   image so containers don't need to reinstall on every start.
# - Prepares test-results and permissions.

echo "Bootstrapping development volumes and permissions..."

# Ensure test-results exists and is writable
mkdir -p test-results
chmod -R a+rw test-results || true

# Populate frontend node_modules volume by running the frontend image's install
# if the volume is empty. We use a temporary container to copy node_modules from
# a fresh npm ci into the volume.

populate_volume() {
  local volume_name="$1"
  local workdir="$2"
  local package_json_path="$3"

  # If the volume already has files, skip
  if docker run --rm -v "${volume_name}:/tmp/vol" busybox sh -c 'ls -A /tmp/vol >/dev/null 2>&1' ; then
    echo "Volume ${volume_name} already populated, skipping"
    return
  fi

  echo "Populating volume ${volume_name} from a temporary container..."

  docker run --rm -v "${volume_name}:/app/node_modules" -v "${PWD}:${workdir}:cached" -w "${workdir}" node:20-bullseye-slim sh -c "npm ci --no-audit --no-fund --prefer-offline && cp -a node_modules/. /app/node_modules/"
}

# Populate frontend node_modules volume
populate_volume praevisio_frontend_node_modules /app ./package.json || true

# Populate backend node_modules volume (if server exists)
if [ -d server ]; then
  populate_volume backend_node_modules /app/server ./server/package.json || true
fi

# Provide a friendly summary
cat <<EOF
Bootstrap complete.

Next steps:
  - Run 'npm run dev:live' to start the stack (docker-compose up -d --build).
  - If you prefer to run containers without bootstrap, the first start may
    take extra time while images install dependencies inside volumes.

EOF

exit 0
