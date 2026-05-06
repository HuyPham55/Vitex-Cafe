'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface CutoffCountdownProps {
  cutoffTime?: string;
  cutoffDate?: string;
  onExpire?: () => void;
  className?: string;
}

function computeRemainingMs(cutoffTime?: string, cutoffDate?: string) {
  if (!cutoffTime) return 0;
  const [h, m] = cutoffTime.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;

  const target = new Date();
  if (cutoffDate) {
    const [yy, mm, dd] = cutoffDate.split('-').map(Number);
    if (!Number.isNaN(yy)) target.setFullYear(yy, mm - 1, dd);
  }
  target.setHours(h, m, 0, 0);
  return target.getTime() - Date.now();
}

function formatRemaining(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return [h, mm, ss].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function CutoffCountdown({
  cutoffTime,
  cutoffDate,
  onExpire,
  className = '',
}: CutoffCountdownProps) {
  const [remaining, setRemaining] = useState(() => computeRemainingMs(cutoffTime, cutoffDate));

  useEffect(() => {
    setRemaining(computeRemainingMs(cutoffTime, cutoffDate));
    const id = setInterval(() => {
      const next = computeRemainingMs(cutoffTime, cutoffDate);
      setRemaining(next);
      if (next <= 0 && onExpire) onExpire();
    }, 1000);
    return () => clearInterval(id);
  }, [cutoffTime, cutoffDate, onExpire]);

  const expired = remaining <= 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
        expired
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          : 'bg-primary/10 text-primary'
      } ${className}`}
    >
      <Timer className="size-4" />
      <span className="text-xs uppercase tracking-wider opacity-80">
        {expired ? 'Cutoff passed' : 'Order cutoff in'}
      </span>
      <span className="font-black tabular-nums text-base">{formatRemaining(remaining)}</span>
    </div>
  );
}
