"use client";

import {
  AGES,
  CREATIVE_TYPES,
  DEVICES,
  Filters,
  KPI_OPTIONS,
  NICHES,
  PerformancePrediction,
  VIDEO_LENGTHS,
  getPlacementOptions,
} from "@/lib/filters";

interface Props {
  prediction: PerformancePrediction;
  filters: Filters;
}

export default function PredictionCard({ prediction, filters }: Props) {
  const placementOptions = getPlacementOptions(filters.creativeType);
  const positive = prediction.delta >= 0;
  const scaleMax = Math.max(prediction.benchmark * 1.4, prediction.high);
  const ratio = Math.min(prediction.value / scaleMax, 1);
  const levelStyles =
    prediction.level === "above"
      ? "border-teal-400/30 bg-teal-500/10 text-teal-300"
      : prediction.level === "below"
        ? "border-orange-400/30 bg-orange-500/10 text-orange-300"
        : "border-white/10 bg-white/[0.04] text-zinc-300";

  return (
    <div className="glass-card relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/5 blur-[60px]" />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-teal-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              Прогноз {prediction.kpi.toUpperCase()}
            </div>
            <div className="text-xs text-zinc-500">
              Диапазон на основе качества креатива и параметров размещения
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${levelStyles}`}
          >
            <span>{prediction.levelLabel}</span>
            <span className="text-[11px] opacity-80">
              {positive ? "+" : ""}
              {prediction.delta}% к бенчмарку
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {formatMetric(prediction.kpi, prediction.low)}
            <span className="mx-2 text-zinc-500">—</span>
            {formatMetric(prediction.kpi, prediction.high)}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
            <span>
              Ожидаемое значение:{" "}
              <span className="font-medium text-zinc-200">
                {formatMetric(prediction.kpi, prediction.value)}
              </span>
            </span>
            <span>
              Бенчмарк:{" "}
              <span className="font-medium text-zinc-200">
                {formatMetric(prediction.kpi, prediction.benchmark)}
              </span>
            </span>
          </div>

          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500/80 to-teal-300 transition-[width] duration-1000 ease-out"
              style={{ width: `${Math.max(10, ratio * 100)}%` }}
            />
            <div
              className="absolute inset-y-0 w-px bg-white/25"
              style={{
                left: `${Math.min((prediction.benchmark / scaleMax) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-zinc-600">
            <span>0</span>
            <span>бенчмарк</span>
            <span>прогноз</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4 text-sm text-zinc-300">
          <div className="font-medium text-white">
            Что это значит
          </div>
          <p className="mt-1 leading-relaxed text-zinc-400">
            Платформа показывает диапазон прогнозной метрики и сравнивает его
            со средним ориентиром для похожего формата размещения.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
          <ContextChip>{labelOf(CREATIVE_TYPES, filters.creativeType)}</ContextChip>
          <ContextChip>{labelOf(placementOptions, filters.placementFormat)}</ContextChip>
          {filters.videoLength ? (
            <ContextChip>{labelOf(VIDEO_LENGTHS, filters.videoLength)}</ContextChip>
          ) : null}
          <ContextChip>{labelOf(DEVICES, filters.device)}</ContextChip>
          <ContextChip>{labelOf(KPI_OPTIONS, filters.kpi)}</ContextChip>
          <ContextChip>{labelOf(NICHES, filters.niche)}</ContextChip>
          <ContextChip>{labelOf(AGES, filters.age)} лет</ContextChip>
        </div>
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
  return options.find((option) => option.key === key)?.label ?? key;
}

function formatMetric(
  kpi: PerformancePrediction["kpi"],
  value: number
): string {
  const precision = kpi === "ctr" ? 2 : 1;
  return `${value.toFixed(precision)}%`;
}
