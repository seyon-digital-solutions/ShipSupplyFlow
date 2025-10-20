import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentColor?: "primary" | "warning" | "success";
}

const accentColorClasses = {
  primary: "border-l-primary",
  warning: "border-l-chart-4",
  success: "border-l-chart-3",
};

export function SummaryCard({ title, value, icon: Icon, accentColor = "primary" }: SummaryCardProps) {
  return (
    <Card className={`p-6 border-l-4 ${accentColorClasses[accentColor]}`} data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="bg-accent rounded-full p-3">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
