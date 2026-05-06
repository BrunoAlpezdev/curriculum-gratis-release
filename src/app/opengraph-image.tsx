import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Curriculum Gratis - Crea tu CV Profesional y Descargalo en PDF"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            marginBottom: 24,
          }}
        >
          📄
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-1px",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Curriculum Gratis
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Crea tu CV profesional y descárgalo en PDF al instante.
          Sin registro. Sin pagos. Sin trucos.
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["4 plantillas", "Colores personalizados", "PDF instantáneo"].map((label) => (
            <div
              key={label}
              style={{
                background: "#1d4ed8",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
