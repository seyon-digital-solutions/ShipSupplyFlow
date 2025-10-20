import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import type { Item } from "@shared/schema";

export default function LowStock() {
  const { data: lowStockItems = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items/low-stock"],
  });

  const handleExportCSV = () => {
    console.log("Exporting low stock report as CSV");
    const csvContent = [
      ["Item Name", "Category", "Current Stock", "Minimum Stock", "Deficit", "Unit", "Last Updated"],
      ...lowStockItems.map((item) => [
        item.name,
        item.category,
        item.currentStock,
        item.minimumStock,
        item.minimumStock - item.currentStock,
        item.unit,
        format(new Date(item.lastUpdated), "yyyy-MM-dd"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `low-stock-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading low stock report...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-8 h-8 text-chart-4" />
            <h1 className="text-3xl font-semibold text-foreground">Low Stock Alert</h1>
          </div>
          <p className="text-muted-foreground">
            {lowStockItems.length} items below minimum stock level
          </p>
        </div>
        <Button onClick={handleExportCSV} disabled={lowStockItems.length === 0} data-testid="button-export-csv">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {lowStockItems.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">All items are adequately stocked. Great job!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <Card
              key={item.id}
              className="p-6 border-l-4 border-l-chart-4"
              data-testid={`card-low-stock-${item.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      <p className="font-semibold text-foreground">
                        {item.currentStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Minimum Required</p>
                      <p className="font-semibold text-foreground">
                        {item.minimumStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deficit</p>
                      <p className="font-semibold text-chart-4">
                        {item.minimumStock - item.currentStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-foreground">
                        {format(new Date(item.lastUpdated), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => console.log(`Reorder ${item.name}`)}
                  data-testid={`button-reorder-${item.id}`}
                >
                  Reorder
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
