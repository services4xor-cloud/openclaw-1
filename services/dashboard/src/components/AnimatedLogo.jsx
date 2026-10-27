/**
 * Header logo: the 4XOR mark, the same frames as the 4xor.de and Be[X] map
 * headers (spins with the scroll, backflips on a click). `brand="4xor"` shows it
 * with the 4XOR wordmark as in the 4xor.de header, otherwise inside BE[ ].
 */
import { useEffect, useRef } from "react";
import { startLogoMotion } from "../lib/logo-motion.ts";

const PYRAMID = "M26.5 8 2.5 47l24 11 24-11ZM26.5 8v50M2.5 47l24-12 24 12";
const RING = "M15.3 40.6A12.5 12.5 0 1 1 37.7 40.6";
const ACCENT = "rgb(var(--color-accent-rgb))";

export default function AnimatedLogo({ size = 32, brand = "bex" }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const motion = svgRef.current ? startLogoMotion(svgRef.current) : null;
    return () => motion?.stop();
  }, []);

  const text = size * 0.44;
  const is4xor = brand === "4xor";
  return (
    <span className="bx-logo logo inline-flex items-center leading-none" aria-label={is4xor ? "4XOR" : "Be[4XOR]"}>
      {!is4xor && (
        <>
          <span className="font-brand font-medium tracking-[0.22em]" style={{ fontSize: text }}>
            BE
          </span>
          <span aria-hidden="true" className="bx-bracket" style={{ fontSize: size * 0.95 }}>
            [
          </span>
        </>
      )}
      <svg
        ref={svgRef}
        width={(size * 53) / 60}
        height={size}
        viewBox="0 0 53 60"
        fill="none"
        aria-hidden="true"
        className="mark shrink-0 overflow-visible"
      >
        <defs>
          <radialGradient id="bx-logo-glow">
            <stop offset="0" stopColor="#d4a537" stopOpacity="0.75" />
            <stop offset="1" stopColor="#d4a537" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bx-logo-sun">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#fff6c4" />
            <stop offset="0.7" stopColor="#ffd54f" />
            <stop offset="1" stopColor="#f6b93b" />
          </radialGradient>
          <radialGradient id="bx-logo-corona">
            <stop offset="0" stopColor="#fff1b8" stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#ffd04a" stopOpacity="0.4" />
            <stop offset="1" stopColor="#ffc23a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="halo" cx="26.5" cy="5.5" r="12" fill="url(#bx-logo-glow)" />
        <circle className="halo2" cx="26.5" cy="58" r="0" fill="url(#bx-logo-glow)" />
        <path className="ring" d={RING} stroke={ACCENT} strokeWidth="2" />
        <path className="trail" d="" stroke={ACCENT} strokeWidth="1.6" opacity="0" />
        <circle className="corona" cx="26.5" cy="35" r="0" fill="url(#bx-logo-corona)" />
        <path className="sunrays" d="" stroke="#f6c548" strokeWidth="1.2" strokeLinecap="round" opacity="0" />
        <circle className="sun" cx="26.5" cy="35" r="0" fill="url(#bx-logo-sun)" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} className="face" d="" fill={ACCENT} opacity="0" />
        ))}
        <path className="pyr" d={PYRAMID} stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" strokeMiterlimit="4" />
        <path
          className="pyr2"
          d=""
          stroke={ACCENT}
          strokeWidth="2.4"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
          pathLength="1"
          strokeDasharray="1"
          opacity="0"
        />
        <circle className="dot2" cx="26.5" cy="5.5" r="3.75" fill="url(#bx-logo-sun)" opacity="0" />
        <path className="orbit" d="" strokeWidth="0.9" opacity="0" />
        <g className="bits" />
        <path className="rays" d="" strokeWidth="1.1" strokeLinecap="round" opacity="0" />
        <circle className="dot" cx="26.5" cy="5.5" r="3.75" fill="url(#bx-logo-sun)" />
      </svg>
      {is4xor ? (
        <span className="ms-3 shrink-0 font-brand font-medium tracking-[0.22em] max-[460px]:hidden" style={{ fontSize: size * 0.5 }}>
          4XOR
        </span>
      ) : (
        <span aria-hidden="true" className="bx-bracket" style={{ fontSize: size * 0.95 }}>
          ]
        </span>
      )}
    </span>
  );
}
