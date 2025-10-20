import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import { SummaryCard } from "@/components/summary-card";
import { StoreTypeCard } from "@/components/store-type-card";
import { RecentTransactions } from "@/components/recent-transactions";

// todo: remove mock functionality
const mockTransactions = [
  { id: "1", type: "in" as const, itemName: "Hydraulic Oil SAE 30", quantity: 50, date: new Date(2025, 9, 20, 10, 30) },
  { id: "2", type: "out" as const, itemName: "Deck Paint - White", quantity: 5, date: new Date(2025, 9, 20, 9, 15) },
  { id: "3", type: "in" as const, itemName: "Engine Grease", quantity: 25, date: new Date(2025, 9, 19, 14, 45) },
  { id: "4", type: "out" as const, itemName: "Safety Gloves", quantity: 12, date: new Date(2025, 9, 19, 11, 20) },
  { id: "5", type: "in" as const, itemName: "Fresh Water", quantity: 200, date: new Date(2025, 9, 18, 16, 0) },
  { id: "6", type: "out" as const, itemName: "Rope 20mm", quantity: 30, date: new Date(2025, 9, 18, 8, 30) },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of ship inventory and recent activity</p>
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

      <RecentTransactions transactions={mockTransactions} />
    </div>
  );
}
