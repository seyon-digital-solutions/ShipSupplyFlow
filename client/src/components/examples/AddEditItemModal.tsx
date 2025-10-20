import { useState } from "react";
import { AddEditItemModal } from "../add-edit-item-modal";
import { Button } from "@/components/ui/button";

export default function AddEditItemModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Add Item Modal</Button>
      <AddEditItemModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(item) => console.log("Item saved:", item)}
      />
    </div>
  );
}
