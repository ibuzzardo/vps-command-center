'use client'

import { useEffect, useState } from 'react'
import { SystemMetrics } from '@/lib/types'

export default function Dashboard(): JSX.Element {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async (): Promise<void> => {
    try {
      const response = await fetch('/api/system')
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      const data = await response.json()
      setMetrics(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(2)} GB`
  }

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-secondary">Loading system metrics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">VPS Command Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CPU Usage */}
        <div className="bg-card border border-muted rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">CPU Usage</h2>
          <div className="text-2xl font-bold text-primary">
            {metrics?.cpu.toFixed(1)}%
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-card border border-muted rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Memory</h2>
          <div className="text-2xl font-bold text-primary">
            {metrics ? formatBytes(metrics.memory.used) : '0 GB'}
          </div>
          <div className="text-sm text-secondary">
            of {metrics ? formatBytes(metrics.memory.total) : '0 GB'}
          </div>
        </div>

        {/* Disk Usage */}
        <div className="bg-card border border-muted rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Disk Usage</h2>
          <div className="text-2xl font-bold text-primary">
            {metrics?.disk.toFixed(1)}%
          </div>
        </div>

        {/* Network RX */}
        <div className="bg-card border border-muted rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Network RX</h2>
          <div className="text-2xl font-bold text-primary">
            {metrics ? formatBytes(metrics.network.rx) : '0 GB'}
          </div>
        </div>

        {/* Network TX */}
        <div className="bg-card border border-muted rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Network TX</h2>
          <div className="text-2xl font-bold text-primary">
            {metrics ? formatBytes(metrics.network.tx) : '0 GB'}
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-card border border-muted rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Uptime</h2>
          <div className="text-2xl font-bold text-primary">
            {metrics ? formatUptime(metrics.uptime) : '0d 0h 0m'}
          </div>
        </div>
      </div>

      {/* TODO: Sprint 2 - Add PM2 process management */}
      {/* TODO: Sprint 2 - Add deployed projects section */}
      {/* TODO: Sprint 2 - Add web terminal */}
    </div>
  )
}