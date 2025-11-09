import { useState } from "react";
import Image from "../atoms/MapImage";
import { stalls, halls, hallMapImages } from "../../utils/data";
import SelectionSummary from "./SelectionSummary";
import StallList from "../molecules/StallList";
import "../../App.css";

type Props = {
  /** Hall ids selected in the previous step; if provided, only stalls in these halls are shown */
  selectedHallIds?: string[];
  /** Optional map image src to use instead of the default or hall-specific image */
  mapSrc?: string;
  /** Controlled selection map (optional). If provided, the component becomes controlled. */
  selected?: Record<string, boolean>;
  /** Called when a stall checkbox is toggled (controlled mode) */
  onToggle?: (id: string, checked: boolean) => void;
};

export default function MapWithStalls({
  selectedHallIds,
  selected: controlledSelected,
  onToggle: controlledOnToggle,
  mapSrc,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<Record<string, boolean>>({});
  const selected = controlledSelected ?? internalSelected;
  const [zoom, setZoom] = useState<number>(1);

  // If previous step passed selected halls, only show stalls for those halls.
  const visibleStalls =
    selectedHallIds && selectedHallIds.length > 0
      ? stalls.filter((s) => selectedHallIds.includes(s.hallId))
      : stalls;

  const allStalls = visibleStalls.map((s) => ({ id: s.id, label: s.label }));
  const selectedStalls = allStalls.filter((h) => selected[h.id]);

  // Also derive a small context label for the header from halls data
  const selectedHallLabels = (selectedHallIds || [])
    .map((id) => halls.find((h) => h.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  // Prefer explicit mapSrc prop (e.g., provided by backend). If not provided
  // and exactly one hall was selected, try hall-specific image. Otherwise
  // fall back to the overview map. An explicit `mapSrc` prop overrides all.
  const chosenHallSrc =
    mapSrc ||
    ((selectedHallIds &&
      selectedHallIds.length === 1 &&
      hallMapImages[selectedHallIds[0]]) ||
    "/images/map.png");

  function onToggle(id: string, checked: boolean) {
    if (controlledOnToggle) return controlledOnToggle(id, checked);
    setInternalSelected((s) => ({ ...s, [id]: checked }));
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
      <div style={{ flex: "1 1 0" }}>
        <SelectionSummary selectedHalls={selectedStalls} />
        {/* Map canvas: includes image and zoom controls */}
        <div className="map-canvas">
          <div className="zoom-controls" aria-hidden>
            <button
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
              disabled={zoom >= 2}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
              disabled={zoom <= 0.5}
              aria-label="Zoom out"
            >
              −
            </button>
          </div>

          <div
            className="map-viewport"
            style={{ overflow: "hidden", height: "100%" }}
          >
            <div className="map-inner" style={{ transform: `scale(${zoom})` }}>
              <Image
                src={chosenHallSrc}
                alt={`Bookfair hall ${selectedHallLabels}`}
                style={{ height: "90%" }}
              />
            </div>
          </div>
        </div>
      </div>
      <aside className="map-panel">
        <h3 className="map-panel__title">
          Select available stalls{" "}
          {selectedHallLabels ? `in ${selectedHallLabels}` : ""}
        </h3>
        <StallList
          stalls={visibleStalls}
          selected={selected}
          onToggle={onToggle}
        />
        {/* Navigation (Next/Back) is handled by the parent stepper component */}
      </aside>
    </div>
  );
}
