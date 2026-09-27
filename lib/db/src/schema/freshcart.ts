import { boolean, integer, jsonb, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const freshcartProfilesTable = pgTable("freshcart_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const freshcartAddressesTable = pgTable("freshcart_addresses", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => freshcartProfilesTable.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  address: text("address").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const freshcartOrdersTable = pgTable("freshcart_orders", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => freshcartProfilesTable.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("confirmed"),
  eta: text("eta").notNull(),
  items: jsonb("items").$type<Array<{ productId: string; quantity: number }>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertFreshcartProfileSchema = createInsertSchema(freshcartProfilesTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertFreshcartAddressSchema = createInsertSchema(freshcartAddressesTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertFreshcartOrderSchema = createInsertSchema(freshcartOrdersTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type FreshcartProfile = z.infer<typeof insertFreshcartProfileSchema>;
export type FreshcartAddress = z.infer<typeof insertFreshcartAddressSchema>;
export type FreshcartOrder = z.infer<typeof insertFreshcartOrderSchema>;