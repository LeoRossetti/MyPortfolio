import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

export const runtime = "edge";
export const alt = "Leo Rossetti — Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = await getDictionary(locale);

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
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,255,255,0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 0%, rgba(255,255,255,0.05), transparent 70%), #171717",
          color: "#f5f5f5",
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
            color: "#a3a3a3",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#fafafa",
              boxShadow: "0 0 24px rgba(255,255,255,0.7)",
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
            <span
              style={{
                background:
                  "linear-gradient(to bottom, #ffffff, #d4d4d4 60%, #525252)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Leo
            </span>
            <span
              style={{
                background:
                  "linear-gradient(to bottom, #ffffff, #d4d4d4 60%, #525252)",
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
              color: "#a3a3a3",
              maxWidth: 900,
              display: "flex",
            }}
          >
            {dict.meta.ogDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 20,
            color: "#a3a3a3",
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
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 9999,
                  background: "rgba(20, 20, 20, 0.6)",
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
