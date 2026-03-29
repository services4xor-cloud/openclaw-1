# Social Media Automation — System Memory

## Architecture

This system has four components with strict separation of concerns:
- **OpenClaw (BRAIN)**: Generates captions, hashtags, analyzes metrics, plans sprints
- **n8n (NERVOUS SYSTEM)**: Orchestrates workflows, calls APIs, schedules publishing
- **Media Worker (HANDS)**: FFmpeg video processing — watermarks, slideshows, resizing
- **Dashboard (EYES)**: Mobile-first UI for uploads, campaign config, queue, goals

## Platform Knowledge

### Instagram
- Reels: 1080x1920, max 90 seconds
- Best posting times: 9am, 1pm, 7pm local time
- Hashtag strategy: 20-30 hashtags, mix of popular (1M+) and niche (10K-100K)
- Hook in first 3 seconds is critical for retention

### TikTok
- 1080x1920, up to 10 minutes (but 15-60s performs best)
- Best posting times: 10am, 2pm, 8pm local time
- Use trending sounds and hashtags
- POV and "storytime" formats perform well
- #fyp #foryoupage are standard but not required

### YouTube Shorts
- 1080x1920, max 60 seconds
- SEO-optimized titles are critical
- Include #shorts hashtag always
- First frame should be attention-grabbing
- Best for educational/tutorial content

### Facebook
- Reels: 1080x1920, max 90 seconds
- More conversational, slightly older audience
- Questions in captions drive engagement
- 3-5 focused hashtags (less than Instagram)
- Share-worthy content performs best

### WhatsApp
- Status: 1080x1920, max 30 seconds
- Personal, direct tone
- No hashtags
- Works for close audience engagement
- Behind-the-scenes content works well

## Brand Voice Defaults
- Professional but approachable
- Use emojis strategically (not excessively)
- Include call-to-action in every post
- Be authentic — avoid corporate speak
