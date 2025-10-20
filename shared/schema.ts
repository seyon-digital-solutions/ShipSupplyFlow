import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("staff"),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minimumStock: integer("minimum_stock").notNull().default(0),
  location: text("location").notNull(),
  description: text("description"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  remarks: text("remarks"),
});

export const chandlers = pgTable("chandlers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  requiredDate: timestamp("required_date").notNull(),
  notes: text("notes"),
  selectedChandlerId: varchar("selected_chandler_id"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  itemId: varchar("item_id").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
});

export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  chandlerId: varchar("chandler_id").notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
});

export const bidItems = pgTable("bid_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bidId: varchar("bid_id").notNull(),
  orderItemId: varchar("order_item_id").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  availability: text("availability").notNull().default("in-stock"),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  orderId: varchar("order_id").notNull(),
  chandlerId: varchar("chandler_id").notNull(),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("unpaid"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).notNull().default(sql`0`),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  lastUpdated: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertChandlerSchema = createInsertSchema(chandlers).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  submittedAt: true,
});

export const insertBidItemSchema = createInsertSchema(bidItems).omit({
  id: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  issueDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertChandler = z.infer<typeof insertChandlerSchema>;
export type Chandler = typeof chandlers.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBidItem = z.infer<typeof insertBidItemSchema>;
export type BidItem = typeof bidItems.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
