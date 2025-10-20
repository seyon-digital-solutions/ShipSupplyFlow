import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "in" | "out";
  itemName: string;
  quantity: number;
  date: Date;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="p-6" data-testid="card-recent-transactions">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={`flex items-center gap-3 py-3 ${
              index < transactions.length - 1 ? "border-b border-border" : ""
            }`}
            data-testid={`transaction-${transaction.id}`}
          >
            {transaction.type === "in" ? (
              <ArrowDownCircle className="w-5 h-5 text-chart-3 flex-shrink-0" />
            ) : (
              <ArrowUpCircle className="w-5 h-5 text-chart-2 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{transaction.itemName}</p>
              <p className="text-xs text-muted-foreground">
                {format(transaction.date, "MMM dd, yyyy - HH:mm")}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${transaction.type === "in" ? "text-chart-3" : "text-chart-2"}`}>
                {transaction.type === "in" ? "+" : "-"}
                {transaction.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
