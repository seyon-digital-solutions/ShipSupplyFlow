import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// todo: remove mock functionality
const mockOrderDetails = {
  id: "2",
  orderNumber: "ORD-2025-002",
  status: "quotes-received",
  createdAt: new Date(2025, 9, 18),
  requiredDate: new Date(2025, 9, 23),
  createdBy: "Captain Smith",
  notes: "Urgent delivery required for engine maintenance",
  items: [
    { id: "1", name: "Hydraulic Oil SAE 30", quantity: 100, unit: "Liters" },
    { id: "2", name: "Engine Grease", quantity: 50, unit: "Kilograms" },
    { id: "3", name: "Air Filter", quantity: 10, unit: "Pieces" },
  ],
  bids: [
    {
      id: "1",
      chandler: "Global Ship Supplies Ltd.",
      submittedAt: new Date(2025, 9, 19, 10, 30),
      validUntil: new Date(2025, 9, 22),
      items: [
        { name: "Hydraulic Oil SAE 30", unitPrice: 25.5, total: 2550, availability: "in-stock" },
        { name: "Engine Grease", unitPrice: 18.0, total: 900, availability: "in-stock" },
        { name: "Air Filter", unitPrice: 45.0, total: 450, availability: "2-3 days" },
      ],
      total: 3900,
      notes: "Free delivery for orders over $3000",
    },
    {
      id: "2",
      chandler: "Marine Chandlers International",
      submittedAt: new Date(2025, 9, 19, 14, 15),
      validUntil: new Date(2025, 9, 21),
      items: [
        { name: "Hydraulic Oil SAE 30", unitPrice: 24.0, total: 2400, availability: "in-stock" },
        { name: "Engine Grease", unitPrice: 19.5, total: 975, availability: "in-stock" },
        { name: "Air Filter", unitPrice: 42.0, total: 420, availability: "in-stock" },
      ],
      total: 3795,
      notes: "All items in stock, next-day delivery available",
    },
    {
      id: "3",
      chandler: "Port Supply & Services",
      submittedAt: new Date(2025, 9, 19, 16, 45),
      validUntil: new Date(2025, 9, 22),
      items: [
        { name: "Hydraulic Oil SAE 30", unitPrice: 26.0, total: 2600, availability: "in-stock" },
        { name: "Engine Grease", unitPrice: 17.5, total: 875, availability: "in-stock" },
        { name: "Air Filter", unitPrice: 48.0, total: 480, availability: "in-stock" },
      ],
      total: 3955,
      notes: "Premium quality products with 2-year warranty",
    },
  ],
};

export default function OrderDetails() {
  const [, setLocation] = useLocation();

  const lowestBid = [...mockOrderDetails.bids].sort((a, b) => a.total - b.total)[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLocation("/orders")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            {mockOrderDetails.orderNumber}
          </h1>
          <p className="text-muted-foreground">Compare quotes and select best offer</p>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Order Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Created By</p>
            <p className="font-medium text-foreground">{mockOrderDetails.createdBy}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created Date</p>
            <p className="font-medium text-foreground">
              {format(mockOrderDetails.createdAt, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Required By</p>
            <p className="font-medium text-foreground">
              {format(mockOrderDetails.requiredDate, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant="default">Quotes Received</Badge>
          </div>
        </div>
        {mockOrderDetails.notes && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-sm text-foreground">{mockOrderDetails.notes}</p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Requested Items</h2>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent">
                <TableHead className="font-semibold">Item Name</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrderDetails.items.map((item, index) => (
                <TableRow key={item.id} className={index % 2 === 1 ? "bg-muted/30" : ""}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Quote Comparison ({mockOrderDetails.bids.length} Bids Received)
        </h2>
        {mockOrderDetails.bids.map((bid) => (
          <Card
            key={bid.id}
            className={`p-6 ${bid.id === lowestBid.id ? "border-l-4 border-l-chart-3" : ""}`}
            data-testid={`card-bid-${bid.id}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{bid.chandler}</h3>
                  {bid.id === lowestBid.id && (
                    <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3">
                      Lowest Bid
                    </Badge>
                  )}
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted: </span>
                    <span className="font-medium text-foreground">
                      {format(bid.submittedAt, "MMM dd, HH:mm")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valid Until: </span>
                    <span className="font-medium text-foreground">
                      {format(bid.validUntil, "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">${bid.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="border rounded-md mb-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent">
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Unit Price</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bid.items.map((item, index) => (
                    <TableRow key={index} className={index % 2 === 1 ? "bg-muted/30" : ""}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.availability}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {bid.notes && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-foreground">{bid.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => console.log(`Approve bid ${bid.id}`)}
                data-testid={`button-approve-${bid.id}`}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve This Quote
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log(`Reject bid ${bid.id}`)}
                data-testid={`button-reject-${bid.id}`}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
