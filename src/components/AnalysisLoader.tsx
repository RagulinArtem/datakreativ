"use client";

import { CreativeTypeKey, KpiKey } from "@/lib/filters";
import { useEffect, useMemo, useState } from "react";

interface Props {
  creativeType: CreativeTypeKey;
  kpi: KpiKey;
}

export default function AnalysisLoader({ creativeType, kpi }: Props) {
  const stages = useMemo(
    () =>
      creativeType === "banner"
        ? [
            "Подготовка креатива к анализу...",
            "Проверка читаемости текста...",
            "Оценка визуального контраста...",
            "Проверка перегруженности элементов...",
            `Подбор бенчмарков для ${kpi.toUpperCase()}...`,
            "Формирование рекомендаций...",
          ]
        : [
            "Подготовка ролика к анализу...",
            "Оценка первых секунд видео...",
            "Проверка титров и ключевого сообщения...",
            "Анализ финального экрана и CTA...",
            `Подбор бенчмарков для ${kpi.toUpperCase()}...`,
            "Формирование рекомендаций...",
          ],
    [creativeType, kpi]
  );

  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((current) => (current < stages.length - 1 ? current + 1 : current));
    }, 850);

    const progressInterval = setInterval(() => {
      setProgress((current) => Math.min(current + Math.random() * 8 + 3, 95));
    }, 220);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [stages]);

  return (
    <div className="page-transition flex flex-col items-center gap-8 py-20">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-teal-500/20">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-teal-500/40 animate-spin"
            style={{ animationDuration: "3s" }}
          >
            <div className="h-8 w-8 rounded-full bg-teal-500/20 animate-pulse-glow" />
          </div>
        </div>
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "2s" }}
        >
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1 rounded-full bg-teal-400" />
        </div>
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        >
          <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1 rounded-full bg-teal-300" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h3 className="text-xl font-semibold">AI анализирует креатив</h3>
        <p className="h-5 text-center text-sm text-teal-400 transition-all duration-300">
          {stages[stage]}
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-zinc-500">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
