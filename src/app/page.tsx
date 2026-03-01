'use client';

import { useEffect, useState } from 'react';
import type { SystemMetrics } from '@/lib/types';

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function Dashboard(): JSX.Element {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async (): Promise<void> => {
      try {
        const response = await fetch('/api/system');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">VPS Command Center</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-[#374151] rounded mb-2"></div>
                <div className="h-8 bg-[#374151] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">VPS Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">CPU Usage</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">
            {metrics?.cpu ?? 'TODO'}%
          </p>
        </div>
        
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">Memory</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">
            {metrics ? `${formatBytes(metrics.memoryUsed)} / ${formatBytes(metrics.memoryTotal)}` : 'TODO'}
          </p>
        </div>
        
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">Disk Usage</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">
            {metrics ? `${formatBytes(metrics.diskUsed)} / ${formatBytes(metrics.diskTotal)}` : 'TODO'}
          </p>
        </div>
        
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">Network RX</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">
            {metrics ? formatBytes(metrics.networkRx) : 'TODO'}
          </p>
        </div>
        
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">Network TX</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">
            {metrics ? formatBytes(metrics.networkTx) : 'TODO'}
          </p>
        </div>
        
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-2">Uptime</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">
            {metrics ? formatUptime(metrics.uptime) : 'TODO'}
          </p>
        </div>
      </div>
    </div>
  );
}