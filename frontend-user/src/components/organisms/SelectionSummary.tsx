import type { Hall } from "../../utils/data";
import "../../App.css";

type Props = {
  selectedHalls: Hall[];
};

function sizeForHall(id: string) {
  // Mock size based on id numeric part - replace with real data later
  const m = id.match(/(\d+)$/);
  const n = m ? parseInt(m[1], 10) : 0;
  if (n % 3 === 0) return { text: "Small", className: "badge--small" };
  if (n % 3 === 1) return { text: "Medium", className: "badge--medium" };
  return { text: "Large", className: "badge--large" };
}

export default function SelectionSummary({ selectedHalls }: Props) {
  if (!selectedHalls || selectedHalls.length === 0) {
    return (
      <div className="selection-summary" aria-live="polite">
        <div className="selection-summary__title">You have selected</div>
        <div className="selection-summary__empty">Nothing</div>
      </div>
    );
  }

  return (
    <div className="selection-summary" aria-live="polite">
      <div className="selection-summary__title">You have selected</div>
      <div className="selection-summary__list">
        {selectedHalls.map((h) => {
          const size = sizeForHall(h.id);
          return (
            <div key={h.id} className="selection-item">
              <div className="selection-item__name">{h.label}</div>
              <div className={`badge ${size.className}`}>{size.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
