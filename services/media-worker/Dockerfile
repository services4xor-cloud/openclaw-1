FROM node:22-bookworm-slim

# FFmpeg for video processing
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3001

USER node

CMD ["node", "src/index.mjs"]
