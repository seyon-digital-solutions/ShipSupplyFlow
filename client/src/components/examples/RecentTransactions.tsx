import { RecentTransactions } from "../recent-transactions";

const mockTransactions = [
  { id: "1", type: "in" as const, itemName: "Hydraulic Oil SAE 30", quantity: 50, date: new Date(2025, 9, 20, 10, 30) },
  { id: "2", type: "out" as const, itemName: "Deck Paint - White", quantity: 5, date: new Date(2025, 9, 20, 9, 15) },
  { id: "3", type: "in" as const, itemName: "Engine Grease", quantity: 25, date: new Date(2025, 9, 19, 14, 45) },
  { id: "4", type: "out" as const, itemName: "Safety Gloves", quantity: 12, date: new Date(2025, 9, 19, 11, 20) },
  { id: "5", type: "in" as const, itemName: "Fresh Water", quantity: 200, date: new Date(2025, 9, 18, 16, 0) },
];

export default function RecentTransactionsExample() {
  return (
    <div className="p-6">
      <RecentTransactions transactions={mockTransactions} />
    </div>
  );
}
