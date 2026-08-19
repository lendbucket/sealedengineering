import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";
import { IS_PRELAUNCH, SEALING_PHRASE } from "@/config/launch";

// Sentence case for the card, which reads as a line rather than a clause.
const SEALING_PHRASE_CARD = SEALING_PHRASE.charAt(0).toUpperCase() + SEALING_PHRASE.slice(1);

/**
 * The default social card.
 *
 * Drawn rather than served as a file, so the wordmark, the palette, and the
 * launch status all follow the same config the site does. When the real logo
 * arrives this becomes an image; until then a typographic card is honest about
 * where the brand is.
 *
 * No custom font is loaded. next/og would need the font file fetched at build
 * time, and the system stack it falls back to is close enough at this size that
 * the request is not worth the build dependency.
 */
export const alt = "Sealed Engineering, sealed engineering letters for Texas property";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f3b2e",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#f4f1ea",
              color: "#0f3b2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            SE
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#f4f1ea", fontSize: 34, fontWeight: 700 }}>{SITE.brand}</div>
            <div style={{ color: "#c6d5cd", fontSize: 18, letterSpacing: 3 }}>TEXAS PE SEALED</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#f4f1ea",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          <div>Sealed engineering letters</div>
          <div>for Texas property</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ color: "#c6d5cd", fontSize: 24 }}>
            {SEALING_PHRASE_CARD}
          </div>
          {/* One string, not two expressions. Satisfy's layout engine requires an
              explicit display on any element with more than one child, and two
              adjacent JSX expressions count as two children. */}
          <div style={{ color: "#c6d5cd", fontSize: 20 }}>
            {`${IS_PRELAUNCH ? "Opening soon . " : ""}${SITE.domain}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
