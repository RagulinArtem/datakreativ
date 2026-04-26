// Конфигурация фильтров и логика предиктивного CTR
// Любые изменения коэффициентов отразятся на расчёте — фильтры реально влияют на результат

export type NicheKey =
  | "ecommerce"
  | "saas"
  | "finance"
  | "education"
  | "fmcg"
  | "info"
  | "auto"
  | "realestate";

export type PlatformKey =
  | "instagram"
  | "vk"
  | "yandex"
  | "telegram"
  | "mytarget";

export type GoalKey = "reach" | "clicks" | "conversions" | "installs";

export type AgeKey = "18-24" | "25-34" | "35-44" | "45+";

export type GenderKey = "all" | "male" | "female";

export interface Filters {
  niche: NicheKey;
  platform: PlatformKey;
  goal: GoalKey;
  age: AgeKey;
  gender: GenderKey;
}

export const NICHES: { key: NicheKey; label: string }[] = [
  { key: "ecommerce", label: "E-commerce" },
  { key: "saas", label: "SaaS / B2B" },
  { key: "finance", label: "Финансы" },
  { key: "education", label: "Образование" },
  { key: "fmcg", label: "FMCG" },
  { key: "info", label: "Инфопродукты" },
  { key: "auto", label: "Авто" },
  { key: "realestate", label: "Недвижимость" },
];

export const PLATFORMS: { key: PlatformKey; label: string }[] = [
  { key: "instagram", label: "Instagram / Reels" },
  { key: "vk", label: "ВКонтакте" },
  { key: "yandex", label: "Яндекс.Директ" },
  { key: "telegram", label: "Telegram Ads" },
  { key: "mytarget", label: "myTarget" },
];

export const GOALS: { key: GoalKey; label: string }[] = [
  { key: "reach", label: "Охват" },
  { key: "clicks", label: "Клики" },
  { key: "conversions", label: "Конверсии" },
  { key: "installs", label: "Установки" },
];

export const AGES: { key: AgeKey; label: string }[] = [
  { key: "18-24", label: "18–24" },
  { key: "25-34", label: "25–34" },
  { key: "35-44", label: "35–44" },
  { key: "45+", label: "45+" },
];

export const GENDERS: { key: GenderKey; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "male", label: "Мужчины" },
  { key: "female", label: "Женщины" },
];

export const DEFAULT_FILTERS: Filters = {
  niche: "ecommerce",
  platform: "instagram",
  goal: "clicks",
  age: "25-34",
  gender: "all",
};

// Базовый CTR (%) по площадке — медианные индустриальные значения для image-объявлений
const PLATFORM_BASE_CTR: Record<PlatformKey, number> = {
  instagram: 0.85,
  vk: 0.65,
  yandex: 1.2,
  telegram: 1.4,
  mytarget: 0.75,
};

// Бенчмарк по площадке (то с чем сравниваем результат)
const PLATFORM_BENCHMARK: Record<PlatformKey, number> = {
  instagram: 0.9,
  vk: 0.7,
  yandex: 1.15,
  telegram: 1.3,
  mytarget: 0.8,
};

// Множитель ниши
const NICHE_MULTIPLIER: Record<NicheKey, number> = {
  ecommerce: 1.0,
  saas: 0.82,
  finance: 1.18,
  education: 1.22,
  fmcg: 0.9,
  info: 1.32,
  auto: 0.95,
  realestate: 1.08,
};

// Множитель цели кампании
const GOAL_MULTIPLIER: Record<GoalKey, number> = {
  reach: 0.72,
  clicks: 1.0,
  conversions: 1.18,
  installs: 1.08,
};

// Множитель по возрасту
const AGE_MULTIPLIER: Record<AgeKey, number> = {
  "18-24": 1.15,
  "25-34": 1.06,
  "35-44": 0.94,
  "45+": 0.84,
};

// Корректировка по полу
const GENDER_MULTIPLIER: Record<GenderKey, number> = {
  all: 1.0,
  male: 0.97,
  female: 1.04,
};

export interface CtrPrediction {
  ctr: number; // ожидаемый CTR в %
  ctrLow: number; // нижняя граница доверительного интервала
  ctrHigh: number; // верхняя граница
  benchmark: number; // средний по площадке
  delta: number; // отличие от бенчмарка в %
  cpc: number; // ожидаемая стоимость клика (₽), условная
  cpm: number; // ожидаемая стоимость показов (₽)
  reach: number; // оценочный охват при бюджете 10к
}

export function predictCtr(score: number, filters: Filters): CtrPrediction {
  const base = PLATFORM_BASE_CTR[filters.platform];
  const benchmark = PLATFORM_BENCHMARK[filters.platform];

  // Качество креатива нелинейно влияет на CTR.
  // score=50 → коэффициент 1.0, score=100 → ~1.6, score=0 → ~0.45
  const qualityFactor = 0.45 + (score / 100) * 1.15;

  const ctr =
    base *
    qualityFactor *
    NICHE_MULTIPLIER[filters.niche] *
    GOAL_MULTIPLIER[filters.goal] *
    AGE_MULTIPLIER[filters.age] *
    GENDER_MULTIPLIER[filters.gender];

  // Доверительный интервал ±18% от прогноза
  const ctrLow = ctr * 0.82;
  const ctrHigh = ctr * 1.18;

  const delta = ((ctr - benchmark) / benchmark) * 100;

  // CPC обратно пропорционален CTR (выше CTR — дешевле клик)
  const platformCpcBase: Record<PlatformKey, number> = {
    instagram: 18,
    vk: 14,
    yandex: 26,
    telegram: 22,
    mytarget: 15,
  };
  const cpc = platformCpcBase[filters.platform] / Math.max(qualityFactor, 0.6);

  // CPM зависит от площадки и ниши
  const platformCpmBase: Record<PlatformKey, number> = {
    instagram: 220,
    vk: 180,
    yandex: 320,
    telegram: 280,
    mytarget: 200,
  };
  const cpm = platformCpmBase[filters.platform] * NICHE_MULTIPLIER[filters.niche];

  // Охват при условном бюджете 10 000 ₽
  const reach = Math.round((10000 / cpm) * 1000);

  return {
    ctr: round(ctr, 2),
    ctrLow: round(ctrLow, 2),
    ctrHigh: round(ctrHigh, 2),
    benchmark: round(benchmark, 2),
    delta: round(delta, 1),
    cpc: round(cpc, 1),
    cpm: round(cpm, 0),
    reach,
  };
}

function round(v: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
}
