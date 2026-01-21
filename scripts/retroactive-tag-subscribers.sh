#!/bin/bash
#
# Retroactive Subscriber Tagging Script
#
# Tags subscribers who signed up after the initial import with:
# - source: "gui.do"
# - signup_page: "unknown" (we don't know which page they used)
# - signup_date: their created_at date
#
# Requirements:
# - LISTMONK_API_USER and LISTMONK_API_KEY environment variables
# - jq for JSON parsing
# - curl
#
# Usage:
#   ./retroactive-tag-subscribers.sh [import_date]
#
# Example:
#   ./retroactive-tag-subscribers.sh "2024-12-01"
#
# The script will:
# 1. Fetch all subscribers created after the import date
# 2. Filter those without a "source" attribute (not yet tagged)
# 3. Update each with the gui.do source attributes
# 4. Run in dry-run mode by default (add --apply to actually update)

set -euo pipefail

# Configuration
LISTMONK_URL="${LISTMONK_URL:-https://n.a11y.nl}"
LISTMONK_API_USER="${LISTMONK_API_USER:-}"
LISTMONK_API_KEY="${LISTMONK_API_KEY:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
IMPORT_DATE="${1:-}"
DRY_RUN=true

for arg in "$@"; do
  case $arg in
    --apply)
      DRY_RUN=false
      shift
      ;;
  esac
done

# Validate requirements
if [[ -z "$LISTMONK_API_USER" || -z "$LISTMONK_API_KEY" ]]; then
  echo -e "${RED}Error: LISTMONK_API_USER and LISTMONK_API_KEY must be set${NC}"
  echo "Export them or add to your environment:"
  echo "  export LISTMONK_API_USER='your-username'"
  echo "  export LISTMONK_API_KEY='your-api-key'"
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo -e "${RED}Error: jq is required but not installed${NC}"
  echo "Install with: brew install jq (macOS) or apt install jq (Linux)"
  exit 1
fi

if [[ -z "$IMPORT_DATE" ]]; then
  echo -e "${YELLOW}Usage: $0 <import_date> [--apply]${NC}"
  echo ""
  echo "Arguments:"
  echo "  import_date   Date of the initial import (YYYY-MM-DD format)"
  echo "  --apply       Actually apply changes (default is dry-run)"
  echo ""
  echo "Example:"
  echo "  $0 2024-12-01           # Dry run - show what would be updated"
  echo "  $0 2024-12-01 --apply   # Actually update subscribers"
  exit 1
fi

# Build auth header
AUTH_HEADER=$(echo -n "${LISTMONK_API_USER}:${LISTMONK_API_KEY}" | base64)

echo -e "${GREEN}Listmonk Retroactive Tagging Script${NC}"
echo "======================================"
echo "Import date: $IMPORT_DATE"
echo "Dry run: $DRY_RUN"
echo ""

# Fetch all subscribers (paginated)
echo "Fetching subscribers created after $IMPORT_DATE..."

page=1
per_page=100
total_found=0
total_updated=0
subscribers_to_update=()

while true; do
  response=$(curl -s -X GET \
    "${LISTMONK_URL}/api/subscribers?page=${page}&per_page=${per_page}" \
    -H "Authorization: Basic ${AUTH_HEADER}" \
    -H "Content-Type: application/json")

  # Check for error
  if echo "$response" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${RED}API Error: $(echo "$response" | jq -r '.message')${NC}"
    exit 1
  fi

  # Get subscribers from this page
  count=$(echo "$response" | jq '.data.results | length')

  if [[ "$count" == "0" || "$count" == "null" ]]; then
    break
  fi

  # Process each subscriber
  while IFS= read -r subscriber; do
    id=$(echo "$subscriber" | jq -r '.id')
    email=$(echo "$subscriber" | jq -r '.email')
    created_at=$(echo "$subscriber" | jq -r '.created_at')
    attribs=$(echo "$subscriber" | jq -r '.attribs // {}')

    # Extract date part from created_at (format: 2024-12-15T10:30:00Z)
    created_date=$(echo "$created_at" | cut -d'T' -f1)

    # Check if created after import date
    if [[ "$created_date" > "$IMPORT_DATE" || "$created_date" == "$IMPORT_DATE" ]]; then
      # Check if already has source attribute
      has_source=$(echo "$attribs" | jq -r '.source // empty')

      if [[ -z "$has_source" ]]; then
        total_found=$((total_found + 1))
        echo -e "  Found: ${YELLOW}$email${NC} (created: $created_date, id: $id)"
        subscribers_to_update+=("$id|$email|$created_date")
      fi
    fi
  done < <(echo "$response" | jq -c '.data.results[]')

  # Check if there are more pages
  total=$(echo "$response" | jq -r '.data.total')
  if [[ $((page * per_page)) -ge $total ]]; then
    break
  fi

  page=$((page + 1))
done

echo ""
echo "Found $total_found subscribers to update"
echo ""

if [[ $total_found -eq 0 ]]; then
  echo -e "${GREEN}No subscribers need updating!${NC}"
  exit 0
fi

if [[ "$DRY_RUN" == "true" ]]; then
  echo -e "${YELLOW}DRY RUN - No changes made${NC}"
  echo "Run with --apply to actually update these subscribers"
  exit 0
fi

# Apply updates
echo "Updating subscribers..."

for entry in "${subscribers_to_update[@]}"; do
  IFS='|' read -r id email created_date <<< "$entry"

  # First, fetch the current subscriber data
  current=$(curl -s -X GET \
    "${LISTMONK_URL}/api/subscribers/${id}" \
    -H "Authorization: Basic ${AUTH_HEADER}" \
    -H "Content-Type: application/json")

  if ! echo "$current" | jq -e '.data.id' > /dev/null 2>&1; then
    echo -e "  ${RED}Failed to fetch:${NC} $email"
    continue
  fi

  # Merge new attributes with existing ones
  current_attribs=$(echo "$current" | jq '.data.attribs // {}')
  new_attribs=$(echo "$current_attribs" | jq \
    --arg source "gui.do" \
    --arg signup_page "unknown" \
    --arg signup_date "$created_date" \
    '. + {source: $source, signup_page: $signup_page, signup_date: $signup_date}')

  # Build the update payload with required fields from current data
  payload=$(echo "$current" | jq --argjson attribs "$new_attribs" \
    '{
      email: .data.email,
      name: .data.name,
      status: .data.status,
      lists: [.data.lists[].id],
      attribs: $attribs
    }')

  # Update the subscriber
  result=$(curl -s -X PUT \
    "${LISTMONK_URL}/api/subscribers/${id}" \
    -H "Authorization: Basic ${AUTH_HEADER}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if echo "$result" | jq -e '.data.id' > /dev/null 2>&1; then
    echo -e "  ${GREEN}Updated:${NC} $email"
    total_updated=$((total_updated + 1))
  else
    error=$(echo "$result" | jq -r '.message // "Unknown error"')
    echo -e "  ${RED}Failed:${NC} $email - $error"
  fi

  # Small delay to avoid rate limiting
  sleep 0.2
done

echo ""
echo -e "${GREEN}Done!${NC} Updated $total_updated of $total_found subscribers"
