export interface SystemMetrics {
  cpu: number;
  memory: {
    used: number;
    total: number;
  };
  disk: number;
  network: {
    rx: number;
    tx: number;
  };
  uptime: number;
}