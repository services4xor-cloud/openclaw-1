#!/usr/bin/env bash
###############################################################################
# OpenClaw + n8n — Hetzner VPS Bootstrap Script
#
# Run on a fresh Ubuntu 24.04 LTS server:
#   curl -fsSL https://raw.githubusercontent.com/YOU/openclaw/main/setup-vps.sh | bash
#   — or —
#   scp setup-vps.sh root@YOUR_IP:~ && ssh root@YOUR_IP 'bash setup-vps.sh'
#
# What this does:
#   1. System updates + essential packages
#   2. Docker + Docker Compose (latest)
#   3. UFW firewall (22, 80, 443 only)
#   4. Creates 'deploy' user (no-root operation)
#   5. Directory structure for media + data
#   6. Clones repo + prepares .env from template
#
# After running:
#   1. Edit /opt/openclaw/.env.production with your API keys
#   2. Set your domain in /opt/openclaw/Caddyfile
#   3. Run: cd /opt/openclaw && docker compose -f docker-compose.production.yml up -d
###############################################################################
set -euo pipefail

# ── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ── Pre-checks ──────────────────────────────────────────────────────────────
[[ $EUID -eq 0 ]] || error "Run as root: sudo bash setup-vps.sh"
[[ -f /etc/os-release ]] && source /etc/os-release
[[ "${ID:-}" == "ubuntu" ]] || warn "Tested on Ubuntu 24.04 — your mileage may vary on $ID"

DEPLOY_USER="${OPENCLAW_USER:-deploy}"
INSTALL_DIR="${OPENCLAW_DIR:-/opt/openclaw}"
REPO_URL="${OPENCLAW_REPO:-https://github.com/nicosql/openclaw.git}"

info "Starting OpenClaw VPS setup..."

# ── 1. System Update ───────────────────────────────────────────────────────
info "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
  curl wget git unzip jq htop \
  ca-certificates gnupg lsb-release \
  ufw fail2ban

# ── 2. Docker ──────────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  info "Installing Docker..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
  info "Docker already installed: $(docker --version)"
fi

systemctl enable --now docker

# ── 3. Firewall ────────────────────────────────────────────────────────────
# CRITICAL: Allow SSH FIRST before enabling firewall to avoid lockout
info "Configuring UFW firewall..."
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw default deny incoming
ufw default allow outgoing
echo "y" | ufw enable
ufw status verbose
info "Firewall active — SSH (22), HTTP (80), HTTPS (443) allowed"

# ── 4. Fail2ban ────────────────────────────────────────────────────────────
info "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<'JAIL'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
bantime = 3600
JAIL
systemctl enable --now fail2ban

# ── 5. Deploy User ────────────────────────────────────────────────────────
if ! id "$DEPLOY_USER" &>/dev/null; then
  info "Creating deploy user: $DEPLOY_USER"
  useradd -m -s /bin/bash "$DEPLOY_USER"
  usermod -aG docker "$DEPLOY_USER"
else
  info "User $DEPLOY_USER already exists"
  usermod -aG docker "$DEPLOY_USER"
fi

# Copy SSH keys from root to deploy user
if [[ -f /root/.ssh/authorized_keys ]]; then
  mkdir -p "/home/$DEPLOY_USER/.ssh"
  cp /root/.ssh/authorized_keys "/home/$DEPLOY_USER/.ssh/"
  chown -R "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
  chmod 700 "/home/$DEPLOY_USER/.ssh"
  chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
  info "SSH keys copied to $DEPLOY_USER"
fi

# ── 6. Directory Structure ─────────────────────────────────────────────────
info "Creating directory structure..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR/data/media/inbox"       # Raw uploads land here
mkdir -p "$INSTALL_DIR/data/media/processed"    # Watermarked + resized
mkdir -p "$INSTALL_DIR/data/media/watermarks"   # Watermark images
mkdir -p "$INSTALL_DIR/data/media/music"        # Background music
mkdir -p "$INSTALL_DIR/data/media/output"       # Final platform-ready files
mkdir -p "$INSTALL_DIR/data/postgres"           # PostgreSQL data
mkdir -p "$INSTALL_DIR/data/redis"              # Redis data
mkdir -p "$INSTALL_DIR/data/n8n"                # n8n data
mkdir -p "$INSTALL_DIR/data/openclaw"           # OpenClaw config + state
mkdir -p "$INSTALL_DIR/data/caddy"              # TLS certs

chown -R "$DEPLOY_USER:$DEPLOY_USER" "$INSTALL_DIR"

# ── 7. Clone Repo ──────────────────────────────────────────────────────────
if [[ ! -f "$INSTALL_DIR/docker-compose.production.yml" ]]; then
  info "Cloning OpenClaw repository..."
  sudo -u "$DEPLOY_USER" git clone "$REPO_URL" "$INSTALL_DIR/repo" 2>/dev/null || true

  # Copy production files to install dir (or they'll be created next)
  if [[ -d "$INSTALL_DIR/repo" ]]; then
    cp "$INSTALL_DIR/repo/docker-compose.production.yml" "$INSTALL_DIR/" 2>/dev/null || true
    cp "$INSTALL_DIR/repo/Caddyfile" "$INSTALL_DIR/" 2>/dev/null || true
    cp "$INSTALL_DIR/repo/.env.production.example" "$INSTALL_DIR/.env.production" 2>/dev/null || true
  fi
fi

# ── 8. Swap (for 16GB servers, prevents OOM during builds) ─────────────────
if [[ ! -f /swapfile ]]; then
  info "Creating 4GB swap..."
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ── Done ───────────────────────────────────────────────────────────────────
info "=========================================="
info " VPS setup complete!"
info "=========================================="
info ""
info " Next steps:"
info "  1. ssh $DEPLOY_USER@$(hostname -I | awk '{print $1}')"
info "  2. cd $INSTALL_DIR"
info "  3. Edit .env.production with your API keys"
info "  4. Edit Caddyfile — replace yourdomain.com with your domain"
info "  5. docker compose -f docker-compose.production.yml up -d"
info ""
info " Services will be available at:"
info "   Dashboard:  https://yourdomain.com"
info "   n8n:        https://yourdomain.com/n8n/"
info "   OpenClaw:   https://yourdomain.com/api/ (internal)"
info ""
info " Media directories:"
info "   Upload to:  $INSTALL_DIR/data/media/inbox/"
info "   Watermarks: $INSTALL_DIR/data/media/watermarks/"
info "   Music:      $INSTALL_DIR/data/media/music/"
info ""
