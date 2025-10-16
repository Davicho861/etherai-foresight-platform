#!/usr/bin/env bash
set -euo pipefail

echo "Rollback helper: restore legacy frontend files into a new branch"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Please commit or stash changes before running this script." >&2
  exit 1
fi

PREV_COMMIT=$(git rev-parse HEAD~1)
BRANCH_NAME="restore/frontend-$(date +%Y%m%d%H%M%S)"

echo "Creating new branch $BRANCH_NAME from current HEAD"
git checkout -b "$BRANCH_NAME"

FILES=(
  "index.html"
  "src"
  "vite.config.ts"
  "tailwind.config.ts"
  "postcss.config.js"
  "public"
)

echo "Checking out files from previous commit: $PREV_COMMIT"
for f in "${FILES[@]}"; do
  echo "Restoring: $f"
  git checkout "$PREV_COMMIT" -- "$f" || echo "(not found in previous commit) $f"
done

git add --all
git commit -m "revert: restore legacy frontend files from $PREV_COMMIT"

echo "Rollback branch created: $BRANCH_NAME"
echo "Push it with: git push origin $BRANCH_NAME"
echo "Once reviewed you can merge the branch to restore the frontend files."
