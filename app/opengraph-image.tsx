import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Andro — Agents read files. Andro gives them the system.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function dataUri(file: string) {
  const buf = await readFile(join(process.cwd(), "public", "brand", file));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default async function Image() {
  const [mark, wordmark] = await Promise.all([dataUri("andro-mark.png"), dataUri("andro-wordmark.png")]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f3f4f3",
          background: "radial-gradient(60% 60% at 50% 0%, rgba(61,214,140,0.22), #040405 72%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={56} height={56} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={171} height={32} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1.04, letterSpacing: -3 }}>
          <span>Agents read files.</span>
          <span style={{ display: "flex" }}>
            Andro gives them the<span style={{ color: "#3dd68c", marginLeft: 22 }}>system.</span>
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8d9299" }}>The intelligence layer for AI engineering agents</div>
      </div>
    ),
    size,
  );
}
