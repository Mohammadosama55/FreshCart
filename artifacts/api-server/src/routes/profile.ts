import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateAddressBody,
  CreateAddressResponse,
  DeleteAddressQueryParams,
  GetProfileQueryParams,
  GetProfileResponse,
  UpdateAddressBody,
  UpdateAddressParams,
  UpdateAddressResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";
import {
  db,
  freshcartAddressesTable,
  freshcartProfilesTable,
} from "@workspace/db";

const router: IRouter = Router();

type ProfileRecord = typeof freshcartProfilesTable.$inferSelect;

async function getProfile(clientId: string): Promise<ProfileRecord | undefined> {
  const [profile] = await db
    .select()
    .from(freshcartProfilesTable)
    .where(eq(freshcartProfilesTable.id, clientId));
  return profile;
}

async function getAddresses(clientId: string) {
  const addresses = await db
    .select()
    .from(freshcartAddressesTable)
    .where(eq(freshcartAddressesTable.clientId, clientId));
  return addresses.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

async function profileResponse(clientId: string) {
  const profile = await getProfile(clientId);
  const addresses = await getAddresses(clientId);
  return GetProfileResponse.parse({
    clientId,
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    addresses,
  });
}

async function ensureProfile(clientId: string) {
  await db
    .insert(freshcartProfilesTable)
    .values({ id: clientId, name: "", phone: "" })
    .onConflictDoNothing();
}

router.get("/profile", async (req, res): Promise<void> => {
  const parsed = GetProfileQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  res.json(await profileResponse(parsed.data.clientId));
});

router.put("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = parsed.data;
  await db
    .insert(freshcartProfilesTable)
    .values({ id: input.clientId, name: input.name, phone: input.phone })
    .onConflictDoUpdate({
      target: freshcartProfilesTable.id,
      set: { name: input.name, phone: input.phone, updatedAt: new Date() },
    });

  res.json(UpdateProfileResponse.parse(await profileResponse(input.clientId)));
});

router.post("/profile/addresses", async (req, res): Promise<void> => {
  const parsed = CreateAddressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = parsed.data;
  await ensureProfile(input.clientId);
  const existing = await getAddresses(input.clientId);
  const shouldBeDefault = input.isDefault === true || existing.length === 0;

  if (shouldBeDefault && existing.length > 0) {
    await db
      .update(freshcartAddressesTable)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(freshcartAddressesTable.clientId, input.clientId));
  }

  const [created] = await db
    .insert(freshcartAddressesTable)
    .values({
      id: randomUUID(),
      clientId: input.clientId,
      label: input.label,
      address: input.address,
      isDefault: shouldBeDefault,
    })
    .returning();

  res.status(201).json(CreateAddressResponse.parse(created));
});

router.patch("/profile/addresses/:addressId", async (req, res): Promise<void> => {
  const params = UpdateAddressParams.safeParse(req.params);
  const body = UpdateAddressBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(freshcartAddressesTable)
    .where(
      and(
        eq(freshcartAddressesTable.id, params.data.addressId),
        eq(freshcartAddressesTable.clientId, body.data.clientId),
      ),
    );
  if (!existing[0]) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  if (body.data.isDefault === true) {
    await db
      .update(freshcartAddressesTable)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(freshcartAddressesTable.clientId, body.data.clientId));
  }

  const [updated] = await db
    .update(freshcartAddressesTable)
    .set({
      ...(body.data.label !== undefined ? { label: body.data.label } : {}),
      ...(body.data.address !== undefined ? { address: body.data.address } : {}),
      ...(body.data.isDefault !== undefined ? { isDefault: body.data.isDefault } : {}),
      updatedAt: new Date(),
    })
    .where(eq(freshcartAddressesTable.id, params.data.addressId))
    .returning();

  res.json(UpdateAddressResponse.parse(updated));
});

router.delete("/profile/address", async (req, res): Promise<void> => {
  const params = DeleteAddressQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const deleted = await db
    .delete(freshcartAddressesTable)
    .where(
      and(
        eq(freshcartAddressesTable.id, params.data.addressId),
        eq(freshcartAddressesTable.clientId, params.data.clientId),
      ),
    )
    .returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  if (deleted[0].isDefault) {
    const [nextDefault] = await db
      .select()
      .from(freshcartAddressesTable)
      .where(eq(freshcartAddressesTable.clientId, deleted[0].clientId))
      .limit(1);
    if (nextDefault) {
      await db
        .update(freshcartAddressesTable)
        .set({ isDefault: true, updatedAt: new Date() })
        .where(eq(freshcartAddressesTable.id, nextDefault.id));
    }
  }

  res.sendStatus(204);
});

export default router;