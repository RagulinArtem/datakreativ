"use client";

import { useEffect, useState } from "react";

const stages = [
  "Загрузка изображения...",
  "Определение объектов на креативе...",
  "Анализ текстовых элементов...",
  "Оценка визуальной композиции...",
  "Проверка CTA-элементов...",
  "Генерация рекомендаций...",
  "Формирование отчёта...",
];

export default function AnalysisLoader() {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((s) => (s < stages.length - 1 ? s + 1 : s));
    }, 700);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8 + 2, 95));
    }, 200);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-20 page-transition">
      {/* Animated brain/scan icon */}
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-2 border-teal-500/20 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-teal-500/40 flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
            <div className="h-8 w-8 rounded-full bg-teal-500/20 animate-pulse-glow" />
          </div>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-2 w-2 rounded-full bg-teal-400" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 h-1.5 w-1.5 rounded-full bg-teal-300" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h3 className="text-xl font-semibold">AI анализирует креатив</h3>
        <p className="text-sm text-teal-400 h-5 transition-all duration-300">
          {stages[stage]}
        </p>
      </div>

      {/* Progress bar */}
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
