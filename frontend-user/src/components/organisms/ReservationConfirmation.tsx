import { halls, stalls } from "../../utils/data";
import type { ReservationConfirmationProps as Props } from "../../utils/types";
import CustomButton from "../atoms/CustomButton";
import "../../App.css";

function sizeForStall(stallId: string) {
  // Deterministic small/medium/large mapping based on numeric suffix (if any)
  const m = stallId.match(/(\d+)$/);
  const n = m ? parseInt(m[1], 10) : 0;
  if (n % 3 === 0) return { label: "Small", cls: "badge--small" };
  if (n % 2 === 0) return { label: "Large", cls: "badge--large" };
  return { label: "Medium", cls: "badge--medium" };
}

export default function ReservationConfirmation({
  booking,
  selectedHallIds,
  selectedStallIds,
  reservationId,
  reservationDate,
}: Props) {
  // Build readable reserved stalls list: [ { hallLabel, stallLabel, size } ]
  const reserved = selectedStallIds
    .map((sid) => {
      const stall = stalls.find((s) => s.id === sid);
      if (!stall) return null;
      const hall = halls.find((h) => h.id === stall.hallId);
      const size = sizeForStall(sid);
      return {
        id: sid,
        hallLabel: hall ? hall.label : stall.hallId,
        stallLabel: stall.label,
        size,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    hallLabel: string;
    stallLabel: string;
    size: { label: string; cls: string };
  }>;

  const qrPayload = `Reservation:${reservationId}`;
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
    qrPayload
  )}`;

  async function handleDownload() {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservation-${reservationId}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // ignore for now
      console.error("Failed to download QR", err);
    }
  }

  return (
    <div
      style={{
        padding: "25px",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        borderRadius: 8,
      }}
    >
      <h2 className="success-message">Your Reservation is Successful!</h2>
      <div className="reservation-confirmation">
        <div className="res-card res-card--details">
          <h3>Reservation Details</h3>

          <div style={{ textAlign: "left", marginTop: 8 }}>
            {booking && (
              <div style={{ marginBottom: 8 }}>
                <div>
                  <div style={{ marginTop: 12 }}>
                    {" "}
                    <strong
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      Reservation ID:
                    </strong>{" "}
                    {reservationId}
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Booked By:
                  </strong>{" "}
                  {booking.fullName}
                </div>
              </div>
            )}

            {selectedHallIds.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ marginTop: 12 }}>
                  <strong
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Selected Hall:
                  </strong>{" "}
                  {selectedHallIds
                    .map((hid) => halls.find((h) => h.id === hid)?.label ?? hid)
                    .join(", ")}
                </div>
              </div>
            )}

            <strong
              style={{
                fontWeight: 600,
                marginTop: 12,
              }}
            >
              Reserved Stalls
            </strong>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
              {reserved.length === 0 && (
                <li className="selection-summary__empty">No stalls selected</li>
              )}
              {reserved.map((r) => (
                <li key={r.id} style={{ marginBottom: 10, marginLeft: 20 }}>
                  {r.hallLabel} - {r.stallLabel}{" "}
                  <span
                    className={`badge ${r.size.cls}`}
                    style={{
                      marginLeft: 8,

                      fontWeight: 600,
                    }}
                  >
                    {r.size.label}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 18 }}>
              <div style={{ marginTop: 8 }}>
                {" "}
                <strong
                  style={{
                    fontWeight: 600,
                  }}
                >
                  Reservation Date:
                </strong>{" "}
                {reservationDate}
              </div>
            </div>
          </div>
        </div>

        <div className="res-card res-card--qr">
          <h3>Entry Pass QR Code</h3>
          <div className="qr-container">
            <img src={qrUrl} alt="Reservation QR" />
          </div>
          <div style={{ marginTop: 12 }}>
            <CustomButton
              label="Download QR Code"
              onClick={handleDownload}
              textColor="white"
              color="#000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
