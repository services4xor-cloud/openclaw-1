#!/usr/bin/env python3
import json, uuid, sys

with open('C:/GIT/openclaw/tmp_wf01_final.json', encoding='utf-8', errors='replace') as f:
    nodes = json.loads(f.read().strip())

webhook_node = [n for n in nodes if n['name'] == 'Dashboard Upload Webhook'][0]
respond_node = [n for n in nodes if 'Respond' in n['name']][0]

JS_CODE = r'''
const input = $input.first().json;
const theme = input.theme || input.body?.theme || 'General';
const brandVoice = input.brandVoice || input.body?.brandVoice || 'Professional';
const files = input.files || input.body?.files || [];

let mediaResult = null;
if (files.length > 0 && files[0].path) {
  try {
    const res = await fetch('http://media-worker:3001/api/batch', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        inputPath: files[0].path,
        platforms: ['instagram','tiktok','youtube','facebook','whatsapp']
      })
    });
    mediaResult = await res.json();
  } catch(e) {
    mediaResult = {error: e.message};
  }
}

let captions = {};
try {
  const res = await fetch('http://openclaw-gateway:18789/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 7f3682e598e9e93aecba744e5f97ae77b88e754d2922a29ce95a4421e732438a'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      messages: [{
        role: 'user',
        content: 'Generate social media captions for content with theme: "' + theme + '", brand voice: "' + brandVoice + '". Return ONLY valid JSON (no markdown): {"instagram": {"caption": "...", "hashtags": ["#tag1"], "alt_text": "..."}, "tiktok": {"caption": "...", "hashtags": ["#tag1"], "alt_text": "..."}, "youtube": {"caption": "...", "hashtags": ["#tag1"], "alt_text": "..."}, "facebook": {"caption": "...", "hashtags": ["#tag1"], "alt_text": "..."}, "whatsapp": {"caption": "...", "hashtags": [], "alt_text": "..."}}'
      }]
    })
  });
  const aiResult = await res.json();
  const content = aiResult.choices?.[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    captions = JSON.parse(jsonMatch[0]);
  }
} catch(e) {
  for (const p of ['instagram','tiktok','youtube','facebook','whatsapp']) {
    captions[p] = {
      caption: theme + ' - Check this out!',
      hashtags: ['#content', '#viral'],
      alt_text: theme
    };
  }
}

const rows = [];
for (const [platform, data] of Object.entries(captions)) {
  rows.push({
    platform,
    caption: data.caption || '',
    hashtags: data.hashtags || [],
    alt_text: data.alt_text || '',
    status: 'stash',
  });
}

return rows.map(r => ({json: r}));
'''

code_node = {
    "id": str(uuid.uuid4()),
    "name": "Process Pipeline",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [400, 0],
    "parameters": {
        "jsCode": JS_CODE
    }
}

insert_node = {
    "id": str(uuid.uuid4()),
    "name": "Save to Stash",
    "type": "n8n-nodes-base.postgres",
    "typeVersion": 2.5,
    "position": [700, 0],
    "credentials": {"postgres": {"id": "lrTGfwBMOunApr6c", "name": "Postgres account"}},
    "parameters": {
        "operation": "insert",
        "schema": {"__rl": True, "mode": "list", "value": "public"},
        "table": {"__rl": True, "mode": "list", "value": "content_queue"},
        "columns": {"mappingMode": "autoMapInputData", "value": {}},
        "options": {}
    }
}

respond_node['position'] = [1000, 0]
respond_node['parameters'] = {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ok: true, count: $items().length}) }}"
}

new_nodes = [webhook_node, code_node, insert_node, respond_node]
connections = {
    "Dashboard Upload Webhook": {"main": [[{"node": "Process Pipeline", "type": "main", "index": 0}]]},
    "Process Pipeline": {"main": [[{"node": "Save to Stash", "type": "main", "index": 0}]]},
    "Save to Stash": {"main": [[{"node": respond_node['name'], "type": "main", "index": 0}]]}
}

nodes_str = json.dumps(new_nodes).replace("'", "''")
conn_str = json.dumps(connections).replace("'", "''")
sql = f"UPDATE workflow_entity SET nodes = '{nodes_str}'::json, connections = '{conn_str}'::json WHERE id = 'wf01';"

with open('C:/GIT/openclaw/tmp_fix_pipeline.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

sys.stderr.write("Pipeline rebuilt: 4 nodes\n")
