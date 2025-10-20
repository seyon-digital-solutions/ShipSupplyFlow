import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// todo: remove mock functionality
const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    orderNumber: "ORD-2025-004",
    chandler: "Marine Chandlers International",
    issueDate: new Date(2025, 9, 15),
    dueDate: new Date(2025, 9, 30),
    totalAmount: 4250.0,
    paidAmount: 4250.0,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    orderNumber: "ORD-2025-003",
    chandler: "Global Ship Supplies Ltd.",
    issueDate: new Date(2025, 9, 18),
    dueDate: new Date(2025, 10, 2),
    totalAmount: 1850.5,
    paidAmount: 0,
    status: "unpaid",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    orderNumber: "ORD-2025-005",
    chandler: "Port Supply & Services",
    issueDate: new Date(2025, 9, 12),
    dueDate: new Date(2025, 9, 27),
    totalAmount: 3200.0,
    paidAmount: 1600.0,
    status: "partial",
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    orderNumber: "ORD-2025-006",
    chandler: "Ocean Trading Co.",
    issueDate: new Date(2025, 9, 10),
    dueDate: new Date(2025, 9, 18),
    totalAmount: 5670.25,
    paidAmount: 0,
    status: "overdue",
  },
];

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline"; color: string }
> = {
  paid: { label: "Paid", variant: "outline", color: "bg-chart-3/10 text-chart-3 border-chart-3" },
  unpaid: { label: "Unpaid", variant: "secondary", color: "" },
  partial: { label: "Partial", variant: "default", color: "" },
  overdue: { label: "Overdue", variant: "outline", color: "bg-destructive/10 text-destructive border-destructive" },
};

export default function Invoices() {
  const totalUnpaid = mockInvoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.totalAmount - inv.paidAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Invoices</h1>
          <p className="text-muted-foreground">Track and manage supplier invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
          <p className="text-3xl font-semibold text-foreground">${totalUnpaid.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Pending Invoices</p>
          <p className="text-3xl font-semibold text-foreground">
            {mockInvoices.filter((inv) => inv.status === "unpaid").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-3xl font-semibold text-destructive">
            {mockInvoices.filter((inv) => inv.status === "overdue").length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent">
                <TableHead className="font-semibold">Invoice Number</TableHead>
                <TableHead className="font-semibold">Order</TableHead>
                <TableHead className="font-semibold">Chandler</TableHead>
                <TableHead className="font-semibold">Issue Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice, index) => (
                <TableRow
                  key={invoice.id}
                  className={index % 2 === 1 ? "bg-muted/30" : ""}
                  data-testid={`row-invoice-${invoice.id}`}
                >
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.orderNumber}</TableCell>
                  <TableCell>{invoice.chandler}</TableCell>
                  <TableCell>{format(invoice.issueDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(invoice.dueDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell className="font-semibold">
                    ${invoice.totalAmount.toFixed(2)}
                    {invoice.status === "partial" && (
                      <p className="text-xs text-muted-foreground">
                        Paid: ${invoice.paidAmount.toFixed(2)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig[invoice.status].variant}
                      className={statusConfig[invoice.status].color}
                    >
                      {statusConfig[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => console.log(`View invoice ${invoice.id}`)}
                        data-testid={`button-view-${invoice.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => console.log(`Download invoice ${invoice.id}`)}
                        data-testid={`button-download-${invoice.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
