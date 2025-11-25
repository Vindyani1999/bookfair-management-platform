import { useState, useEffect } from "react";
import Image from "../../../../frontend-user/src/components/atoms/MapImage";
import { type MapCanvasProps } from "../../types/types";
import { Box, CircularProgress, Skeleton } from "@mui/material";
export default function MapCanvas({
  mapSrc,
  alt,
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 2,
  children,
  style,
  minHeight = 520,
  loading = false,
}: MapCanvasProps) {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    setImgError(false);
    setZoom(initialZoom);
  }, [mapSrc, initialZoom]);

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "stretch", ...style }}>
      <div style={{ flex: "1 1 0" }}>
        <div className="map-canvas" style={{ position: "relative" }}>
          <div
            className="zoom-controls"
            aria-hidden
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <button
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.min(z + 0.25, maxZoom))}
              disabled={zoom >= maxZoom}
              aria-label="Zoom in"
              style={{ width: 36, height: 28, borderRadius: 6 }}
            >
              +
            </button>
            <button
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.max(z - 0.25, minZoom))}
              disabled={zoom <= minZoom}
              aria-label="Zoom out"
              style={{ width: 36, height: 28, borderRadius: 6 }}
            >
              −
            </button>
          </div>

          <div
            className="map-viewport"
            style={{
              overflow: "hidden",
              height: minHeight,
              borderRadius: 12,
              background: "#f3f6f6",
              boxShadow: "0 6px 20px rgba(16,24,40,0.06)",
              padding: 14,
              boxSizing: "border-box",
              border: "1px solid rgba(15,23,42,0.04)",
            }}
          >
            <div
              className="map-inner"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center top",
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={minHeight}
                    animation="wave"
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      inset: 0,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </Box>
              ) : !imgError ? (
                <Image
                  src={mapSrc}
                  alt={alt ?? "map"}
                  style={{
                    width: "auto",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  role="img"
                  aria-label="map placeholder"
                  style={{
                    minHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontSize: 14,
                    padding: 20,
                    textAlign: "center",
                    background: "linear-gradient(180deg,#fbfdff,#ffffff)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>
                      Map not available
                    </div>
                    <div style={{ opacity: 0.85 }}>
                      Unable to load {mapSrc || "map image"}. Put the hall map
                      image in the app public folder at{" "}
                      <code>/images/halls/</code> or set a valid URL.
                    </div>
                  </div>
                </div>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
