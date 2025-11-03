// Temporary mock data to simulate backend response for halls
// Replace or remove when backend endpoint is wired up.

export type Hall = { id: string; label: string };

export const halls: Hall[] = [
  { id: "hall-1", label: "Hall A" },
  { id: "hall-2", label: "Hall B" },
  { id: "hall-3", label: "Hall C" },
  { id: "hall-4", label: "Hall D" },
  { id: "hall-5", label: "Hall E" },
  { id: "hall-6", label: "Hall F" },
  { id: "hall-7", label: "Hall G" },
  { id: "hall-8", label: "Hall H" },
  { id: "hall-9", label: "Hall I" },
  { id: "hall-10", label: "Hall J" },
  { id: "hall-11", label: "Hall K" },
  { id: "hall-12", label: "Hall L" },
  { id: "hall-13", label: "Hall M" },
  { id: "hall-14", label: "Hall N" },
  { id: "hall-15", label: "Hall O" },
  { id: "hall-16", label: "Hall P" },
  { id: "hall-17", label: "Hall Q" },
];

export type Stall = { id: string; hallId: string; label: string };
export const stalls: Stall[] = [
  { id: "stall-1", hallId: "hall-1", label: "Stall 1" },
  { id: "stall-2", hallId: "hall-1", label: "Stall 2" },
  { id: "stall-3", hallId: "hall-2", label: "Stall 3" },
  { id: "stall-4", hallId: "hall-2", label: "Stall 4" },
  { id: "stall-5", hallId: "hall-3", label: "Stall 5" },
  { id: "stall-6", hallId: "hall-3", label: "Stall 6" },
  { id: "stall-7", hallId: "hall-4", label: "Stall 7" },
  { id: "stall-8", hallId: "hall-4", label: "Stall 8" },
  { id: "stall-9", hallId: "hall-5", label: "Stall 9" },
  { id: "stall-10", hallId: "hall-5", label: "Stall 10" },
  { id: "stall-11", hallId: "hall-6", label: "Stall 11" },
  { id: "stall-12", hallId: "hall-6", label: "Stall 12" },
  { id: "stall-13", hallId: "hall-7", label: "Stall 13" },
  { id: "stall-14", hallId: "hall-7", label: "Stall 14" },
  { id: "stall-15", hallId: "hall-8", label: "Stall 15" },
  { id: "stall-16", hallId: "hall-8", label: "Stall 16" },
  { id: "stall-17", hallId: "hall-9", label: "Stall 17" },
  { id: "stall-18", hallId: "hall-9", label: "Stall 18" },
  { id: "stall-19", hallId: "hall-10", label: "Stall 19" },
  { id: "stall-20", hallId: "hall-10", label: "Stall 20" },
];
