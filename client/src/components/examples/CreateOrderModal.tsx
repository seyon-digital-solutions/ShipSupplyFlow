import { useState } from "react";
import { CreateOrderModal } from "../create-order-modal";
import { Button } from "@/components/ui/button";

export default function CreateOrderModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Create Order Modal</Button>
      <CreateOrderModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(order) => console.log("Order created:", order)}
      />
    </div>
  );
}
