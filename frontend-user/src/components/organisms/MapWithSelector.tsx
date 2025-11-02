import { useState } from "react";
import Image from "../atoms/Image";
import HallList from "../molecules/HallList";
import { halls as backendHalls } from "../../utils/data";

export default function MapWithSelector() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const halls = backendHalls.map((h) => ({ id: h.id, label: h.label }));

  function onToggle(id: string, checked: boolean) {
    setSelected((s) => ({ ...s, [id]: checked }));
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ flex: "1 1" }}>
        {/* Put your real map image at public/images/map.png */}
        <Image src="/images/map.png" alt="Bookfair map" />
      </div>
      <aside className="map-panel">
        <h3 className="map-panel__title">
          Select the halls you preferred for your stalls
        </h3>
        <HallList halls={halls} selected={selected} onToggle={onToggle} />
      </aside>
    </div>
  );
}
