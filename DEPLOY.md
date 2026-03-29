# Deploying OpenClaw Social Media Automation

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Hetzner VPS (Docker)                 │
│                                                      │
│  Caddy ──→ Dashboard (EYES)         Port 443/80     │
│        ──→ n8n (NERVOUS SYSTEM)     internal only    │
│        ──→ OpenClaw (BRAIN)         internal only    ���
│        ──→ Media Worker (HANDS)     internal only    │
│                                                      │
│  PostgreSQL ─── n8n database + content stash         │
│  Redis ──────── job queues + caching                 │
└─────────────────────────────────────────────────────┘
```

**Framework responsibilities:**
| Component | Role | Does | Does NOT |
|-----------|------|------|----------|
| **Dashboard** | EYES | Upload media, configure campaigns, approve from stash | Call AI, publish, process video |
| **n8n** | NERVOUS SYSTEM | Orchestrate workflows, call APIs, schedule, publish | Think, create content, make decisions |
| **OpenClaw** | BRAIN | Generate captions/hashtags, analyze metrics, plan sprints | Touch APIs, publish content, process media |
| **Media Worker** | HANDS | FFmpeg watermark, resize, slideshows | Decide what to process, call AI |

---

## Prerequisites

- **Server**: Hetzner CPX41 (4 vCPU, 16GB RAM, Ubuntu 24.04) — ~€15/mo
- **Domain**: Pointed to server IP (A record)
- **SSH key**: Added to Hetzner (see below)
- **API keys**: Anthropic, Meta, TikTok, YouTube, WhatsApp Business

---

## Step-by-Step Deployment

### 1. Set up SSH key (one time)

Check if you have an SSH key on your LOCAL machine:
```bash
ls ~/.ssh/id_ed25519.pub
```

If not, create one:
```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Add the public key to Hetzner:
1. Go to https://cloud.hetzner.com
2. Left sidebar → **SSH Keys** → **Add SSH Key**
3. Paste contents of `~/.ssh/id_ed25519.pub`
4. When creating the server, select this SSH key

### 2. Create server on Hetzner

1. https://cloud.hetzner.com → New Project → Add Server
2. **Location**: Nuremberg or Falkenstein (cheapest EU)
3. **OS**: Ubuntu 24.04
4. **Type**: CPX41 (4 vCPU, 16GB RAM, 240GB NVMe)
5. **SSH Key**: Select the key you added
6. **Create**
7. Note the IP address (e.g., `204.168.182.24`)

### 3. Point your domain

Add an A record in your DNS provider:
```
A    @    204.168.182.24
A    *    204.168.182.24
```
Wait 5-10 minutes for propagation.

### 4. Copy files to server

> **IMPORTANT**: These commands run on your LOCAL machine, not on the server.
> Open a terminal on your laptop/desktop.

```bash
# Navigate to the project
cd /path/to/openclaw

# Copy the bootstrap script
scp setup-vps.sh root@YOUR_SERVER_IP:/root/

# Run the bootstrap script on the server
ssh root@YOUR_SERVER_IP 'bash /root/setup-vps.sh'
```

The bootstrap script installs Docker, configures the firewall, and creates `/opt/openclaw/`.

### 5. Copy project files to server

> Still on your LOCAL machine:

```bash
# Copy production files
scp docker-compose.production.yml root@YOUR_SERVER_IP:/opt/openclaw/
scp Caddyfile root@YOUR_SERVER_IP:/opt/openclaw/
scp .env.production.example root@YOUR_SERVER_IP:/opt/openclaw/.env.production
scp Dockerfile root@YOUR_SERVER_IP:/opt/openclaw/

# Copy services (media worker, dashboard, n8n workflows, postgres init, openclaw config)
scp -r services/ root@YOUR_SERVER_IP:/opt/openclaw/
```

### 6. Configure environment

> Now SSH into the server:

```bash
ssh root@YOUR_SERVER_IP
cd /opt/openclaw
```

Edit `.env.production` with your API keys:
```bash
nano .env.production
```

Required fields to fill in:
```env
DOMAIN=yourdomain.com
POSTGRES_PASSWORD=<generate: openssl rand -hex 32>
OPENCLAW_GATEWAY_TOKEN=<generate: openssl rand -hex 32>
HOOKS_TOKEN=<generate: openssl rand -hex 32>
ANTHROPIC_API_KEY=sk-ant-...
```

