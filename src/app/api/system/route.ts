import { NextResponse } from 'next/server'
import * as si from 'systeminformation'
import { SystemMetrics } from '@/lib/types'

export async function GET(): Promise<NextResponse<SystemMetrics | { error: string }>> {
  try {
    const [cpu, mem, disk, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats()
    ])

    const uptime = si.time().uptime

    const metrics: SystemMetrics = {
      cpu: cpu.currentLoad,
      memory: {
        used: mem.used,
        total: mem.total
      },
      disk: disk.length > 0 ? disk[0].use : 0,
      network: {
        rx: network.length > 0 ? network[0].rx_bytes : 0,
        tx: network.length > 0 ? network[0].tx_bytes : 0
      },
      uptime: uptime
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching system metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system metrics' },
      { status: 500 }
    )
  }
}