"use client";

import { useCallback, useState, useRef } from "react";
import Header from "@/components/Header";
import AnalysisLoader from "@/components/AnalysisLoader";
import AnalysisResult from "@/components/AnalysisResult";
import FilterPanel from "@/components/FilterPanel";
import type { AnalysisResult as AnalysisResultType } from "@/lib/mock-analysis";
import { DEFAULT_FILTERS, Filters } from "@/lib/filters";

type Stage = "upload" | "loading" | "result";

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [dragging, setDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File, currentFilters: Filters) => {
      if (!file.type.startsWith("image/")) return;

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setStage("loading");

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters: currentFilters }),
        });
        const data = await res.json();
        setResult(data);
        setStage("result");
      } catch {
        setStage("upload");
      }
    },
    []
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file, filters);
    },
    [handleFile, filters]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file, filters);
    },
    [handleFile, filters]
  );

  const reset = useCallback(() => {
    setStage("upload");
    setImageUrl("");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center pt-24 pb-12 bg-grid">
        <div className="bg-radial absolute inset-0 pointer-events-none" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
          {/* Page header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">
              Анализ <span className="text-teal-400">креатива</span>
            </h1>
            <p className="mt-2 text-zinc-400">
              Настройте параметры кампании и загрузите изображение —
              {" "}нейросеть оценит креатив с учётом контекста размещения
            </p>
          </div>

          {/* Upload stage */}
          {stage === "upload" && (
            <div className="page-transition space-y-6">
              <FilterPanel filters={filters} onChange={setFilters} />

              <div
                className={`upload-zone glass-card flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-6 border-2 border-dashed border-white/10 p-12 ${
                  dragging ? "dragging" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <svg
                    className="h-10 w-10 text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-lg font-medium">
                    {dragging ? (
                      <span className="text-teal-400">Отпустите файл</span>
                    ) : (
                      "Перетащите изображение сюда"
                    )}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    или нажмите для выбора файла
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-600">
                  <span>PNG</span>
                  <span className="h-3 w-px bg-zinc-700" />
                  <span>JPG</span>
                  <span className="h-3 w-px bg-zinc-700" />
                  <span>WebP</span>
                  <span className="h-3 w-px bg-zinc-700" />
                  <span>до 10 МБ</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading stage */}
          {stage === "loading" && <AnalysisLoader />}

          {/* Result stage */}
          {stage === "result" && result && (
            <AnalysisResult result={result} imageUrl={imageUrl} onReset={reset} />
          )}
        </div>
      </main>
    </>
  );
}
