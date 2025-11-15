// Admin-local data for halls and maps. Keeps admin UI independent from frontend-user while
// pointing to public assets under /images/halls/*.png. Replace with API wiring when ready.
export type Hall = { id: string; label: string };
export const halls: Hall[] = [
  { id: "hall-1", label: "Hall A" },
  { id: "hall-2", label: "Hall B" },
  { id: "hall-3", label: "Hall C" },
  { id: "hall-4", label: "Hall D" },
  { id: "hall-5", label: "Hall E" },
];

export type Stall = { id: string; hallId: string; label: string };
export const stalls: Stall[] = [
  { id: "stall-1", hallId: "hall-1", label: "Stall 1" },
  { id: "stall-2", hallId: "hall-1", label: "Stall 2" },
  { id: "stall-3", hallId: "hall-2", label: "Stall 3" },
  { id: "stall-4", hallId: "hall-2", label: "Stall 4" },
  { id: "stall-5", hallId: "hall-3", label: "Stall 5" },
];

// Map images referenced from the admin app public folder: /public/images/halls/{id}.png
// Ensure images exist there or update the paths to external URLs.
// Explicit map image paths. Keeping them explicit helps editors and bundlers find the assets
// and makes it easier to adjust individual paths or swap specific halls to external URLs.
export const hallMapImages: Record<string, string> = {
  "hall-A": "/maps/hallA.png",
  "hall-B": "/maps/hallB.png",
  "hall-C": "/maps/hallC.png",
  "hall-D": "/maps/hallD.png",
  "hall-E": "/maps/hallE.png",
};

// Optional thumbnails (if you want smaller versions for previews). Point these to
// /maps/thumbs/{id}.png if you add them to public, otherwise they will fall back
// to the full image in the app code.
export const hallMapThumbnails: Record<string, string> = {
  "hall-1": "/maps/hall-1.png",
  "hall-2": "/maps/hall-2.png",
  "hall-3": "/maps/hall-3.png",
  "hall-4": "/maps/hall-4.png",
  "hall-5": "/maps/hall-5.png",
};

export default { halls, stalls, hallMapImages, hallMapThumbnails };
