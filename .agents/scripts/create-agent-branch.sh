#!/usr/bin/env bash

set -e

ROLE="$1"
TASK_SLUG="$2"

if [ -z "$ROLE" ] || [ -z "$TASK_SLUG" ]; then
  echo "Usage: ./create-agent-branch.sh <role> <task-slug>"
  echo "Example: ./create-agent-branch.sh frontend auth-modal"
  exit 1
fi

# Clean slug
CLEAN_SLUG=$(echo "$TASK_SLUG" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')
BRANCH_NAME="${ROLE}/${CLEAN_SLUG}"

echo "🚀 Creating clean git branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"
echo "✅ Successfully switched to branch '$BRANCH_NAME'"
