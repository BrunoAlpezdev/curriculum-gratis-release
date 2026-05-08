import { ImageResponse } from "next/og"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8a4b2a",
          boxSizing: "border-box",
          padding: 5,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fbf7ec",
            color: "#65351f",
            border: "2px solid #24211c",
            boxShadow: "3px 3px 0 #24211c",
            fontSize: 12,
            fontWeight: 900,
            fontFamily: "Arial, sans-serif",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          CV
        </div>
      </div>
    ),
    { ...size },
  )
}
