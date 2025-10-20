import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowDownCircle, ArrowUpCircle, Search, Pencil } from "lucide-react";
import { AddEditItemModal } from "@/components/add-edit-item-modal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// todo: remove mock functionality
const mockItems = [
  { id: "1", name: "Hydraulic Oil SAE 30", category: "Engine Store", currentStock: 150, unit: "Liters", location: "Engine Room", lastUpdated: new Date(2025, 9, 20) },
  { id: "2", name: "Deck Paint - White", category: "Deck Store", currentStock: 8, unit: "Liters", location: "Deck", lastUpdated: new Date(2025, 9, 19) },
  { id: "3", name: "Engine Grease", category: "Engine Store", currentStock: 45, unit: "Kilograms", location: "Engine Room", lastUpdated: new Date(2025, 9, 18) },
  { id: "4", name: "Safety Gloves", category: "Safety Equipment", currentStock: 28, unit: "Pieces", location: "Main Store", lastUpdated: new Date(2025, 9, 20) },
  { id: "5", name: "Fresh Water", category: "Provision Store", currentStock: 2000, unit: "Liters", location: "Galley", lastUpdated: new Date(2025, 9, 17) },
  { id: "6", name: "Rope 20mm", category: "Deck Store", currentStock: 120, unit: "Meters", location: "Deck", lastUpdated: new Date(2025, 9, 16) },
  { id: "7", name: "Air Filter", category: "Spare Parts", currentStock: 6, unit: "Pieces", location: "Engine Room", lastUpdated: new Date(2025, 9, 15) },
  { id: "8", name: "Fire Extinguisher", category: "Safety Equipment", currentStock: 24, unit: "Pieces", location: "Main Store", lastUpdated: new Date(2025, 9, 14) },
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "issue" | "receive">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || item.location === locationFilter;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleAddItem = () => {
    setModalType("add");
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setModalType("edit");
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Manage ship stores and supplies</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40" data-testid="select-filter-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Engine Store">Engine Store</SelectItem>
              <SelectItem value="Deck Store">Deck Store</SelectItem>
              <SelectItem value="Provision Store">Provision Store</SelectItem>
              <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
              <SelectItem value="Spare Parts">Spare Parts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-40" data-testid="select-filter-location">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Main Store">Main Store</SelectItem>
              <SelectItem value="Engine Room">Engine Room</SelectItem>
              <SelectItem value="Deck">Deck</SelectItem>
              <SelectItem value="Galley">Galley</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddItem} data-testid="button-add-item">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
          <Button variant="outline" onClick={() => console.log("Issue item")} data-testid="button-issue-item">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Issue Item
          </Button>
          <Button variant="outline" onClick={() => console.log("Receive item")} data-testid="button-receive-item">
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Receive Item
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead className="font-semibold">Item Name</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Current Stock</TableHead>
              <TableHead className="font-semibold">Unit</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={item.id} className={index % 2 === 1 ? "bg-muted/30" : ""} data-testid={`row-item-${item.id}`}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(item.lastUpdated, "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditItem(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddEditItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(item) => console.log("Saved:", item)}
        item={selectedItem}
      />
    </div>
  );
}
