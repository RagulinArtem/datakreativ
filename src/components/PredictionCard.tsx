"use client";

import { useEffect, useState } from "react";
import {
  CtrPrediction,
  Filters,
  NICHES,
  PLATFORMS,
  GOALS,
  AGES,
  GENDERS,
} from "@/lib/filters";

interface Props {
  prediction: CtrPrediction;
  filters: Filters;
}

export default function PredictionCard({ prediction, filters }: Props) {
  const positive = prediction.delta >= 0;
  const ratio =
    Math.min(prediction.ctr, prediction.benchmark * 2) /
    (prediction.benchmark * 2);

  return (
    <div className="glass-card relative overflow-hidden p-6">
      {/* Декоративный градиент */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/5 blur-[60px]" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-teal-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              Предиктивный CTR
            </div>
            <div className="text-xs text-zinc-500">
              На основании параметров кампании и оценки креатива
            </div>
          </div>

          <div
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
              positive
                ? "border-teal-400/30 bg-teal-500/10 text-teal-300"
                : "border-orange-400/30 bg-orange-500/10 text-orange-300"
            }`}
          >
            <svg
              className={`h-3 w-3 ${positive ? "" : "rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
              />
            </svg>
            {positive ? "+" : ""}
            {prediction.delta}% к бенчмарку
          </div>
        </div>

        {/* Главное число */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-baseline gap-3">
              <AnimatedNumber value={prediction.ctr} suffix="%" />
              <div className="text-sm text-zinc-500">
                ожидаемый CTR
              </div>
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Доверительный интервал:{" "}
              <span className="text-zinc-300 tabular-nums">
                {prediction.ctrLow.toFixed(2)}% — {prediction.ctrHigh.toFixed(2)}%
              </span>
            </div>

            {/* Bar: положение CTR относительно бенчмарка */}
            <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500/80 to-teal-300 transition-[width] duration-1000 ease-out"
                style={{ width: `${Math.max(8, ratio * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-zinc-600">
              <span>0%</span>
              <span>бенчмарк {prediction.benchmark}%</span>
              <span>2× бенчмарк</span>
            </div>
          </div>

          {/* Доп. метрики */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-5 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-6">
            <Metric label="CPC" value={`${prediction.cpc.toFixed(1)} ₽`} />
            <Metric label="CPM" value={`${prediction.cpm} ₽`} />
            <Metric
              label="Охват ~10к ₽"
              value={formatReach(prediction.reach)}
            />
          </div>
        </div>

        {/* Контекст */}
        <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
          <ContextChip>{labelOf(NICHES, filters.niche)}</ContextChip>
          <ContextChip>{labelOf(PLATFORMS, filters.platform)}</ContextChip>
          <ContextChip>цель: {labelOf(GOALS, filters.goal)}</ContextChip>
          <ContextChip>{labelOf(AGES, filters.age)} лет</ContextChip>
          <ContextChip>{labelOf(GENDERS, filters.gender)}</ContextChip>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ContextChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1 text-[11px] text-zinc-400">
      {children}
    </span>
  );
}

function labelOf<T extends string>(
  options: { key: T; label: string }[],
  key: T
): string {
  return options.find((o) => o.key === key)?.label ?? key;
}

function formatReach(reach: number): string {
  if (reach >= 1000) return `${(reach / 1000).toFixed(1)}к`;
  return String(reach);
}

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className="text-5xl font-bold tabular-nums tracking-tight gradient-text md:text-6xl">
      {display.toFixed(2)}
      {suffix}
    </span>
  );
}
