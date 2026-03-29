# n8n Workflow Templates

Import these into n8n at `https://yourdomain.com/n8n/`

## Workflow Map (who does what)

| Workflow | n8n Role (Nervous System) | OpenClaw Role (Brain) |
|----------|--------------------------|----------------------|
| Content Pipeline | Watch files, call media-worker, store queue | Generate captions + hashtags |
| Scheduled Publisher | Pull queue, call platform APIs, log results | Not involved |
| Weekly Sprint | Collect metrics, store tasks, send report | Analyze performance, plan sprint |
| Daily Standup | Pull results, send summary | Generate daily insight |
| Dashboard Webhooks | Receive dashboard actions, return data | Not involved |

## Import Instructions

1. Open n8n at `https://yourdomain.com/n8n/`
2. Go to Workflows → Import from File
3. Import each `.json` file from this directory
4. Configure credentials (Meta, TikTok, YouTube, WhatsApp tokens)
5. Activate workflows
