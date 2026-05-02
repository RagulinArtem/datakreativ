// Конфигурация фильтров и логика предиктивной метрики для MVP.
// Расчет остается эвристическим, но все выбранные параметры реально влияют на прогноз.

export type CreativeTypeKey = "banner" | "olv";

export type BannerFormatKey =
  | "standard-banner"
  | "rich-media"
  | "native"
  | "fullscreen";

export type OlvFormatKey = "instream" | "outstream" | "rewarded";

export type PlacementFormatKey = BannerFormatKey | OlvFormatKey;

export type VideoLengthKey = "6s" | "10-15s" | "20-30s" | "30plus";

export type DeviceKey = "mobile" | "desktop";

export type KpiKey = "ctr" | "vtr";

export type NicheKey =
  | "ecommerce"
  | "fmcg"
  | "fintech"
  | "realestate"
  | "auto"
  | "education"
  | "services-b2b";

export type AgeKey = "18-24" | "25-34" | "35-44" | "45+";

export interface Filters {
  creativeType: CreativeTypeKey;
  placementFormat: PlacementFormatKey;
  videoLength: VideoLengthKey | null;
  device: DeviceKey;
  kpi: KpiKey;
  niche: NicheKey;
  age: AgeKey;
}

export const CREATIVE_TYPES: { key: CreativeTypeKey; label: string }[] = [
  { key: "banner", label: "Баннер (Display)" },
  { key: "olv", label: "OLV (Online Video)" },
];

export const BANNER_FORMATS: { key: BannerFormatKey; label: string }[] = [
  { key: "standard-banner", label: "Standard banner" },
  { key: "rich-media", label: "Rich media" },
  { key: "native", label: "Native" },
  { key: "fullscreen", label: "Fullscreen" },
];

export const OLV_FORMATS: { key: OlvFormatKey; label: string }[] = [
  { key: "instream", label: "In-stream (pre/mid/post-roll)" },
  { key: "outstream", label: "Out-stream" },
  { key: "rewarded", label: "Rewarded video" },
];

export const VIDEO_LENGTHS: { key: VideoLengthKey; label: string }[] = [
  { key: "6s", label: "6 сек" },
  { key: "10-15s", label: "10–15 сек" },
  { key: "20-30s", label: "20–30 сек" },
  { key: "30plus", label: "30+ сек" },
];

export const DEVICES: { key: DeviceKey; label: string }[] = [
  { key: "mobile", label: "Mobile" },
  { key: "desktop", label: "Desktop" },
];

export const KPI_OPTIONS: { key: KpiKey; label: string }[] = [
  { key: "ctr", label: "CTR (Click-through rate)" },
  { key: "vtr", label: "VTR (View-through rate / Completion rate)" },
];

export const NICHES: { key: NicheKey; label: string }[] = [
  { key: "ecommerce", label: "E-commerce" },
  { key: "fmcg", label: "FMCG" },
  { key: "fintech", label: "Fintech" },
  { key: "realestate", label: "Real Estate" },
  { key: "auto", label: "Auto" },
  { key: "education", label: "Education" },
  { key: "services-b2b", label: "Services / B2B" },
];

export const AGES: { key: AgeKey; label: string }[] = [
  { key: "18-24", label: "18–24" },
  { key: "25-34", label: "25–34" },
  { key: "35-44", label: "35–44" },
  { key: "45+", label: "45+" },
];

const DEFAULT_BANNER_FILTERS: Filters = {
  creativeType: "banner",
  placementFormat: "standard-banner",
  videoLength: null,
  device: "mobile",
  kpi: "ctr",
  niche: "ecommerce",
  age: "25-34",
};

const DEFAULT_OLV_FILTERS: Filters = {
  creativeType: "olv",
  placementFormat: "instream",
  videoLength: "10-15s",
  device: "mobile",
  kpi: "vtr",
  niche: "ecommerce",
  age: "25-34",
};

export const DEFAULT_FILTERS: Filters = DEFAULT_BANNER_FILTERS;

export function getPlacementOptions(
  creativeType: CreativeTypeKey
): { key: PlacementFormatKey; label: string }[] {
  return creativeType === "banner" ? BANNER_FORMATS : OLV_FORMATS;
}

export function getKpiOptions(
  creativeType: CreativeTypeKey
): { key: KpiKey; label: string }[] {
  return creativeType === "banner"
    ? KPI_OPTIONS.filter((option) => option.key === "ctr")
    : KPI_OPTIONS.slice().sort((left, right) => {
        if (left.key === "vtr") return -1;
        if (right.key === "vtr") return 1;
        return 0;
      });
}

export function getDefaultFiltersForType(creativeType: CreativeTypeKey): Filters {
  return creativeType === "banner"
    ? { ...DEFAULT_BANNER_FILTERS }
    : { ...DEFAULT_OLV_FILTERS };
}

export function normalizeFilters(filters: Filters): Filters {
  const defaults = getDefaultFiltersForType(filters.creativeType);
  const placementOptions = getPlacementOptions(filters.creativeType);
  const kpiOptions = getKpiOptions(filters.creativeType);

  const placementFormat = placementOptions.some(
    (option) => option.key === filters.placementFormat
  )
    ? filters.placementFormat
    : defaults.placementFormat;

  const kpi = kpiOptions.some((option) => option.key === filters.kpi)
    ? filters.kpi
    : defaults.kpi;

  return {
    ...filters,
    placementFormat,
    videoLength: filters.creativeType === "olv"
      ? filters.videoLength ?? defaults.videoLength
      : null,
    kpi,
  };
}

