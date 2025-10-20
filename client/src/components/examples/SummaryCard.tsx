import { SummaryCard } from "../summary-card";
import { Package, AlertTriangle, TrendingDown } from "lucide-react";

export default function SummaryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <SummaryCard title="Total Items" value="324" icon={Package} accentColor="primary" />
      <SummaryCard title="Low Stock Items" value="12" icon={AlertTriangle} accentColor="warning" />
      <SummaryCard title="Recent Transactions" value="48" icon={TrendingDown} accentColor="success" />
    </div>
  );
}
