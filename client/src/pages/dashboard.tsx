import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import { SummaryCard } from "@/components/summary-card";
import { StoreTypeCard } from "@/components/store-type-card";
import { LowStockPredictions } from "@/components/low-stock-predictions";
import { AIRecommendations } from "@/components/ai-recommendations";

// todo: remove mock functionality
const engineStoreItems = [
  { name: "Hydraulic Oil SAE 30", currentStock: 45, minimumStock: 100, daysUntilEmpty: 5 },
  { name: "Engine Grease", currentStock: 12, minimumStock: 25, daysUntilEmpty: 8 },
  { name: "Fuel Filter", currentStock: 3, minimumStock: 8, daysUntilEmpty: 4 },
  { name: "Oil Filter", currentStock: 6, minimumStock: 12, daysUntilEmpty: 7 },
  { name: "Coolant Fluid", currentStock: 20, minimumStock: 50, daysUntilEmpty: 10 },
  { name: "Transmission Oil", currentStock: 8, minimumStock: 20, daysUntilEmpty: 6 },
  { name: "Air Filter Element", currentStock: 4, minimumStock: 10, daysUntilEmpty: 9 },
  { name: "Gasket Set", currentStock: 2, minimumStock: 5, daysUntilEmpty: 12 },
  { name: "V-Belt", currentStock: 5, minimumStock: 12, daysUntilEmpty: 11 },
  { name: "Spark Plug", currentStock: 10, minimumStock: 24, daysUntilEmpty: 8 },
];

const deckStoreItems = [
  { name: "Deck Paint - White", currentStock: 8, minimumStock: 20, daysUntilEmpty: 6 },
  { name: "Rope 20mm", currentStock: 45, minimumStock: 100, daysUntilEmpty: 14 },
  { name: "Wire Rope", currentStock: 12, minimumStock: 30, daysUntilEmpty: 10 },
  { name: "Shackles", currentStock: 15, minimumStock: 40, daysUntilEmpty: 13 },
  { name: "Steel Cable", currentStock: 8, minimumStock: 20, daysUntilEmpty: 9 },
  { name: "Welding Rods", currentStock: 15, minimumStock: 40, daysUntilEmpty: 8 },
  { name: "Deck Cleaner", currentStock: 5, minimumStock: 15, daysUntilEmpty: 7 },
  { name: "Paint Thinner", currentStock: 6, minimumStock: 18, daysUntilEmpty: 11 },
  { name: "Rust Remover", currentStock: 3, minimumStock: 10, daysUntilEmpty: 5 },
  { name: "Safety Tape", currentStock: 20, minimumStock: 50, daysUntilEmpty: 12 },
];

const provisionStoreItems = [
  { name: "Fresh Water", currentStock: 800, minimumStock: 2000, daysUntilEmpty: 4 },
  { name: "Canned Vegetables", currentStock: 40, minimumStock: 100, daysUntilEmpty: 8 },
  { name: "Rice", currentStock: 25, minimumStock: 80, daysUntilEmpty: 6 },
  { name: "Cooking Oil", currentStock: 15, minimumStock: 40, daysUntilEmpty: 7 },
  { name: "Coffee", currentStock: 8, minimumStock: 20, daysUntilEmpty: 5 },
  { name: "Sugar", currentStock: 10, minimumStock: 30, daysUntilEmpty: 9 },
  { name: "Salt", currentStock: 6, minimumStock: 15, daysUntilEmpty: 11 },
  { name: "Flour", currentStock: 12, minimumStock: 35, daysUntilEmpty: 8 },
  { name: "Pasta", currentStock: 18, minimumStock: 50, daysUntilEmpty: 10 },
  { name: "Canned Meat", currentStock: 22, minimumStock: 60, daysUntilEmpty: 7 },
];

const aiRecommendations = [
  {
    type: "critical" as const,
    title: "Critical: Engine Oil Stock Alert",
    description: "Based on usage patterns, Hydraulic Oil SAE 30 will run out in 5 days. Recommend ordering 200L immediately to avoid operational disruption.",
    action: "Create Order Now",
  },
  {
    type: "critical" as const,
    title: "Fresh Water Critical Low",
    description: "Fresh water reserves at 40% capacity. Historical consumption suggests restocking needed within 4 days.",
    action: "Request Emergency Supply",
  },
  {
    type: "warning" as const,
    title: "Seasonal Demand Increase",
    description: "Historical data shows 40% increase in deck paint usage in next month due to maintenance season. Consider bulk ordering to save 15%.",
    action: "View Bulk Pricing",
  },
  {
    type: "optimization" as const,
    title: "Cost Optimization Opportunity",
    description: "Switch to quarterly orders for engine grease could reduce costs by $240/year with Marine Chandlers International.",
    action: "Review Proposal",
  },
  {
    type: "optimization" as const,
    title: "Bundled Ordering Savings",
    description: "Combine pending orders for deck store items to qualify for free shipping and save $125.",
    action: "View Bundled Order",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of ship inventory and stock predictions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Items" value="324" icon={Package} accentColor="primary" />
        <SummaryCard title="Low Stock Items" value="12" icon={AlertTriangle} accentColor="warning" />
        <SummaryCard title="Recent Transactions" value="48" icon={TrendingDown} accentColor="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StoreTypeCard name="Engine Store" count={156} stockLevel={78} />
        <StoreTypeCard name="Deck Store" count={92} stockLevel={45} />
        <StoreTypeCard name="Provision Store" count={76} stockLevel={92} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LowStockPredictions storeName="Engine Store" items={engineStoreItems} />
        <LowStockPredictions storeName="Deck Store" items={deckStoreItems} />
        <LowStockPredictions storeName="Provision Store" items={provisionStoreItems} />
      </div>

      <AIRecommendations recommendations={aiRecommendations} />
    </div>
  );
}
