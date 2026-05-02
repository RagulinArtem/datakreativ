"use client";

import {
  AGES,
  CREATIVE_TYPES,
  DEVICES,
  Filters,
  NICHES,
  VIDEO_LENGTHS,
  getDefaultFiltersForType,
  getKpiOptions,
  getPlacementOptions,
  normalizeFilters,
} from "@/lib/filters";

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
  const placementOptions = getPlacementOptions(filters.creativeType);
  const kpiOptions = getKpiOptions(filters.creativeType);

  const updateFilters = (patch: Partial<Filters>) => {
    onChange(normalizeFilters({ ...filters, ...patch }));
  };

  const updateCreativeType = (creativeType: Filters["creativeType"]) => {
    const defaults = getDefaultFiltersForType(creativeType);

    onChange(
      normalizeFilters({
        ...defaults,
        creativeType,
        niche: filters.niche,
        age: filters.age,
        device: filters.device,
      })
    );
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-5 flex items-center gap-2">
        <svg
          className="h-4 w-4 text-teal-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>
        <h3 className="text-sm font-semibold tracking-tight">
          Параметры кампании
        </h3>
        <span className="ml-auto text-[11px] text-zinc-500">
          влияют на прогноз
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FilterGroup label="Тип креатива">
          <SelectChips
            options={CREATIVE_TYPES}
            value={filters.creativeType}
            onChange={updateCreativeType}
          />
        </FilterGroup>

        <FilterGroup label="Формат размещения">
          <SelectChips
            options={placementOptions}
            value={filters.placementFormat}
            onChange={(placementFormat) => updateFilters({ placementFormat })}
          />
        </FilterGroup>

        {filters.creativeType === "olv" && (
          <FilterGroup label="Длина видео">
            <SelectChips
              options={VIDEO_LENGTHS}
              value={filters.videoLength ?? VIDEO_LENGTHS[0].key}
              onChange={(videoLength) => updateFilters({ videoLength })}
            />
          </FilterGroup>
        )}

        <FilterGroup label="Устройство">
          <SelectChips
            options={DEVICES}
            value={filters.device}
            onChange={(device) => updateFilters({ device })}
          />
        </FilterGroup>

        <FilterGroup
          label="KPI кампании"
          hint={
            filters.creativeType === "banner"
              ? "для баннеров используем только CTR"
              : "для OLV используем только VTR"
          }
        >
          <SelectChips
            options={kpiOptions}
            value={filters.kpi}
            onChange={(kpi) => updateFilters({ kpi })}
          />
        </FilterGroup>

        <FilterGroup label="Ниша">
          <SelectChips
            options={NICHES}
            value={filters.niche}
            onChange={(niche) => updateFilters({ niche })}
          />
        </FilterGroup>

        <FilterGroup label="Возраст аудитории" className="md:col-span-2">
          <SelectChips
            options={AGES}
            value={filters.age}
            onChange={(age) => updateFilters({ age })}
          />
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </label>
        {hint ? <span className="text-[11px] text-zinc-600">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

interface ChipOption<T extends string> {
  key: T;
  label: string;
}

function SelectChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.key === value;

        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.key)}
            className={`relative rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              active
                ? "border-teal-400/40 bg-teal-500/15 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.15)]"
                : "border-white/8 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-zinc-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
