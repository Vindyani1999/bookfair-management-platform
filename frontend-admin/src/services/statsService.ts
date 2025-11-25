/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchHalls } from "./hallsApi";
import { fetchStallsByHall } from "./stallsApi";
import { fetchReservations } from "./reservationsApi";

export type Stats = {
  totalStalls: number;
  reservedStalls: number; // unique stalls reserved
  reservedReservations: number; // number of reservation records
  availableStalls: number;
  perHall?: Record<
    string,
    { total: number; reserved: number; available: number }
  >;
};

function normalizeReservationStallIds(r: any): string[] {
  if (!r) return [];
  const raw =
    r.stallIds ?? r.stall ?? r.stalls ?? r.stall_id ?? r.stallId ?? null;
  const out: string[] = [];
  if (Array.isArray(raw)) {
    for (const it of raw) {
      if (it == null) continue;
      if (typeof it === "object") out.push(String(it.id ?? it._id ?? it));
      else out.push(String(it));
    }
    return out;
  }
  if (typeof raw === "string") {
    const parts = raw.split(/\s*,\s*/).filter(Boolean);
    for (const p of parts) out.push(p);
    return out;
  }
  // single numeric or other
  if (raw != null) return [String(raw)];
  return out;
}

/**
 * Compute stats from arrays of stalls and reservations. Does not call any API.
 */
export function computeStatsFromData(
  stalls: any[],
  reservations: any[]
): Stats {
  const totalStalls = Array.isArray(stalls) ? stalls.length : 0;
  const reservedSet = new Set<string>();
  const records = Array.isArray(reservations) ? reservations : [];
  for (const r of records) {
    const ids = normalizeReservationStallIds(r);
    for (const id of ids) reservedSet.add(String(id));
  }
  const reservedStalls = reservedSet.size;
  const reservedReservations = records.length;
  const availableStalls = Math.max(0, totalStalls - reservedStalls);
  return {
    totalStalls,
    reservedStalls,
    reservedReservations,
    availableStalls,
  };
}

/**
 * Fetch halls, stalls (per-hall) and reservations then compute aggregate stats.
 * This will make several API calls and may be slow for many halls.
 */
export async function computeStatsFromApis(): Promise<Stats> {
  // fetch halls first
  const halls = Array.isArray(await fetchHalls()) ? await fetchHalls() : [];
  // fetch stalls per hall
  const perHall: Record<
    string,
    { total: number; reserved: number; available: number }
  > = {};
  let allStalls: any[] = [];

  await Promise.all(
    halls.map(async (h: any) => {
      try {
        const data = await fetchStallsByHall(h.id);
        let stalls: any[] = [];
        if (Array.isArray(data)) stalls = data;
        else if (Array.isArray(data.stalls)) stalls = data.stalls;
        else if (Array.isArray(data.data?.stalls)) stalls = data.data.stalls;
        else if (Array.isArray(data.results)) stalls = data.results;
        perHall[h.id] = {
          total: stalls.length,
          reserved: 0,
          available: stalls.length,
        };
        allStalls = allStalls.concat(
          stalls.map((s) => ({ ...s, hallId: h.id }))
        );
      } catch (err) {
        perHall[h.id] = { total: 0, reserved: 0, available: 0 };
      }
    })
  );

  // fetch reservations
  const reservations = Array.isArray(await fetchReservations())
    ? await fetchReservations()
    : [];

  // compute reserved stalls set
  const reservedSet = new Set<string>();
  for (const r of reservations) {
    const ids = normalizeReservationStallIds(r);
    for (const id of ids) reservedSet.add(String(id));
  }

  // map reserved counts per hall if possible (try to match stall id to hallId if stall objects contain hallId or we can search in allStalls)
  const stallIdToHall: Record<string, string | undefined> = {};
  for (const s of allStalls) {
    const sid = String(s.id ?? s._id ?? s.code ?? s.label ?? s.name ?? s);
    stallIdToHall[sid] = s.hallId ?? s.hall ?? undefined;
  }

  for (const rs of Array.from(reservedSet)) {
    const h = stallIdToHall[rs];
    if (h && perHall[h]) {
      perHall[h].reserved = (perHall[h].reserved || 0) + 1;
      perHall[h].available = Math.max(
        0,
        perHall[h].total - perHall[h].reserved
      );
    }
  }

  const totalStalls = allStalls.length;
  const reservedStalls = reservedSet.size;
  const reservedReservations = Array.isArray(reservations)
    ? reservations.length
    : 0;
  const availableStalls = Math.max(0, totalStalls - reservedStalls);

  return {
    totalStalls,
    reservedStalls,
    reservedReservations,
    availableStalls,
    perHall,
  };
}

export default {
  computeStatsFromData,
  computeStatsFromApis,
};
