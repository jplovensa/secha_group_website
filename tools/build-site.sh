#!/usr/bin/env bash
# Combined static build for Vercel and other hosts with Node, Git and Python 3.
set -euo pipefail
repo_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_root"
studio_checkout=$(mktemp -d "${TMPDIR:-/tmp}/secha-studio-build.XXXXXX")
trap 'rm -rf -- "$studio_checkout"' EXIT
git clone --depth 1 --single-branch --branch main \
  https://github.com/jplovensa/sechastudio-.git "$studio_checkout"
npm test
(
  cd "$studio_checkout"
  npm ci
  npm run build
  npm test
)
python3 tools/prepare-site.py --studio-source "$studio_checkout"
