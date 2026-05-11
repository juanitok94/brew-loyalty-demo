import { STAMPS_REQUIRED } from "@/lib/constants";

export type CustomerRecord = {
  stamps: number;
  lastVisit: string;
  redeemed: number;
  name: string | null;
};

type Entry = {
  phone: string;
  name: string | null;
  stamps: number;
  redeemed: number;
  lastVisit: string;
};

// In-memory store — persists for the lifetime of the server process (demo mode).
export const store = new Map<string, Entry>();

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function toRecord(entry: Entry): CustomerRecord {
  return { stamps: entry.stamps, lastVisit: entry.lastVisit, redeemed: entry.redeemed, name: entry.name };
}

export async function getCustomer(phone: string): Promise<CustomerRecord | null> {
  const entry = store.get(normalizePhone(phone));
  return entry ? toRecord(entry) : null;
}

export async function upsertCustomer(phone: string, name?: string): Promise<CustomerRecord> {
  const key = normalizePhone(phone);
  const existing = store.get(key);
  if (existing) {
    if (name?.trim() && existing.name !== name.trim()) existing.name = name.trim();
    return toRecord(existing);
  }
  const entry: Entry = { phone: key, name: name?.trim() ?? null, stamps: 0, redeemed: 0, lastVisit: today() };
  store.set(key, entry);
  return toRecord(entry);
}

export async function addStamp(phone: string): Promise<CustomerRecord> {
  const key = normalizePhone(phone);
  const entry = store.get(key) ?? { phone: key, name: null, stamps: 0, redeemed: 0, lastVisit: today() };
  entry.stamps += 1;
  entry.lastVisit = today();
  store.set(key, entry);
  return toRecord(entry);
}

export async function removeStamp(phone: string): Promise<CustomerRecord | null> {
  const key = normalizePhone(phone);
  const entry = store.get(key);
  if (!entry || entry.stamps <= 0) return null;
  entry.stamps = Math.max(0, entry.stamps - 1);
  store.set(key, entry);
  return toRecord(entry);
}

export async function redeemReward(phone: string): Promise<CustomerRecord | null> {
  const key = normalizePhone(phone);
  const entry = store.get(key);
  if (!entry || entry.stamps < STAMPS_REQUIRED) return null;
  entry.stamps = 0;
  entry.redeemed += 1;
  entry.lastVisit = today();
  store.set(key, entry);
  return toRecord(entry);
}
