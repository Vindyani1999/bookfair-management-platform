/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
export type ApiHall = { id: string; label?: string; name?: string };

function normalizeHallList(body: any): any[] {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.halls)) return body.halls;
  if (Array.isArray(body.results)) return body.results;
  const arr = Object.values(body).find((v) => Array.isArray(v));
  if (Array.isArray(arr)) return arr as any[];
  return [];
}

export async function fetchHalls(): Promise<ApiHall[]> {
  const resp = await api.get("/hall");
  const body = resp.data;
  const list = normalizeHallList(body);
  return list.map((it: any) => ({
    id: String(it.id || it._id || it.code || it.slug || it.name || it.label),
    label: it.label || it.name || it.title || String(it.id),
  }));
}

export async function fetchHall(id: string): Promise<any> {
  const resp = await api.get(`/hall/${encodeURIComponent(id)}`);
  return resp.data;
}

export async function updateHall(id: string, payload: Record<string, any>) {
  try {
    const resp = await api.put(`/hall/${encodeURIComponent(id)}`, payload);
    return resp.data;
  } catch (err: any) {
    // surface server response for easier debugging
    const resp = err?.response;
    const status = resp?.status;
    const data = resp?.data;
    console.error("updateHall failed", { id, payload, status, data, err });
    const message =
      data && typeof data === "object"
        ? JSON.stringify(data)
        : String(data || err?.message || err);
    const e = new Error(`updateHall failed: ${status || "error"} - ${message}`);
    // attach original response for callers who want to inspect
    (e as any).status = status;
    (e as any).response = resp;
    throw e;
  }
}

export async function uploadHallImage(id: string, file: File) {
  const fd = new FormData();
  fd.append("image", file);
  // If backend expects a multipart field name other than 'image', adjust accordingly.
  try {
    const resp = await api.post(`/hall/${encodeURIComponent(id)}/image`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  } catch (err: any) {
    const resp = err?.response;
    const status = resp?.status;
    const data = resp?.data;
    console.error("uploadHallImage failed", { id, status, data, err });
    const message =
      data && typeof data === "object"
        ? JSON.stringify(data)
        : String(data || err?.message || err);
    const e = new Error(
      `uploadHallImage failed: ${status || "error"} - ${message}`
    );
    (e as any).status = status;
    (e as any).response = resp;
    throw e;
  }
}
