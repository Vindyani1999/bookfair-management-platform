import { useState } from "react";
import Image from "../atoms/MapImage";
import HallList from "../molecules/HallList";
import { halls } from "../../utils/data";
import "../../App.css";

type Props = {
  /** Controlled selection map (optional). If provided, the component becomes controlled. */
  selected?: Record<string, boolean>;
  /** Called when a hall checkbox is toggled (controlled mode) */
  onToggle?: (id: string, checked: boolean) => void;
  /** Optional map image src — if not provided we use the default overview map */
  mapSrc?: string;
};

export default function MapWithSelector({
  selected: controlledSelected,
  onToggle: controlledOnToggle,
  mapSrc,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<
    Record<string, boolean>
  >({});
  const selected = controlledSelected ?? internalSelected;
  const [zoom, setZoom] = useState<number>(1);

  const allHalls = halls.map((h) => ({ id: h.id, label: h.label }));

  function onToggle(id: string, checked: boolean) {
    if (controlledOnToggle) return controlledOnToggle(id, checked);
    setInternalSelected((s) => ({ ...s, [id]: checked }));
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
      <div style={{ flex: "1 1 0" }}>
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
            <div
              className="map-inner"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              <Image src={mapSrc ?? "/images/map.png"} alt="Bookfair map" />
            </div>
          </div>
        </div>
      </div>
      <aside className="map-panel">
        <h3 className="map-panel__title">
          Select the halls you preferred for your halls
        </h3>
        <HallList halls={allHalls} selected={selected} onToggle={onToggle} />
        {/* Navigation handled by parent stepper */}
      </aside>
    </div>
  );
}
