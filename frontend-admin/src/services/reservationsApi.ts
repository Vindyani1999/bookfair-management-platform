/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

export async function fetchReservations(query?: Record<string, any>) {
  const url = "/reservation";
  const resp = await api.get(url, { params: query });
  return resp.data;
}
