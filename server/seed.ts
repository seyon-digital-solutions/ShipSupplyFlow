import { storage } from "./storage";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Create initial chandlers
    console.log("Creating chandlers...");
    const chandler1 = await storage.createChandler({
      name: "Global Ship Supplies Ltd.",
      contactPerson: "John Anderson",
      email: "anderson@globalship.com",
      phone: "+1-555-0101",
      address: "123 Harbor Street, Singapore",
      rating: "4.5",
    });

    const chandler2 = await storage.createChandler({
      name: "Marine Chandlers International",
      contactPerson: "Sarah Chen",
      email: "chen@marinechandlers.com",
      phone: "+1-555-0102",
      address: "456 Port Avenue, Hong Kong",
      rating: "4.8",
    });

    const chandler3 = await storage.createChandler({
      name: "Port Supply & Services",
      contactPerson: "Michael Roberts",
      email: "roberts@portsupply.com",
      phone: "+1-555-0103",
      address: "789 Dock Road, Dubai",
      rating: "4.2",
    });

    const chandler4 = await storage.createChandler({
      name: "Ocean Trading Co.",
      contactPerson: "Emily Watson",
      email: "watson@oceantrading.com",
      phone: "+1-555-0104",
      address: "321 Marine Drive, Mumbai",
      rating: "4.6",
    });

    console.log("Chandlers created successfully");

    // Create initial users
    console.log("Creating users...");
    await storage.createUser({
      name: "Captain John Smith",
      username: "captain.smith",
      password: "password123",
      role: "Admin",
    });

    await storage.createUser({
      name: "Chief Engineer Mary Johnson",
      username: "engineer.mary",
      password: "password123",
      role: "Staff",
    });

    await storage.createUser({
      name: "Deck Officer Tom Wilson",
      username: "deck.tom",
      password: "password123",
      role: "Staff",
    });

    await storage.createUser({
      name: "Supply Manager Lisa Brown",
      username: "supply.lisa",
      password: "password123",
      role: "Staff",
    });

    console.log("Users created successfully");

    // Create initial inventory items
    console.log("Creating inventory items...");
    
    // Engine Store items
    const hydraulicOil = await storage.createItem({
      name: "Hydraulic Oil SAE 30",
      category: "Engine Store",
      unit: "Liters",
      currentStock: 150,
      minimumStock: 100,
      location: "Engine Room",
      description: "Premium hydraulic oil for ship machinery",
    });

    const engineGrease = await storage.createItem({
      name: "Engine Grease",
      category: "Engine Store",
      unit: "Kilograms",
      currentStock: 45,
      minimumStock: 25,
      location: "Engine Room",
      description: "High-temperature engine grease",
    });

    const fuelFilter = await storage.createItem({
      name: "Fuel Filter",
      category: "Engine Store",
      unit: "Pieces",
      currentStock: 12,
      minimumStock: 8,
      location: "Engine Room",
      description: "Main engine fuel filter cartridges",
    });

    const oilFilter = await storage.createItem({
      name: "Oil Filter",
      category: "Engine Store",
      unit: "Pieces",
      currentStock: 15,
      minimumStock: 12,
      location: "Engine Room",
      description: "Lubrication oil filter elements",
    });

    // Deck Store items
    const deckPaint = await storage.createItem({
      name: "Deck Paint - White",
      category: "Deck Store",
      unit: "Liters",
      currentStock: 8,
      minimumStock: 20,
      location: "Deck",
      description: "Weather-resistant deck coating",
    });

    const rope = await storage.createItem({
      name: "Rope 20mm",
      category: "Deck Store",
      unit: "Meters",
      currentStock: 120,
      minimumStock: 100,
      location: "Deck",
      description: "Polyester mooring rope",
    });

    const weldingRods = await storage.createItem({
      name: "Welding Rods",
      category: "Deck Store",
      unit: "Kilograms",
      currentStock: 15,
      minimumStock: 25,
      location: "Deck",
      description: "E7018 welding electrodes",
    });

    // Safety Equipment
    const safetyGloves = await storage.createItem({
      name: "Safety Gloves",
      category: "Safety Equipment",
      unit: "Pieces",
      currentStock: 28,
      minimumStock: 40,
      location: "Main Store",
      description: "Heat-resistant work gloves",
    });

    const fireExtinguisher = await storage.createItem({
      name: "Fire Extinguisher",
      category: "Safety Equipment",
      unit: "Pieces",
      currentStock: 24,
      minimumStock: 20,
      location: "Main Store",
      description: "CO2 fire extinguisher 5kg",
    });

    // Provision Store items
    const freshWater = await storage.createItem({
      name: "Fresh Water",
      category: "Provision Store",
      unit: "Liters",
      currentStock: 2000,
      minimumStock: 3000,
      location: "Galley",
      description: "Potable drinking water",
    });

    const rice = await storage.createItem({
      name: "Rice",
      category: "Provision Store",
      unit: "Kilograms",
      currentStock: 80,
      minimumStock: 100,
      location: "Galley",
      description: "Long grain white rice",
    });

    const cookingOil = await storage.createItem({
      name: "Cooking Oil",
      category: "Provision Store",
      unit: "Liters",
      currentStock: 35,
      minimumStock: 40,
      location: "Galley",
      description: "Vegetable cooking oil",
    });

    console.log("Inventory items created successfully");

    // Create some sample transactions
    console.log("Creating sample transactions...");
    
    await storage.createTransaction({
      itemId: hydraulicOil.id,
      type: "in",
      quantity: 50,
      date: new Date(2025, 9, 20, 10, 30),
      remarks: "Regular monthly supply",
    });

    await storage.createTransaction({
      itemId: deckPaint.id,
      type: "out",
      quantity: 5,
      date: new Date(2025, 9, 20, 9, 15),
      remarks: "Used for deck maintenance",
    });

    await storage.createTransaction({
      itemId: engineGrease.id,
      type: "in",
      quantity: 25,
      date: new Date(2025, 9, 19, 14, 45),
      remarks: "Stock replenishment",
    });

    await storage.createTransaction({
      itemId: safetyGloves.id,
      type: "out",
      quantity: 12,
      date: new Date(2025, 9, 19, 11, 20),
      remarks: "Issued to crew",
    });

    await storage.createTransaction({
      itemId: freshWater.id,
      type: "in",
      quantity: 500,
      date: new Date(2025, 9, 18, 16, 0),
      remarks: "Port water supply",
    });

    console.log("Sample transactions created successfully");

    console.log("✓ Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
