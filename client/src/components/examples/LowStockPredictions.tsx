import { LowStockPredictions } from "../low-stock-predictions";

const mockEngineItems = [
  { name: "Hydraulic Oil SAE 30", currentStock: 45, minimumStock: 100, daysUntilEmpty: 5 },
  { name: "Engine Grease", currentStock: 12, minimumStock: 25, daysUntilEmpty: 8 },
  { name: "Fuel Filter", currentStock: 3, minimumStock: 8, daysUntilEmpty: 4 },
];

export default function LowStockPredictionsExample() {
  return (
    <div className="p-6">
      <LowStockPredictions storeName="Engine Store" items={mockEngineItems} />
    </div>
  );
}
