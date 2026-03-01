import { NextResponse } from 'next/server'
import * as si from 'systeminformation'
import { SystemMetrics, ApiResponse } from '@/lib/types'

export async function GET(): Promise<NextResponse<ApiResponse<SystemMetrics>>> {
  try {
    const [cpu, mem, fsSize, networkStats, uptime] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.uptime()
    ])

    const primaryDisk = fsSize.find(disk => disk.mount === '/') || fsSize[0]
    const primaryNetwork = networkStats[0] || { rx_bytes: 0, tx_bytes: 0 }

    const metrics: SystemMetrics = {
      cpu: cpu.currentLoad || 0,
      memory: {
        used: mem.used,
        total: mem.total,
        percentage: (mem.used / mem.total) * 100
      },
      disk: {
        used: primaryDisk?.used || 0,
        total: primaryDisk?.size || 0,
        percentage: primaryDisk ? (primaryDisk.used / primaryDisk.size) * 100 : 0
      },
      networkRx: primaryNetwork.rx_bytes,
      networkTx: primaryNetwork.tx_bytes,
      uptime: uptime
    }

    return NextResponse.json({
      success: true,
      data: metrics
    }, { status: 200 })
  } catch (error) {
    console.error('System metrics error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch system metrics'
    }, { status: 500 })
  }
}