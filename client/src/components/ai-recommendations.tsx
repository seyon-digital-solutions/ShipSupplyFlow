import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface Recommendation {
  type: "critical" | "warning" | "optimization";
  title: string;
  description: string;
  action?: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

const typeConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive",
  },
  warning: {
    icon: TrendingUp,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4",
  },
  optimization: {
    icon: CheckCircle,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3",
  },
};

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <Card className="p-6" data-testid="card-ai-recommendations">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI Restocking Recommendations</h3>
        <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
          Powered by AI
        </Badge>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = typeConfig[rec.type].icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-md border ${typeConfig[rec.type].bgColor} ${typeConfig[rec.type].borderColor}`}
              data-testid={`recommendation-${index}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${typeConfig[rec.type].color}`} />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  {rec.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log(`Action: ${rec.action}`)}
                      data-testid={`button-action-${index}`}
                    >
                      {rec.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
