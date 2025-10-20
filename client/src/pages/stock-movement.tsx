import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

// todo: remove mock functionality
const mockItems = [
  "Hydraulic Oil SAE 30",
  "Deck Paint - White",
  "Engine Grease",
  "Safety Gloves",
  "Fresh Water",
  "Rope 20mm",
  "Air Filter",
  "Fire Extinguisher",
];

export default function StockMovement() {
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    type: "in",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Stock movement recorded:", formData);
    setFormData({
      item: "",
      quantity: "",
      date: new Date().toISOString().split("T")[0],
      type: "in",
      remarks: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Stock Movement</h1>
        <p className="text-muted-foreground">Record stock in and stock out transactions</p>
      </div>

      <Card className="p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Movement Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in" id="in" data-testid="radio-stock-in" />
                <Label htmlFor="in" className="flex items-center gap-2 cursor-pointer font-normal">
                  <ArrowDownCircle className="w-4 h-4 text-chart-3" />
                  Stock In
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="out" id="out" data-testid="radio-stock-out" />
                <Label htmlFor="out" className="flex items-center gap-2 cursor-pointer font-normal">
                  <ArrowUpCircle className="w-4 h-4 text-chart-2" />
                  Stock Out
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="item">Item Name</Label>
              <Select
                value={formData.item}
                onValueChange={(value) => setFormData({ ...formData, item: value })}
              >
                <SelectTrigger id="item" data-testid="select-item">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {mockItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                required
                data-testid="input-quantity"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                data-testid="input-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes or comments..."
              rows={4}
              data-testid="input-remarks"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className={formData.type === "in" ? "bg-chart-3" : ""}
              data-testid="button-submit"
            >
              {formData.type === "in" ? "Record Stock In" : "Record Stock Out"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
