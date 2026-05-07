import { UtensilsCrossed } from 'lucide-react';

interface LunchTagProps {
  className?: string;
}

export default function LunchTag({ className = '' }: LunchTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${className}`}
    >
      <UtensilsCrossed className="size-3" />
      Lunch
    </span>
  );
}
