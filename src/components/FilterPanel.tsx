"use client";

import {
  Filters,
  NICHES,
  PLATFORMS,
  GOALS,
  AGES,
  GENDERS,
} from "@/lib/filters";

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
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
        <FilterGroup label="Ниша">
          <SelectChips
            options={NICHES}
            value={filters.niche}
            onChange={(niche) => onChange({ ...filters, niche })}
          />
        </FilterGroup>

        <FilterGroup label="Площадка">
          <SelectChips
            options={PLATFORMS}
            value={filters.platform}
            onChange={(platform) => onChange({ ...filters, platform })}
          />
        </FilterGroup>

        <FilterGroup label="Цель кампании">
          <SelectChips
            options={GOALS}
            value={filters.goal}
            onChange={(goal) => onChange({ ...filters, goal })}
          />
        </FilterGroup>

        <FilterGroup label="Возраст аудитории">
          <SelectChips
            options={AGES}
            value={filters.age}
            onChange={(age) => onChange({ ...filters, age })}
          />
        </FilterGroup>

        <FilterGroup label="Пол" className="md:col-span-2">
          <SelectChips
            options={GENDERS}
            value={filters.gender}
            onChange={(gender) => onChange({ ...filters, gender })}
          />
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </label>
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
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`relative rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              active
                ? "border-teal-400/40 bg-teal-500/15 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.15)]"
                : "border-white/8 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-zinc-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
