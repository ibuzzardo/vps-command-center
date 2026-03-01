import { NextResponse } from 'next/server';
import * as si from 'systeminformation';
import type { SystemMetrics } from '@/lib/types';

export async function GET(): Promise<NextResponse<SystemMetrics | { error: string }>> {
  try {
    const [cpu, mem, disk, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats()
    ]);

    const uptime = si.time().uptime;
    const primaryDisk = disk[0] || { used: 0, size: 1 };
    const primaryNetwork = network[0] || { rx_bytes: 0, tx_bytes: 0 };

    const metrics: SystemMetrics = {
      cpu: Math.round(cpu.currentLoad || 0),
      memoryUsed: mem.used,
      memoryTotal: mem.total,
      diskUsed: primaryDisk.used,
      diskTotal: primaryDisk.size,
      networkRx: primaryNetwork.rx_bytes,
      networkTx: primaryNetwork.tx_bytes,
      uptime: uptime
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('System metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system metrics' },
      { status: 500 }
    );
  }
}