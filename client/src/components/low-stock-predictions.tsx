import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LowStockItem {
  name: string;
  currentStock: number;
  minimumStock: number;
  daysUntilEmpty: number;
}

interface LowStockPredictionsProps {
  storeName: string;
  items: LowStockItem[];
}

export function LowStockPredictions({ storeName, items }: LowStockPredictionsProps) {
  return (
    <Card className="p-6" data-testid={`card-predictions-${storeName.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-chart-4" />
        <h3 className="text-lg font-semibold text-foreground">{storeName}</h3>
        <Badge variant="secondary" className="ml-auto">{items.length} items</Badge>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.map((item, index) => {
          const stockPercentage = (item.currentStock / item.minimumStock) * 100;
          return (
            <div
              key={index}
              className={`pb-3 ${index < items.length - 1 ? "border-b border-border" : ""}`}
              data-testid={`item-${index}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.currentStock} / {item.minimumStock} units
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.daysUntilEmpty <= 7
                      ? "bg-destructive/10 text-destructive border-destructive"
                      : "bg-chart-4/10 text-chart-4 border-chart-4"
                  }
                >
                  {item.daysUntilEmpty}d left
                </Badge>
              </div>
              <Progress value={Math.min(stockPercentage, 100)} className="h-1.5" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
