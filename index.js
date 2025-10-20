var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bidItems: () => bidItems,
  bids: () => bids,
  chandlers: () => chandlers,
  insertBidItemSchema: () => insertBidItemSchema,
  insertBidSchema: () => insertBidSchema,
  insertChandlerSchema: () => insertChandlerSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertItemSchema: () => insertItemSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserSchema: () => insertUserSchema,
  invoices: () => invoices,
  items: () => items,
  orderItems: () => orderItems,
  orders: () => orders,
  transactions: () => transactions,
  updateItemSchema: () => updateItemSchema,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("staff")
});
var items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minimumStock: integer("minimum_stock").notNull().default(0),
  location: text("location").notNull(),
  description: text("description"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow()
});
var transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  remarks: text("remarks")
});
var chandlers = pgTable("chandlers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  rating: decimal("rating", { precision: 3, scale: 2 })
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  requiredDate: timestamp("required_date").notNull(),
  notes: text("notes"),
  selectedChandlerId: varchar("selected_chandler_id").references(() => chandlers.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 })
});
var orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  itemId: varchar("item_id").notNull().references(() => items.id),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull()
});
var bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  chandlerId: varchar("chandler_id").notNull().references(() => chandlers.id),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 })
});
var bidItems = pgTable("bid_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bidId: varchar("bid_id").notNull().references(() => bids.id, { onDelete: "cascade" }),
  orderItemId: varchar("order_item_id").notNull().references(() => orderItems.id),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  availability: text("availability").notNull().default("in-stock")
});
var invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  chandlerId: varchar("chandler_id").notNull().references(() => chandlers.id),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("unpaid"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).notNull().default(sql`0`),
  notes: text("notes")
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var insertItemSchema = createInsertSchema(items).omit({
  id: true,
  lastUpdated: true
}).extend({
  currentStock: z.number().min(0, "Stock cannot be negative"),
  minimumStock: z.number().min(0, "Minimum stock cannot be negative")
});
var updateItemSchema = insertItemSchema.partial().extend({
  currentStock: z.number().min(0, "Stock cannot be negative").optional(),
  minimumStock: z.number().min(0, "Minimum stock cannot be negative").optional()
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true
}).extend({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  type: z.enum(["in", "out"])
});
var insertChandlerSchema = createInsertSchema(chandlers).omit({
  id: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  submittedAt: true
});
var insertBidItemSchema = createInsertSchema(bidItems).omit({
  id: true
});
var insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  issueDate: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var pool = new Pool({ connectionString: "postgresql://neondb_owner:npg_d7P0qCaSjfgo@ep-bold-dew-agzv0r7m.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require" });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2 } from "drizzle-orm";
import bcrypt from "bcryptjs";
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({ ...insertUser, password: hashedPassword }).returning();
    return user;
  }
  async getAllUsers() {
    return await db.select().from(users);
  }
  async updateUser(id, userData) {
    const dataToUpdate = { ...userData };
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }
    const [user] = await db.update(users).set(dataToUpdate).where(eq(users.id, id)).returning();
    return user;
  }
  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id));
  }
  // Items
  async getAllItems() {
    return await db.select().from(items).orderBy(desc(items.lastUpdated));
  }
  async getItem(id) {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || void 0;
  }
  async createItem(insertItem) {
    const [item] = await db.insert(items).values(insertItem).returning();
    return item;
  }
  async updateItem(id, itemData) {
    const [item] = await db.update(items).set({ ...itemData, lastUpdated: /* @__PURE__ */ new Date() }).where(eq(items.id, id)).returning();
    return item;
  }
  async deleteItem(id) {
    await db.delete(items).where(eq(items.id, id));
  }
  async getLowStockItems() {
    return await db.select().from(items).where(sql2`${items.currentStock} < ${items.minimumStock}`).orderBy(sql2`(${items.currentStock}::float / ${items.minimumStock}::float)`);
  }
  async getItemsByCategory(category) {
    return await db.select().from(items).where(eq(items.category, category));
  }
  // Transactions
  async getAllTransactions() {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }
  async getTransaction(id) {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || void 0;
  }
  async createTransaction(insertTransaction) {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    const item = await this.getItem(insertTransaction.itemId);
    if (item) {
      const newStock = insertTransaction.type === "in" ? item.currentStock + insertTransaction.quantity : item.currentStock - insertTransaction.quantity;
      await this.updateItem(insertTransaction.itemId, { currentStock: newStock });
    }
    return transaction;
  }
  async getRecentTransactions(limit) {
    return await db.select().from(transactions).orderBy(desc(transactions.date)).limit(limit);
  }
  async getTransactionsByItem(itemId) {
    return await db.select().from(transactions).where(eq(transactions.itemId, itemId)).orderBy(desc(transactions.date));
  }
  // Chandlers
  async getAllChandlers() {
    return await db.select().from(chandlers);
  }
  async getChandler(id) {
    const [chandler] = await db.select().from(chandlers).where(eq(chandlers.id, id));
    return chandler || void 0;
  }
  async createChandler(insertChandler) {
    const [chandler] = await db.insert(chandlers).values(insertChandler).returning();
    return chandler;
  }
  async updateChandler(id, chandlerData) {
    const [chandler] = await db.update(chandlers).set(chandlerData).where(eq(chandlers.id, id)).returning();
    return chandler;
  }
  async deleteChandler(id) {
    await db.delete(chandlers).where(eq(chandlers.id, id));
  }
  // Orders
  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || void 0;
  }
  async createOrder(insertOrder) {
    const orderCount = await db.select({ count: sql2`count(*)` }).from(orders);
    const orderNumber = `ORD-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(Number(orderCount[0].count) + 1).padStart(3, "0")}`;
    const [order] = await db.insert(orders).values({ ...insertOrder, orderNumber }).returning();
    return order;
  }
  async updateOrder(id, orderData) {
    const [order] = await db.update(orders).set(orderData).where(eq(orders.id, id)).returning();
    return order;
  }
  async deleteOrder(id) {
    await db.delete(orders).where(eq(orders.id, id));
  }
  // Order Items
  async getOrderItems(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  async createOrderItem(insertOrderItem) {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }
  async deleteOrderItems(orderId) {
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
  }
  // Bids
  async getBidsByOrder(orderId) {
    return await db.select().from(bids).where(eq(bids.orderId, orderId));
  }
  async getBid(id) {
    const [bid] = await db.select().from(bids).where(eq(bids.id, id));
    return bid || void 0;
  }
  async createBid(insertBid) {
    const [bid] = await db.insert(bids).values(insertBid).returning();
    return bid;
  }
  async updateBid(id, bidData) {
    const [bid] = await db.update(bids).set(bidData).where(eq(bids.id, id)).returning();
    return bid;
  }
  // Bid Items
  async getBidItems(bidId) {
    return await db.select().from(bidItems).where(eq(bidItems.bidId, bidId));
  }
  async createBidItem(insertBidItem) {
    const [bidItem] = await db.insert(bidItems).values(insertBidItem).returning();
    return bidItem;
  }
  // Invoices
  async getAllInvoices() {
    return await db.select().from(invoices).orderBy(desc(invoices.issueDate));
  }
  async getInvoice(id) {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || void 0;
  }
  async createInvoice(insertInvoice) {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }
  async updateInvoice(id, invoiceData) {
    const [invoice] = await db.update(invoices).set(invoiceData).where(eq(invoices.id, id)).returning();
    return invoice;
  }
  async getInvoicesByStatus(status) {
    return await db.select().from(invoices).where(eq(invoices.status, status));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/items", async (req, res) => {
    try {
      const items2 = await storage.getAllItems();
      res.json(items2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
  app2.get("/api/items/low-stock", async (req, res) => {
    try {
      const items2 = await storage.getLowStockItems();
      res.json(items2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });
  app2.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });
  app2.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create item" });
    }
  });
  app2.patch("/api/items/:id", async (req, res) => {
    try {
      const validatedData = updateItemSchema.parse(req.body);
      const item = await storage.updateItem(req.params.id, validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update item" });
    }
  });
  app2.delete("/api/items/:id", async (req, res) => {
    try {
      await storage.deleteItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const transactions2 = limit ? await storage.getRecentTransactions(limit) : await storage.getAllTransactions();
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/transactions/item/:itemId", async (req, res) => {
    try {
      const transactions2 = await storage.getTransactionsByItem(req.params.itemId);
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item transactions" });
    }
  });
  app2.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });
  app2.get("/api/chandlers", async (req, res) => {
    try {
      const chandlers2 = await storage.getAllChandlers();
      res.json(chandlers2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chandlers" });
    }
  });
  app2.get("/api/chandlers/:id", async (req, res) => {
    try {
      const chandler = await storage.getChandler(req.params.id);
      if (!chandler) {
        return res.status(404).json({ error: "Chandler not found" });
      }
      res.json(chandler);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chandler" });
    }
  });
  app2.post("/api/chandlers", async (req, res) => {
    try {
      const validatedData = insertChandlerSchema.parse(req.body);
      const chandler = await storage.createChandler(validatedData);
      res.status(201).json(chandler);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create chandler" });
    }
  });
  app2.patch("/api/chandlers/:id", async (req, res) => {
    try {
      const chandler = await storage.updateChandler(req.params.id, req.body);
      res.json(chandler);
    } catch (error) {
      res.status(500).json({ error: "Failed to update chandler" });
    }
  });
  app2.delete("/api/chandlers/:id", async (req, res) => {
    try {
      await storage.deleteChandler(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chandler" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders2 = await storage.getAllOrders();
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const orderItemsList = await storage.getOrderItems(req.params.id);
      const bids2 = await storage.getBidsByOrder(req.params.id);
      const bidsWithItems = await Promise.all(
        bids2.map(async (bid) => {
          const bidItemsList = await storage.getBidItems(bid.id);
          return { ...bid, items: bidItemsList };
        })
      );
      res.json({ ...order, items: orderItemsList, bids: bidsWithItems });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const { items: orderItemsList, ...orderData } = req.body;
      const validatedOrder = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedOrder);
      if (orderItemsList && Array.isArray(orderItemsList)) {
        await Promise.all(
          orderItemsList.map(
            (item) => storage.createOrderItem({ ...item, orderId: order.id })
          )
        );
      }
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });
  app2.patch("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });
  app2.delete("/api/orders/:id", async (req, res) => {
    try {
      await storage.deleteOrderItems(req.params.id);
      await storage.deleteOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });
  app2.get("/api/orders/:orderId/bids", async (req, res) => {
    try {
      const bids2 = await storage.getBidsByOrder(req.params.orderId);
      res.json(bids2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });
  app2.post("/api/bids", async (req, res) => {
    try {
      const { items: bidItemsList, ...bidData } = req.body;
      const bid = await storage.createBid(bidData);
      if (bidItemsList && Array.isArray(bidItemsList)) {
        await Promise.all(
          bidItemsList.map(
            (item) => storage.createBidItem({ ...item, bidId: bid.id })
          )
        );
      }
      res.status(201).json(bid);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bid" });
    }
  });
  app2.patch("/api/bids/:id", async (req, res) => {
    try {
      const bid = await storage.updateBid(req.params.id, req.body);
      res.json(bid);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bid" });
    }
  });
  app2.get("/api/invoices", async (req, res) => {
    try {
      const invoices2 = await storage.getAllInvoices();
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });
  app2.post("/api/invoices", async (req, res) => {
    try {
      const invoice = await storage.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });
  app2.patch("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.updateInvoice(req.params.id, req.body);
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to update invoice" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const safeUsers = users2.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  app2.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "build"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "7254", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
