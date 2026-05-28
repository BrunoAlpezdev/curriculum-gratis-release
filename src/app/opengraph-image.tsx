import { ImageResponse } from "next/og"

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
          background: "#f3eddf",
          fontFamily: "sans-serif",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 132,
              height: 132,
              background: "#8a4b2a",
              color: "#fbf7ec",
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: "-2px",
              borderRadius: 20,
              border: "6px solid #24211c",
              boxShadow: "10px 10px 0 #24211c",
            }}
          >
            CV
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 800,
            color: "#24211c",
            letterSpacing: "-1.5px",
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          Curriculum Gratis
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#635a4a",
            textAlign: "center",
            maxWidth: 820,
            lineHeight: 1.4,
            marginBottom: 44,
          }}
        >
          Crea tu CV profesional y descárgalo en PDF al instante. Sin registro. Sin pagos. Sin trucos.
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["4 plantillas", "Formato Harvard y ATS", "PDF instantáneo"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                background: "#fbf7ec",
                color: "#24211c",
                borderRadius: 10,
                padding: "12px 22px",
                fontSize: 20,
                fontWeight: 700,
                border: "3px solid #24211c",
                boxShadow: "4px 4px 0 #8a4b2a",
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
