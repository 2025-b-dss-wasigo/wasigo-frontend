import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  iconClassName?: string;
}
export const StatCard = ({ title, value, icon: Icon, trend, className, iconClassName }: StatCardProps) => {
  return (
    <div className={cn(
      "card-elevated p-5 animate-slide-up",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-(--muted-foreground)">{title}</p>
          <p className="mt-2 text-3xl font-bold text-(--foreground)">{value}</p>
          {trend && (
            <p className={cn(
              "mt-1 text-sm font-medium",
              trend.positive ? "text-(--success)" : "text-(--destructive)"
            )}>
              {trend.positive ? '+' : ''}{trend.value}% vs mes anterior
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconClassName || "bg-(--primary)/10"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            iconClassName ? "text-current" : "text-(--primary)"
          )} />
        </div>
      </div>
    </div>
  );
}
