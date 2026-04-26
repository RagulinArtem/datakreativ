"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: "#2dd4bf", bg: "rgba(45, 212, 191, 0.1)", label: "text-teal-400" };
  if (score >= 60) return { stroke: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)", label: "text-yellow-400" };
  if (score >= 40) return { stroke: "#fb923c", bg: "rgba(251, 146, 60, 0.1)", label: "text-orange-400" };
  return { stroke: "#f87171", bg: "rgba(248, 113, 113, 0.1)", label: "text-red-400" };
}

export default function ScoreRing({ score, size = 180, strokeWidth = 8 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const colors = getScoreColor(score);

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      {/* Glow */}
      <div
        className="absolute rounded-full blur-xl opacity-30"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          backgroundColor: colors.stroke,
        }}
      />
      {/* Score text */}
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-bold tabular-nums ${colors.label}`}>
          {animatedScore}
        </span>
        <span className="text-sm text-zinc-500">из 100</span>
      </div>
    </div>
  );
}

export { getScoreColor };
