import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { CreateOrderModal } from "@/components/create-order-modal";
import { format } from "date-fns";
import { useLocation } from "wouter";

// todo: remove mock functionality
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    status: "pending-quotes",
    createdAt: new Date(2025, 9, 20),
    requiredDate: new Date(2025, 9, 25),
    itemCount: 5,
    quotesReceived: 2,
    quotesRequested: 3,
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    status: "quotes-received",
    createdAt: new Date(2025, 9, 18),
    requiredDate: new Date(2025, 9, 23),
    itemCount: 8,
    quotesReceived: 3,
    quotesRequested: 3,
  },
  {
    id: "3",
    orderNumber: "ORD-2025-003",
    status: "approved",
    createdAt: new Date(2025, 9, 15),
    requiredDate: new Date(2025, 9, 20),
    itemCount: 3,
    quotesReceived: 4,
    quotesRequested: 4,
    selectedChandler: "Global Ship Supplies Ltd.",
  },
  {
    id: "4",
    orderNumber: "ORD-2025-004",
    status: "delivered",
    createdAt: new Date(2025, 9, 10),
    requiredDate: new Date(2025, 9, 15),
    itemCount: 12,
    quotesReceived: 2,
    quotesRequested: 2,
    selectedChandler: "Marine Chandlers International",
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  "pending-quotes": { label: "Pending Quotes", variant: "secondary" },
  "quotes-received": { label: "Quotes Received", variant: "default" },
  approved: { label: "Approved", variant: "outline" },
  delivered: { label: "Delivered", variant: "outline" },
};

export default function Orders() {
  const [modalOpen, setModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Orders & Quotes</h1>
          <p className="text-muted-foreground">
            Manage inventory orders and compare chandler quotes
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} data-testid="button-create-order">
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockOrders.map((order) => (
          <Card key={order.id} className="p-6" data-testid={`card-order-${order.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">{order.orderNumber}</h3>
                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">
                      {format(order.createdAt, "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Required By</p>
                    <p className="font-medium text-foreground">
                      {format(order.requiredDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p className="font-medium text-foreground">{order.itemCount} items</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quotes</p>
                    <p className="font-medium text-foreground">
                      {order.quotesReceived} of {order.quotesRequested} received
                    </p>
                  </div>
                </div>
                {order.selectedChandler && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      Selected Chandler:{" "}
                      <span className="font-medium text-foreground">{order.selectedChandler}</span>
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  console.log(`View order ${order.id}`);
                  setLocation(`/orders/${order.id}`);
                }}
                data-testid={`button-view-order-${order.id}`}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(order) => console.log("Order saved:", order)}
      />
    </div>
  );
}
