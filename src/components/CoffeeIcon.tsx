import type { CSSProperties } from "react";

export function CoffeeIcon({
  size = 80,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <rect width="256" height="256" fill="none" />
      {/* Duotone background fill at 20% */}
      <rect x="32" y="56" width="144" height="152" rx="20" fill="currentColor" opacity="0.2" />
      <path d="M176,84 a44,44,0,0,1,0,88 Z" fill="currentColor" opacity="0.2" />
      {/* Cup body outline */}
      <rect
        x="32" y="56" width="144" height="152" rx="20"
        fill="none" stroke="currentColor" strokeWidth="16" strokeLinejoin="round"
      />
      {/* Handle arc */}
      <path
        d="M176,84 a44,44,0,0,1,0,88"
        fill="none" stroke="currentColor" strokeWidth="16"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Steam lines */}
      <line x1="88" y1="40" x2="88" y2="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <line x1="120" y1="40" x2="120" y2="16" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}
