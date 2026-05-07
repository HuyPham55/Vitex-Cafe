interface QueueBadgeProps {
  queueNumber?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export default function QueueBadge({ queueNumber, size = 'md', className = '' }: QueueBadgeProps) {
  if (queueNumber === undefined || queueNumber === null) return null;
  return (
    <span
      className={`inline-flex items-center bg-primary/10 text-primary font-bold rounded ${sizeClasses[size]} ${className}`}
    >
      Queue #{queueNumber}
    </span>
  );
}