type BenchmarkMatrix<K extends string> = Record<K, Record<DeviceKey, number>>;

const BANNER_CTR_BENCHMARK: BenchmarkMatrix<BannerFormatKey> = {
  "standard-banner": { mobile: 0.38, desktop: 0.32 },
  "rich-media": { mobile: 0.52, desktop: 0.45 },
  native: { mobile: 0.68, desktop: 0.57 },
  fullscreen: { mobile: 0.86, desktop: 0.74 },
};

const OLV_CTR_BENCHMARK: BenchmarkMatrix<OlvFormatKey> = {
  instream: { mobile: 0.62, desktop: 0.48 },
  outstream: { mobile: 0.44, desktop: 0.36 },
  rewarded: { mobile: 0.78, desktop: 0.61 },
};

const OLV_VTR_BENCHMARK: Record<OlvFormatKey, number> = {
  instream: 72,
  outstream: 63,
  rewarded: 89,
};

const OLV_VTR_DEVICE_MULTIPLIER: Record<DeviceKey, number> = {
  mobile: 1.02,
  desktop: 0.97,
};

const VIDEO_LENGTH_MULTIPLIER_VTR: Record<VideoLengthKey, number> = {
  "6s": 1.08,
  "10-15s": 1.0,
  "20-30s": 0.91,
  "30plus": 0.82,
};

const VIDEO_LENGTH_MULTIPLIER_CTR: Record<VideoLengthKey, number> = {
  "6s": 1.04,
  "10-15s": 1.0,
  "20-30s": 0.94,
  "30plus": 0.87,
};

const NICHE_MULTIPLIER: Record<NicheKey, number> = {
  ecommerce: 1.05,
  fmcg: 0.97,
  fintech: 0.9,
  realestate: 0.86,
  auto: 0.91,
  education: 1.08,
  "services-b2b": 0.88,
};

const AGE_MULTIPLIER: Record<AgeKey, number> = {
  "18-24": 1.06,
  "25-34": 1.02,
  "35-44": 0.97,
  "45+": 0.92,
};

export interface PerformancePrediction {
  kpi: KpiKey;
  value: number;
  low: number;
  high: number;
  benchmark: number;
  delta: number;
  level: "below" | "average" | "above";
  levelLabel: string;
}

export function predictPerformance(
  score: number,
  filters: Filters
): PerformancePrediction {
  const benchmark = getBenchmark(filters);
  const qualityFactor = 0.78 + (score / 100) * 0.48;
  const contextualFactor =
    NICHE_MULTIPLIER[filters.niche] * AGE_MULTIPLIER[filters.age];

  const value = benchmark * qualityFactor * contextualFactor;
  const spread = filters.kpi === "ctr" ? 0.12 : 0.08;
  const low = value * (1 - spread);
  const high = value * (1 + spread);
  const delta = ((value - benchmark) / benchmark) * 100;
  const level = getPredictionLevel(delta);

  return {
    kpi: filters.kpi,
    value: roundMetric(filters.kpi, value),
    low: roundMetric(filters.kpi, filters.kpi === "vtr" ? Math.max(0, low) : low),
    high: roundMetric(
      filters.kpi,
      filters.kpi === "vtr" ? Math.min(99, high) : high
    ),
    benchmark: roundMetric(filters.kpi, benchmark),
    delta: round(delta, 1),
    level,
    levelLabel: getPredictionLevelLabel(level),
  };
}

function getBenchmark(filters: Filters): number {
  if (filters.creativeType === "banner") {
    return BANNER_CTR_BENCHMARK[filters.placementFormat as BannerFormatKey][
      filters.device
    ];
  }

  const videoLength = getOlvVideoLength(filters);

  if (filters.kpi === "ctr") {
    return (
      OLV_CTR_BENCHMARK[filters.placementFormat as OlvFormatKey][filters.device] *
      VIDEO_LENGTH_MULTIPLIER_CTR[videoLength]
    );
  }

  return (
    OLV_VTR_BENCHMARK[filters.placementFormat as OlvFormatKey] *
    OLV_VTR_DEVICE_MULTIPLIER[filters.device] *
    VIDEO_LENGTH_MULTIPLIER_VTR[videoLength]
  );
}

function getOlvVideoLength(filters: Filters): VideoLengthKey {
  return filters.videoLength ?? "10-15s";
}

function getPredictionLevel(
  delta: number
): PerformancePrediction["level"] {
  if (delta >= 8) return "above";
  if (delta <= -8) return "below";
  return "average";
}

function getPredictionLevelLabel(level: PerformancePrediction["level"]): string {
  switch (level) {
    case "above":
      return "Выше среднего";
    case "below":
      return "Ниже среднего";
    default:
      return "Средний";
  }
}

function roundMetric(kpi: KpiKey, value: number): number {
  return kpi === "ctr" ? round(value, 2) : round(value, 1);
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
