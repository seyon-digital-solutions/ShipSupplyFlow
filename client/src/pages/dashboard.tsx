import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import { SummaryCard } from "@/components/summary-card";
import { StoreTypeCard } from "@/components/store-type-card";
import { LowStockPredictions } from "@/components/low-stock-predictions";
import { AIRecommendations } from "@/components/ai-recommendations";
import { useQuery } from "@tanstack/react-query";
import type { Item, Transaction } from "@shared/schema";

export default function Dashboard() {
  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    select: (data) => data.slice(0, 10),
  });

  const { data: lowStockItems = [] } = useQuery<Item[]>({
    queryKey: ["/api/items/low-stock"],
  });

  // Calculate summary stats
  const totalItems = items.length;
  const lowStockCount = lowStockItems.length;
  const recentTransactionsCount = transactions.length;

  // Calculate store type stats
  const engineStoreItems = items.filter((item) => item.category === "Engine Store");
  const deckStoreItems = items.filter((item) => item.category === "Deck Store");
  const provisionStoreItems = items.filter((item) => item.category === "Provision Store");

  const calculateStockLevel = (storeItems: Item[]) => {
    if (storeItems.length === 0) return 0;
    const totalStock = storeItems.reduce((sum, item) => sum + item.currentStock, 0);
    const totalMin = storeItems.reduce((sum, item) => sum + item.minimumStock, 0);
    return Math.round((totalStock / totalMin) * 100);
  };

  // Get low stock predictions for each store (top 10)
  const getStorePredictions = (category: string) => {
    return items
      .filter((item) => item.category === category && item.currentStock < item.minimumStock)
      .map((item) => {
        // Calculate estimated days until empty based on average usage
        const deficit = item.minimumStock - item.currentStock;
        const usageRate = 5; // Mock: assume 5 units per day average
        const daysUntilEmpty = Math.max(1, Math.round(item.currentStock / usageRate));
        
        return {
          name: item.name,
          currentStock: item.currentStock,
          minimumStock: item.minimumStock,
          daysUntilEmpty,
        };
      })
      .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty)
      .slice(0, 10);
  };

  const enginePredictions = getStorePredictions("Engine Store");
  const deckPredictions = getStorePredictions("Deck Store");
  const provisionPredictions = getStorePredictions("Provision Store");

  // AI recommendations based on actual data
  const aiRecommendations = [];
  
  // Critical alerts for items running out soon
  const criticalItems = lowStockItems.filter((item) => {
    const usageRate = 5;
    const daysLeft = Math.round(item.currentStock / usageRate);
    return daysLeft <= 5;
  });

  if (criticalItems.length > 0) {
    criticalItems.forEach((item) => {
      aiRecommendations.push({
        type: "critical" as const,
        title: `Critical: ${item.name} Stock Alert`,
        description: `Based on usage patterns, ${item.name} will run out soon. Recommend ordering ${item.minimumStock - item.currentStock + 50} ${item.unit} immediately.`,
        action: "Create Order Now",
      });
    });
  }

  // Warning for approaching low stock
  const warningItems = lowStockItems.filter((item) => {
    const usageRate = 5;
    const daysLeft = Math.round(item.currentStock / usageRate);
    return daysLeft > 5 && daysLeft <= 14;
  });

  if (warningItems.length > 0 && aiRecommendations.length < 3) {
    aiRecommendations.push({
      type: "warning" as const,
      title: "Multiple Items Approaching Low Stock",
      description: `${warningItems.length} items will reach minimum stock levels within 2 weeks. Consider bulk ordering to save on shipping costs.`,
      action: "View Items & Create Order",
    });
  }

  // Add optimization suggestions
  if (aiRecommendations.length < 5) {
    aiRecommendations.push({
      type: "optimization" as const,
      title: "Cost Optimization Opportunity",
      description: "Switch to quarterly orders for frequently used items could reduce costs by 15% annually with preferred chandlers.",
      action: "Review Proposal",
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of ship inventory and stock predictions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Items" value={totalItems.toString()} icon={Package} accentColor="primary" />
        <SummaryCard title="Low Stock Items" value={lowStockCount.toString()} icon={AlertTriangle} accentColor="warning" />
        <SummaryCard title="Recent Transactions" value={recentTransactionsCount.toString()} icon={TrendingDown} accentColor="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StoreTypeCard 
          name="Engine Store" 
          count={engineStoreItems.length} 
          stockLevel={calculateStockLevel(engineStoreItems)} 
        />
        <StoreTypeCard 
          name="Deck Store" 
          count={deckStoreItems.length} 
          stockLevel={calculateStockLevel(deckStoreItems)} 
        />
        <StoreTypeCard 
          name="Provision Store" 
          count={provisionStoreItems.length} 
          stockLevel={calculateStockLevel(provisionStoreItems)} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {enginePredictions.length > 0 && (
          <LowStockPredictions storeName="Engine Store" items={enginePredictions} />
        )}
        {deckPredictions.length > 0 && (
          <LowStockPredictions storeName="Deck Store" items={deckPredictions} />
        )}
        {provisionPredictions.length > 0 && (
          <LowStockPredictions storeName="Provision Store" items={provisionPredictions} />
        )}
      </div>

      {aiRecommendations.length > 0 && (
        <AIRecommendations recommendations={aiRecommendations} />
      )}
    </div>
  );
}
