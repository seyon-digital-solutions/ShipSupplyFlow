import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, updateItemSchema, insertTransactionSchema, insertChandlerSchema, insertOrderSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Items routes
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/items/low-stock", async (req, res) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
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

  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const validatedData = updateItemSchema.parse(req.body);
      const item = await storage.updateItem(req.params.id, validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      await storage.deleteItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = limit 
        ? await storage.getRecentTransactions(limit)
        : await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/item/:itemId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByItem(req.params.itemId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Chandlers routes
  app.get("/api/chandlers", async (req, res) => {
    try {
      const chandlers = await storage.getAllChandlers();
      res.json(chandlers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chandlers" });
    }
  });

  app.get("/api/chandlers/:id", async (req, res) => {
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

  app.post("/api/chandlers", async (req, res) => {
    try {
      const validatedData = insertChandlerSchema.parse(req.body);
      const chandler = await storage.createChandler(validatedData);
      res.status(201).json(chandler);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create chandler" });
    }
  });

  app.patch("/api/chandlers/:id", async (req, res) => {
    try {
      const chandler = await storage.updateChandler(req.params.id, req.body);
      res.json(chandler);
    } catch (error) {
      res.status(500).json({ error: "Failed to update chandler" });
    }
  });

  app.delete("/api/chandlers/:id", async (req, res) => {
    try {
      await storage.deleteChandler(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chandler" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const orderItemsList = await storage.getOrderItems(req.params.id);
      const bids = await storage.getBidsByOrder(req.params.id);
      
      // Fetch bid items for each bid
      const bidsWithItems = await Promise.all(
        bids.map(async (bid) => {
          const bidItemsList = await storage.getBidItems(bid.id);
          return { ...bid, items: bidItemsList };
        })
      );

      res.json({ ...order, items: orderItemsList, bids: bidsWithItems });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { items: orderItemsList, ...orderData } = req.body;
      const validatedOrder = insertOrderSchema.parse(orderData);
      
      const order = await storage.createOrder(validatedOrder);
      
      // Create order items
      if (orderItemsList && Array.isArray(orderItemsList)) {
        await Promise.all(
          orderItemsList.map((item: any) => 
            storage.createOrderItem({ ...item, orderId: order.id })
          )
        );
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      await storage.deleteOrderItems(req.params.id);
      await storage.deleteOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Bids routes
  app.get("/api/orders/:orderId/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsByOrder(req.params.orderId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });

  app.post("/api/bids", async (req, res) => {
    try {
      const { items: bidItemsList, ...bidData } = req.body;
      const bid = await storage.createBid(bidData);
      
      if (bidItemsList && Array.isArray(bidItemsList)) {
        await Promise.all(
          bidItemsList.map((item: any) => 
            storage.createBidItem({ ...item, bidId: bid.id })
          )
        );
      }
      
      res.status(201).json(bid);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bid" });
    }
  });

  app.patch("/api/bids/:id", async (req, res) => {
    try {
      const bid = await storage.updateBid(req.params.id, req.body);
      res.json(bid);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bid" });
    }
  });

  // Invoices routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
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

  app.post("/api/invoices", async (req, res) => {
    try {
      const invoice = await storage.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  app.patch("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.updateInvoice(req.params.id, req.body);
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to update invoice" });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      // Remove password from response
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
