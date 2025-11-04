import { useState } from "react";
import Image from "../atoms/MapImage";
import { stalls, halls, hallMapImages } from "../../utils/data";
import SelectionSummary from "./SelectionSummary";
import StallList from "../molecules/StallList";

type Props = {
  /** Hall ids selected in the previous step; if provided, only stalls in these halls are shown */
  selectedHallIds?: string[];
  /** Optional map image src to use instead of the default or hall-specific image */
  mapSrc?: string;
  /** Called when user finishes stall selection and wants to go to next step */
  onNext?: (selectedStallIds: string[]) => void;
};

export default function MapWithStalls({ selectedHallIds, onNext }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
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
  // fall back to the overview map.
  const chosenHallSrc =
    (selectedHallIds &&
      selectedHallIds.length === 1 &&
      hallMapImages[selectedHallIds[0]]) ||
    "/images/map.png";

  function onToggle(id: string, checked: boolean) {
    setSelected((s) => ({ ...s, [id]: checked }));
  }

  function handleNext() {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (onNext) onNext(ids);
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
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button
            className="zoom-btn"
            onClick={handleNext}
            aria-label="Next step"
            type="button"
          >
            Next →
          </button>
        </div>
      </aside>
    </div>
  );
}
