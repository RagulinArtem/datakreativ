"use client";

import type { AnalysisResult as AnalysisResultType } from "@/lib/mock-analysis";
import PredictionCard from "./PredictionCard";
import ScoreRing, { getScoreColor } from "./ScoreRing";

interface Props {
  result: AnalysisResultType;
  assetKind: "image" | "video";
  assetUrl: string;
  onReset: () => void;
}

function ElementBar({
  score,
  label,
  details,
}: {
  score: number;
  label: string;
  details: string;
}) {
  const colors = getScoreColor(score);

  return (
    <div className="glass-card p-5 transition-all duration-300 hover:border-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${colors.label}`}>
          {score}
        </span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: colors.stroke,
            transitionDelay: "300ms",
          }}
        />
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">{details}</p>
    </div>
  );
}

export default function AnalysisResult({
  result,
  assetKind,
  assetUrl,
  onReset,
}: Props) {
  return (
    <div className="page-transition space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card flex flex-col items-center justify-center gap-4 p-8">
          <ScoreRing score={result.score} />
          <div className="text-center">
            <div className="mt-2 text-sm text-zinc-400">
              Оценка креатива:{" "}
              <span className={`font-semibold ${getScoreColor(result.score).label}`}>
                {result.efficiency}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            Анализируемый креатив
          </div>

          {assetKind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetUrl}
              alt="Креатив"
              className="w-full rounded-lg object-contain"
              style={{ maxHeight: 320 }}
            />
          ) : (
            <video
              src={assetUrl}
              className="w-full rounded-lg bg-black object-contain"
              style={{ maxHeight: 320 }}
              controls
              playsInline
            />
          )}
        </div>
      </div>

      <PredictionCard prediction={result.prediction} filters={result.filters} />

      <div>
        <h3 className="mb-4 text-lg font-semibold">Анализ элементов</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <ElementBar {...result.elements.text} />
          <ElementBar {...result.elements.visual} />
          <ElementBar {...result.elements.message} />
          <ElementBar {...result.elements.cta} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-teal-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Сильные стороны
          </h3>
          <ul className="space-y-2.5">
            {result.strengths.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-orange-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            Слабые стороны
          </h3>
          <ul className="space-y-2.5">
            {result.weaknesses.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
          <svg
            className="h-5 w-5 text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          Рекомендации по улучшению
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-4 text-sm text-zinc-300"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-xs font-bold text-teal-400">
                {index + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pb-8 sm:flex-row sm:justify-center">
        <button
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-500 px-8 text-base font-medium text-black transition-all hover:bg-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Анализировать другой креатив
        </button>
      </div>
    </div>
  );
}
