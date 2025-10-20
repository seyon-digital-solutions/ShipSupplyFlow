import { 
  users, items, transactions, chandlers, orders, orderItems, bids, bidItems, invoices,
  type User, type InsertUser,
  type Item, type InsertItem, type UpdateItem,
  type Transaction, type InsertTransaction,
  type Chandler, type InsertChandler,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Bid, type InsertBid,
  type BidItem, type InsertBidItem,
  type Invoice, type InsertInvoice
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, lt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Items
  getAllItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item>;
  deleteItem(id: string): Promise<void>;
  getLowStockItems(): Promise<Item[]>;
  getItemsByCategory(category: string): Promise<Item[]>;

  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getRecentTransactions(limit: number): Promise<Transaction[]>;
  getTransactionsByItem(itemId: string): Promise<Transaction[]>;

  // Chandlers
  getAllChandlers(): Promise<Chandler[]>;
  getChandler(id: string): Promise<Chandler | undefined>;
  createChandler(chandler: InsertChandler): Promise<Chandler>;
  updateChandler(id: string, chandler: Partial<InsertChandler>): Promise<Chandler>;
  deleteChandler(id: string): Promise<void>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  deleteOrderItems(orderId: string): Promise<void>;

  // Bids
  getBidsByOrder(orderId: string): Promise<Bid[]>;
  getBid(id: string): Promise<Bid | undefined>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: string, bid: Partial<InsertBid>): Promise<Bid>;

  // Bid Items
  getBidItems(bidId: string): Promise<BidItem[]>;
  createBidItem(bidItem: InsertBidItem): Promise<BidItem>;

  // Invoices
  getAllInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  getInvoicesByStatus(status: string): Promise<Invoice[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const dataToUpdate = { ...userData };
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }
    const [user] = await db
      .update(users)
      .set(dataToUpdate)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Items
  async getAllItems(): Promise<Item[]> {
    return await db.select().from(items).orderBy(desc(items.lastUpdated));
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db
      .insert(items)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateItem(id: string, itemData: UpdateItem): Promise<Item> {
    const [item] = await db
      .update(items)
      .set({ ...itemData, lastUpdated: new Date() })
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  async getLowStockItems(): Promise<Item[]> {
    return await db
      .select()
      .from(items)
      .where(sql`${items.currentStock} < ${items.minimumStock}`)
      .orderBy(sql`(${items.currentStock}::float / ${items.minimumStock}::float)`);
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.category, category));
  }

  // Transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();

    // Update item stock
    const item = await this.getItem(insertTransaction.itemId);
    if (item) {
      const newStock = insertTransaction.type === "in" 
        ? item.currentStock + insertTransaction.quantity
        : item.currentStock - insertTransaction.quantity;
      
      await this.updateItem(insertTransaction.itemId, { currentStock: newStock });
    }

    return transaction;
  }

  async getRecentTransactions(limit: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async getTransactionsByItem(itemId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.itemId, itemId))
      .orderBy(desc(transactions.date));
  }

  // Chandlers
  async getAllChandlers(): Promise<Chandler[]> {
    return await db.select().from(chandlers);
  }

  async getChandler(id: string): Promise<Chandler | undefined> {
    const [chandler] = await db.select().from(chandlers).where(eq(chandlers.id, id));
    return chandler || undefined;
  }

  async createChandler(insertChandler: InsertChandler): Promise<Chandler> {
    const [chandler] = await db
      .insert(chandlers)
      .values(insertChandler)
      .returning();
    return chandler;
  }

  async updateChandler(id: string, chandlerData: Partial<InsertChandler>): Promise<Chandler> {
    const [chandler] = await db
      .update(chandlers)
      .set(chandlerData)
      .where(eq(chandlers.id, id))
      .returning();
    return chandler;
  }

  async deleteChandler(id: string): Promise<void> {
    await db.delete(chandlers).where(eq(chandlers.id, id));
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // Generate order number
    const orderCount = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Number(orderCount[0].count) + 1).padStart(3, '0')}`;
    
    const [order] = await db
      .insert(orders)
      .values({ ...insertOrder, orderNumber })
      .returning();
    return order;
  }

  async updateOrder(id: string, orderData: Partial<InsertOrder>): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set(orderData)
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db
      .insert(orderItems)
      .values(insertOrderItem)
      .returning();
    return orderItem;
  }

  async deleteOrderItems(orderId: string): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Bids
  async getBidsByOrder(orderId: string): Promise<Bid[]> {
    return await db.select().from(bids).where(eq(bids.orderId, orderId));
  }

  async getBid(id: string): Promise<Bid | undefined> {
    const [bid] = await db.select().from(bids).where(eq(bids.id, id));
    return bid || undefined;
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const [bid] = await db
      .insert(bids)
      .values(insertBid)
      .returning();
    return bid;
  }

  async updateBid(id: string, bidData: Partial<InsertBid>): Promise<Bid> {
    const [bid] = await db
      .update(bids)
      .set(bidData)
      .where(eq(bids.id, id))
      .returning();
    return bid;
  }

  // Bid Items
  async getBidItems(bidId: string): Promise<BidItem[]> {
    return await db.select().from(bidItems).where(eq(bidItems.bidId, bidId));
  }

  async createBidItem(insertBidItem: InsertBidItem): Promise<BidItem> {
    const [bidItem] = await db
      .insert(bidItems)
      .values(insertBidItem)
      .returning();
    return bidItem;
  }

  // Invoices
  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.issueDate));
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();
    return invoice;
  }

  async updateInvoice(id: string, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set(invoiceData)
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  async getInvoicesByStatus(status: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.status, status));
  }
}

export const storage = new DatabaseStorage();
