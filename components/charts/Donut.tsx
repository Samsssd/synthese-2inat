"use client";

import { motion } from "framer-motion";

export function Donut({
  value,
  size = 132,
  stroke = 12,
  color = "#34d399",
  track = "rgba(255,255,255,0.07)",
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-semibold tabular-nums text-white"
          style={{ fontSize: size * 0.22 }}
        >
          {Math.round(clamped)}
          <span style={{ fontSize: size * 0.11 }} className="text-slate-400">
            %
          </span>
        </span>
        {label && (
          <span
            className="mt-0.5 font-medium text-slate-300"
            style={{ fontSize: size * 0.1 }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="text-slate-500"
            style={{ fontSize: size * 0.085 }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
