/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

export async function updateStall(id: string, payload: Record<string, any>) {
  try {
    const resp = await api.put(`/stall/${encodeURIComponent(id)}`, payload);
    return resp.data;
  } catch (err: any) {
    const resp = err?.response;
    const status = resp?.status;
    const data = resp?.data;
    console.error("updateStall failed", { id, payload, status, data, err });
    const message =
      data && typeof data === "object"
        ? JSON.stringify(data)
        : String(data || err?.message || err);
    const e = new Error(
      `updateStall failed: ${status || "error"} - ${message}`
    );
    (e as any).status = status;
    (e as any).response = resp;
    throw e;
  }
}

export async function deleteStall(id: string) {
  const resp = await api.delete(`/stall/${encodeURIComponent(id)}`);
  return resp.data;
}

export async function createStall(payload: Record<string, any>) {
  const resp = await api.post(`/stall`, payload);
  return resp.data;
}
