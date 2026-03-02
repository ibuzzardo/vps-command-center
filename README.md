# VPS Command Center

> Built with [Dark Factory v4](https://github.com/ibuzzardo/dark-factory-v4) — autonomous AI software development pipeline

Self-hosted VPS monitoring dashboard with real-time system metrics, PM2 process management, and deployed project tracking.

## Features

- **System Metrics** — CPU, memory, disk usage, and uptime at a glance
- **PM2 Process Manager** — View, restart, and monitor all running services
- **Deployed Projects** — Track all apps running on the VPS with port assignments
- **Web Terminal** — Browser-based terminal access for quick commands

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS
- Server-side system metrics via `os` and `child_process`
- PM2 API integration

## Getting Started

```bash
git clone https://github.com/ibuzzardo/vps-command-center.git
cd vps-command-center
cp .env.example .env.local
npm install
npm run dev
```

## Deployment

Running on VPS at port 4002 via PM2.

## Pipeline Stats

- **Sprint cost:** $0.31
- **Pipeline build:** Sprint 1 (first successful build)

## License

MIT — see [LICENSE](LICENSE)
