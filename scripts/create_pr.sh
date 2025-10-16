#!/usr/bin/env bash
set -euo pipefail

# scripts/create_pr.sh
# Uso:
#   ./scripts/create_pr.sh "Título del PR" "Cuerpo del PR"
# Si 'gh' está autenticado, lo usará; si no, buscará GITHUB_TOKEN y usará curl.

PR_TITLE="${1:-chore(transplant): implant new frontend (Praevisio-Hephaestus-Facade-Transplant)}"
PR_BODY="${2:-$(cat PR_DESCRIPTION.md || echo "Transplant PR") }"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
REPO_REMOTE_URL=$(git config --get remote.origin.url)

if command -v gh >/dev/null 2>&1; then
  echo "Using gh to create PR..."
  gh pr create --title "$PR_TITLE" --body "$PR_BODY" --head "$BRANCH"
  exit 0
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: neither 'gh' is installed nor GITHUB_TOKEN is set. Aborting." >&2
  exit 1
fi

# Parse owner/repo from remote URL
if [[ "$REPO_REMOTE_URL" =~ ^git@github.com:(.+)/(.+)\.git$ ]]; then
  OWNER=${BASH_REMATCH[1]}
  REPO=${BASH_REMATCH[2]}
elif [[ "$REPO_REMOTE_URL" =~ ^https://github.com/(.+)/(.+)\.git$ ]]; then
  OWNER=${BASH_REMATCH[1]}
  REPO=${BASH_REMATCH[2]}
else
  echo "Could not parse remote.origin.url: $REPO_REMOTE_URL" >&2
  exit 1
fi

API_URL="https://api.github.com/repos/$OWNER/$REPO/pulls"

payload=$(jq -n --arg title "$PR_TITLE" --arg head "$BRANCH" --arg base "main" --arg body "$PR_BODY" '{title:$title,head:$head,base:$base,body:$body}')

curl -sS -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/json" -d "$payload" "$API_URL" | jq '.html_url'