Generate random passwords easily:
```bash
echo "POSTGRES_PASSWORD=$(openssl rand -hex 32)"
echo "OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)"
echo "HOOKS_TOKEN=$(openssl rand -hex 32)"
```

### 7. Update Caddyfile

Replace `{$DOMAIN:localhost}` with your actual domain:
```bash
nano Caddyfile
# Change the first line to: yourdomain.com {
```

### 8. Build and launch

```bash
cd /opt/openclaw

# Build OpenClaw image (takes 5-10 minutes first time)
docker build -t openclaw:local .

# Build media worker and dashboard
docker compose -f docker-compose.production.yml build media-worker dashboard

# Start everything
docker compose -f docker-compose.production.yml --env-file .env.production up -d
```

### 9. Verify services are running

```bash
docker compose -f docker-compose.production.yml ps
```

All services should show `Up (healthy)`:
```
caddy             Up
postgres          Up (healthy)
redis             Up (healthy)
openclaw-gateway  Up (healthy)
n8n               Up
media-worker      Up (healthy)
dashboard         Up
```

### 10. Import n8n workflows

1. Open `https://yourdomain.com/n8n/` in your browser
2. Create your n8n admin account
3. Go to **Workflows** → **Import from File**
4. Import each file from `services/n8n-workflows/`:
   - `01-content-pipeline.json` — Upload → Watermark → AI Captions → Stash
   - `02-scheduled-publisher.json` — Stash → Platform APIs
   - `03-weekly-sprint.json` ��� Metrics → AI Sprint Planning
   - `04-dashboard-webhooks.json` — Dashboard data API
   - `05-stash-reminder.json` — WhatsApp/Telegram low-stash alerts
   - `06-auto-scheduler.json` — Approved → auto-assign publish times
5. Configure n8n credentials (Postgres connection, platform API tokens)
6. **Activate** all workflows

### 11. Open the dashboard

Go to `https://yourdomain.com` on your phone. You should see the Upload Center.

---

## Content Stash Flow

```
You upload media + describe theme
        ↓
AI generates 5 platform variants (one per platform)
        ↓
Posts land in STASH (waiting for approval)
        ↓
You approve ONE group → ALL 5 platforms get scheduled
        ↓
System drip-feeds posts at configured intervals
        ↓
When stash runs low → WhatsApp/Telegram reminder
        ↓
You upload more → cycle continues autonomously
```

**One approval = all platforms.** You never schedule manually.

---

## Useful Commands

```bash
# SSH into server
ssh deploy@YOUR_SERVER_IP

# Check all services
cd /opt/openclaw
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f          # all
docker compose -f docker-compose.production.yml logs -f n8n      # just n8n
docker compose -f docker-compose.production.yml logs -f openclaw-gateway  # just AI

# Restart a service
docker compose -f docker-compose.production.yml restart n8n

# Restart everything
docker compose -f docker-compose.production.yml restart

# Stop everything
docker compose -f docker-compose.production.yml down

# Update and rebuild
git pull
docker build -t openclaw:local .
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d

# Check disk usage
df -h
docker system df

# Clean old Docker images
docker system prune -a --volumes
```

---

## Troubleshooting

### Can't SSH in
- Reset root password: Hetzner Console → server → Rescue → Reset Root Password
- Or rebuild server with your SSH key attached

### Caddy not getting TLS certificate
- Check domain DNS: `dig yourdomain.com` should show your server IP
- Check Caddy logs: `docker logs caddy`
- Make sure ports 80 and 443 are open: `ufw status`

### n8n workflows failing
- Check n8n logs: `docker logs n8n`
- Verify Postgres connection in n8n credentials
- Verify `OPENCLAW_URL` and `HOOKS_TOKEN` match between n8n and OpenClaw

### Media worker not processing
- Check logs: `docker logs media-worker`
- Verify FFmpeg: `docker exec media-worker ffmpeg -version`
- Check disk space: large videos need room in `/data/media/`

### OpenClaw not responding
- Check health: `curl http://localhost:18789/healthz` (from server)
- Check logs: `docker logs openclaw-gateway`
- Verify `ANTHROPIC_API_KEY` is set correctly
