import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

interface StoreTypeCardProps {
  name: string;
  count: number;
  stockLevel: number;
  onViewDetails?: () => void;
}

export function StoreTypeCard({ name, count, stockLevel, onViewDetails }: StoreTypeCardProps) {
  return (
    <Card className="p-6" data-testid={`card-store-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          {count}
        </Badge>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stock Level</span>
          <span className="font-medium text-foreground">{stockLevel}%</span>
        </div>
        <Progress value={stockLevel} className="h-2" />
      </div>
      <button
        onClick={() => {
          console.log(`View details for ${name}`);
          onViewDetails?.();
        }}
        className="text-sm text-primary hover-elevate active-elevate-2 flex items-center gap-1 w-full justify-center py-2 rounded-md"
        data-testid={`button-view-${name.toLowerCase().replace(/\s+/g, '-')}`}
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
