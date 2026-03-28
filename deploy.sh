#!/bin/bash
set -e

DEPLOY_DIR="/opt/sinjapanaisite"
REPO="https://github.com/SINJAPANLLC/SINJAPANAISITE.git"
API_PORT=4000

echo "=== sinjapanaisite deploy ==="

# 1. Clone or pull
if [ -d "$DEPLOY_DIR/.git" ]; then
  echo "[1/6] Pulling latest..."
  cd "$DEPLOY_DIR"
  git pull origin main
else
  echo "[1/6] Cloning..."
  git clone "$REPO" "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi
cd "$DEPLOY_DIR"

# 2. Node version check (need v20+)
echo "[2/6] Node: $(node -v)  pnpm: $(pnpm -v 2>/dev/null || echo 'not found')"

# 3. Install pnpm if needed
if ! command -v pnpm &>/dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi

# 4. Install dependencies
echo "[3/6] Installing dependencies..."
pnpm install --frozen-lockfile

# 5. Build DB lib
echo "[4/6] Building @workspace/db..."
cd lib/db && pnpm run build 2>/dev/null || true
cd "$DEPLOY_DIR"

# 6. Build API server
echo "[5/6] Building API server..."
cd artifacts/api-server
pnpm run build
cd "$DEPLOY_DIR"

# 7. Build frontend (static SPA)
echo "[6/6] Building frontend..."
# Load .env for VITE_ variables
if [ -f "$DEPLOY_DIR/.env" ]; then
  set -a; source "$DEPLOY_DIR/.env"; set +a
fi
cd artifacts/company-website
PORT=$API_PORT BASE_PATH=/ NODE_ENV=production \
  pnpm exec vite build --config vite.config.ts
cd "$DEPLOY_DIR"

echo ""
echo "=== Build complete ==="
echo "Static files: $DEPLOY_DIR/artifacts/company-website/dist/public"
echo "API binary:   $DEPLOY_DIR/artifacts/api-server/dist/index.mjs"
echo ""
echo "--- 次のステップ ---"
echo "1) .env ファイルが存在するか確認: ls -la $DEPLOY_DIR/.env"
echo "2) PM2起動: pm2 start $DEPLOY_DIR/ecosystem.config.cjs"
echo "3) PM2保存: pm2 save"
echo "4) Nginx設定を更新してリロード"
