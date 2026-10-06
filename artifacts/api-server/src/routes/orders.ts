import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderQueryParams,
  GetOrderResponse,
  ListOrdersQueryParams,
  ListOrdersResponse,
} from "@workspace/api-zod";
import { db, freshcartOrdersTable, freshcartProfilesTable } from "@workspace/db";
import { products } from "./catalog";

const router: IRouter = Router();

type OrderRecord = typeof freshcartOrdersTable.$inferSelect;

function getCurrentStatus(order: OrderRecord): { status: string; eta: string } {
  const elapsedMs = Date.now() - order.createdAt.getTime();

  if (elapsedMs >= 180_000) return { status: "delivered", eta: "Delivered" };
  if (elapsedMs >= 90_000) return { status: "out_for_delivery", eta: "Arriving now" };
  if (elapsedMs >= 45_000) return { status: "packing", eta: "Around 15 min" };
  return { status: "confirmed", eta: "20–30 min" };
}

function toOrderResponse(order: OrderRecord) {
  const tracking = getCurrentStatus(order);
  return GetOrderResponse.parse({
    id: order.id,
    clientId: order.clientId,
    items: order.items,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    status: tracking.status,
    total: order.total,
    eta: tracking.eta,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
  });
}

async function ensureProfile(clientId: string, name: string, phone: string) {
  await db
    .insert(freshcartProfilesTable)
    .values({ id: clientId, name, phone })
    .onConflictDoUpdate({
      target: freshcartProfilesTable.id,
      set: { name, phone, updatedAt: new Date() },
    });
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = parsed.data;
  const total = input.items.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  await ensureProfile(input.clientId, input.customerName, input.phone);
  const [created] = await db
    .insert(freshcartOrdersTable)
    .values({
      id: `FC-${randomUUID().slice(0, 8).toUpperCase()}`,
      clientId: input.clientId,
      customerName: input.customerName,
      phone: input.phone,
      address: input.address,
      paymentMethod: input.paymentMethod,
      total,
      status: "confirmed",
      eta: "20–30 min",
      items: input.items,
    })
    .returning();

  res.status(201).json(CreateOrderResponse.parse(toOrderResponse(created)));
});

router.get("/orders", async (req, res): Promise<void> => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const orders = await db
    .select()
    .from(freshcartOrdersTable)
    .where(eq(freshcartOrdersTable.clientId, parsed.data.clientId))
    .orderBy(desc(freshcartOrdersTable.createdAt));

  res.json(ListOrdersResponse.parse(orders.map(toOrderResponse)));
});

router.get("/order", async (req, res): Promise<void> => {
  const parsed = GetOrderQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(freshcartOrdersTable)
    .where(
      and(
        eq(freshcartOrdersTable.id, parsed.data.orderId),
        eq(freshcartOrdersTable.clientId, parsed.data.clientId),
      ),
    );

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(toOrderResponse(order)));
});

export default router;