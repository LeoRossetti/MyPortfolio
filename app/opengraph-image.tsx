import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Leo Rossetti — Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #7f1d1d, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 0%, #450a0a, transparent 70%), #0a0505",
          color: "#f5ecec",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a28989",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#ef4444",
              boxShadow: "0 0 24px #ef4444",
            }}
          />
          leorossetti.dev
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 180,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -6,
            }}
          >
            <span style={{ color: "#f5ecec" }}>Leo</span>
            <span
              style={{
                background: "linear-gradient(to bottom right, #f5ecec, #ef4444, #7f1d1d)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Rossetti
            </span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a28989",
              maxWidth: 900,
              display: "flex",
            }}
          >
            Full-stack developer. Ships products, not prototypes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 20,
            color: "#a28989",
            fontFamily: "monospace",
          }}
        >
          {["TypeScript", "React", "Next.js", "React Native", "Node.js"].map(
            (t) => (
              <span
                key={t}
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  borderRadius: 9999,
                  background: "rgba(20, 9, 9, 0.6)",
                }}
              >
                {t}
              </span>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
