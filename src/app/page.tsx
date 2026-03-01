'use client'

import { useEffect, useState } from 'react'
import { SystemMetrics } from '@/lib/types'

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  className?: string;
}

function MetricCard({ title, value, subtitle, className = '' }: MetricCardProps): JSX.Element {
  return (
    <div className={`bg-card text-card-foreground border border-muted rounded-lg p-4 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-secondary mb-2">{title}</h3>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  )
}

function formatBytes(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function Dashboard(): JSX.Element {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async (): Promise<void> => {
    try {
      const response = await fetch('/api/system')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setMetrics(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch metrics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading system metrics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">Error: {error}</div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">No metrics available</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">VPS Command Center</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="CPU Usage"
          value={`${metrics.cpu.toFixed(1)}%`}
          className={metrics.cpu > 80 ? 'border-destructive' : ''}
        />
        
        <MetricCard
          title="Memory Usage"
          value={`${metrics.memory.percentage.toFixed(1)}%`}
          subtitle={`${formatBytes(metrics.memory.used)} / ${formatBytes(metrics.memory.total)}`}
          className={metrics.memory.percentage > 80 ? 'border-destructive' : ''}
        />
        
        <MetricCard
          title="Disk Usage"
          value={`${metrics.disk.percentage.toFixed(1)}%`}
          subtitle={`${formatBytes(metrics.disk.used)} / ${formatBytes(metrics.disk.total)}`}
          className={metrics.disk.percentage > 80 ? 'border-destructive' : ''}
        />
        
        <MetricCard
          title="Network RX"
          value={formatBytes(metrics.networkRx)}
          subtitle="Received"
        />
        
        <MetricCard
          title="Network TX"
          value={formatBytes(metrics.networkTx)}
          subtitle="Transmitted"
        />
        
        <MetricCard
          title="Uptime"
          value={formatUptime(metrics.uptime)}
          subtitle="System uptime"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card text-card-foreground border border-muted rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Performance Charts</h3>
          <div className="text-muted-foreground text-center py-8">
            TODO: CPU & Memory usage charts (Sprint 2)
          </div>
        </div>
        
        <div className="bg-card text-card-foreground border border-muted rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Process Management</h3>
          <div className="text-muted-foreground text-center py-8">
            TODO: PM2 process list (Sprint 2)
          </div>
        </div>
      </div>
    </div>
  )
}