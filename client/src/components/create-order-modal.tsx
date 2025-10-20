import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (order: any) => void;
}

// todo: remove mock functionality
const mockItems = [
  { id: "1", name: "Hydraulic Oil SAE 30", unit: "Liters" },
  { id: "2", name: "Deck Paint - White", unit: "Liters" },
  { id: "3", name: "Engine Grease", unit: "Kilograms" },
  { id: "4", name: "Safety Gloves", unit: "Pieces" },
  { id: "5", name: "Fresh Water", unit: "Liters" },
];

const mockChandlers = [
  { id: "1", name: "Global Ship Supplies Ltd." },
  { id: "2", name: "Marine Chandlers International" },
  { id: "3", name: "Port Supply & Services" },
  { id: "4", name: "Ocean Trading Co." },
];

export function CreateOrderModal({ open, onClose, onSave }: CreateOrderModalProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedChandlers, setSelectedChandlers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    requiredDate: "",
    notes: "",
  });

  const [currentItem, setCurrentItem] = useState({
    itemId: "",
    quantity: "",
  });

  const addItem = () => {
    if (currentItem.itemId && currentItem.quantity) {
      const item = mockItems.find((i) => i.id === currentItem.itemId);
      if (item) {
        setOrderItems([
          ...orderItems,
          {
            itemId: item.id,
            itemName: item.name,
            quantity: parseInt(currentItem.quantity),
            unit: item.unit,
          },
        ]);
        setCurrentItem({ itemId: "", quantity: "" });
      }
    }
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const toggleChandler = (chandlerId: string) => {
    setSelectedChandlers((prev) =>
      prev.includes(chandlerId)
        ? prev.filter((id) => id !== chandlerId)
        : [...prev, chandlerId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating order:", { orderItems, selectedChandlers, ...formData });
    onSave({ orderItems, selectedChandlers, ...formData });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Order Items</h3>
            <div className="flex gap-2">
              <Select
                value={currentItem.itemId}
                onValueChange={(value) => setCurrentItem({ ...currentItem, itemId: value })}
              >
                <SelectTrigger className="flex-1" data-testid="select-order-item">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {mockItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                className="w-32"
                data-testid="input-order-quantity"
              />
              <Button type="button" onClick={addItem} size="icon" data-testid="button-add-order-item">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {orderItems.length > 0 && (
              <div className="border rounded-md">
                <div className="divide-y">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3"
                      data-testid={`order-item-${index}`}
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        data-testid={`button-remove-item-${index}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Select Ship Chandlers to Request Quotes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {mockChandlers.map((chandler) => (
                <div
                  key={chandler.id}
                  className="flex items-center space-x-2 border rounded-md p-3"
                  data-testid={`chandler-option-${chandler.id}`}
                >
                  <Checkbox
                    id={chandler.id}
                    checked={selectedChandlers.includes(chandler.id)}
                    onCheckedChange={() => toggleChandler(chandler.id)}
                  />
                  <label
                    htmlFor={chandler.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {chandler.name}
                  </label>
                </div>
              ))}
            </div>
            {selectedChandlers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {selectedChandlers.map((id) => {
                  const chandler = mockChandlers.find((c) => c.id === id);
                  return (
                    <Badge key={id} variant="secondary">
                      {chandler?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requiredDate">Required Delivery Date</Label>
              <Input
                id="requiredDate"
                type="date"
                value={formData.requiredDate}
                onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                required
                data-testid="input-required-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={3}
              data-testid="input-order-notes"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-order">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={orderItems.length === 0 || selectedChandlers.length === 0}
              data-testid="button-submit-order"
            >
              Send Quote Requests
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
