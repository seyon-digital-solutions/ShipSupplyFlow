import { AIRecommendations } from "../ai-recommendations";

const mockRecommendations = [
  {
    type: "critical" as const,
    title: "Critical: Engine Oil Stock Alert",
    description: "Based on usage patterns, Hydraulic Oil SAE 30 will run out in 5 days. Recommend ordering 200L immediately.",
    action: "Create Order Now",
  },
  {
    type: "warning" as const,
    title: "Seasonal Demand Increase",
    description: "Historical data shows 40% increase in deck paint usage in next month. Consider bulk ordering to save 15%.",
    action: "View Bulk Pricing",
  },
  {
    type: "optimization" as const,
    title: "Cost Optimization Opportunity",
    description: "Switch to quarterly orders for engine grease could reduce costs by $240/year with Marine Chandlers International.",
    action: "Review Proposal",
  },
];

export default function AIRecommendationsExample() {
  return (
    <div className="p-6">
      <AIRecommendations recommendations={mockRecommendations} />
    </div>
  );
}
