import { StoreTypeCard } from "../store-type-card";

export default function StoreTypeCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <StoreTypeCard name="Engine Store" count={156} stockLevel={78} />
      <StoreTypeCard name="Deck Store" count={92} stockLevel={45} />
      <StoreTypeCard name="Provision Store" count={76} stockLevel={92} />
    </div>
  );
}
