"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AnalysisLoader from "@/components/AnalysisLoader";
import AnalysisResult from "@/components/AnalysisResult";
import FilterPanel from "@/components/FilterPanel";
import Header from "@/components/Header";
import {
  DEFAULT_FILTERS,
  Filters,
  normalizeFilters,
} from "@/lib/filters";
import type { AnalysisResult as AnalysisResultType } from "@/lib/mock-analysis";

type Stage = "upload" | "loading" | "result";
type AssetKind = "image" | "video";

interface UploadedAsset {
  kind: AssetKind;
  name: string;
  url: string;
}

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [dragging, setDragging] = useState(false);
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const assetRef = useRef<UploadedAsset | null>(null);

  const replaceAsset = useCallback((next: UploadedAsset | null) => {
    const current = assetRef.current;
    if (current?.url && current.url !== next?.url) {
      URL.revokeObjectURL(current.url);
    }
    assetRef.current = next;
    setAsset(next);
  }, []);

  useEffect(() => {
    return () => {
      if (assetRef.current?.url) {
        URL.revokeObjectURL(assetRef.current.url);
      }
    };
  }, []);

  const handleFiltersChange = useCallback(
    (next: Filters) => {
      const normalized = normalizeFilters(next);
      setFilters(normalized);
      setError("");

      if (!asset) return;

      const expectedKind = normalized.creativeType === "banner" ? "image" : "video";
      if (asset.kind !== expectedKind) {
        replaceAsset(null);
        setResult(null);
        setStage("upload");
        setError(
          expectedKind === "image"
            ? "Для баннерного креатива загрузите изображение."
            : "Для OLV-креатива загрузите видео."
        );
      }
    },
    [asset, replaceAsset]
  );

  const validateFile = useCallback((file: File, currentFilters: Filters) => {
    const expectImage = currentFilters.creativeType === "banner";
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (expectImage && !isImage) {
      return "Для баннерного креатива загрузите изображение.";
    }

    if (!expectImage && !isVideo) {
      return "Для OLV-креатива загрузите видео.";
    }

    const maxSizeMb = expectImage ? 15 : 100;
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Файл слишком большой. Допустимый размер: до ${maxSizeMb} МБ.`;
    }

    return "";
  }, []);

  const handleFileSelection = useCallback(
    (file: File) => {
      const validationError = validateFile(file, filters);
      if (validationError) {
        setError(validationError);
        return;
      }

      const kind: AssetKind = file.type.startsWith("video/") ? "video" : "image";
      const nextAsset = {
        kind,
        name: file.name,
        url: URL.createObjectURL(file),
      };

      replaceAsset(nextAsset);
      setResult(null);
      setStage("upload");
      setError("");
    },
    [filters, replaceAsset, validateFile]
  );

  const handleAnalyze = useCallback(async () => {
    if (!asset) {
      setError("Сначала загрузите креатив для анализа.");
      return;
    }

    setError("");
    setStage("loading");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
      });

      if (!response.ok) {
        throw new Error("Analyze request failed");
      }

      const data = (await response.json()) as AnalysisResultType;
      setResult(data);
      setStage("result");
    } catch {
      setStage("upload");
      setError("Не удалось выполнить анализ. Попробуйте ещё раз.");
    }
  }, [asset, filters]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) handleFileSelection(file);
    },
    [handleFileSelection]
  );

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFileSelection(file);
    },
    [handleFileSelection]
  );

  const reset = useCallback(() => {
    replaceAsset(null);
    setStage("upload");
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [replaceAsset]);

  const uploadLabel =
    filters.creativeType === "banner"
      ? "Загрузите изображение баннера"
      : "Загрузите видео для OLV";

  const uploadHint =
    filters.creativeType === "banner"
      ? "PNG, JPG, WebP до 15 МБ"
      : "MP4, MOV, WebM до 100 МБ";

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center bg-grid pb-12 pt-24">
        <div className="bg-radial pointer-events-none absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">
              Анализ <span className="text-teal-400">креатива</span>
            </h1>
            <p className="mt-2 text-zinc-400">
              Выберите параметры размещения, загрузите баннер или OLV-ролик и
              получите прогноз CTR или VTR с рекомендациями по улучшению.
            </p>
          </div>

          {stage === "upload" && (
            <div className="page-transition space-y-6">
              <FilterPanel filters={filters} onChange={handleFiltersChange} />

              <div
                className={`upload-zone glass-card flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-6 border-2 border-dashed border-white/10 p-12 ${
                  dragging ? "dragging" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
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
                      uploadLabel
                    )}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    или нажмите для выбора файла
                  </p>
                </div>

                <div className="text-xs text-zinc-600">{uploadHint}</div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
                  {error}
                </div>
              ) : null}

              {asset ? (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="glass-card overflow-hidden p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">Выбранный креатив</div>
                      <div className="text-xs text-zinc-500">{asset.name}</div>
                    </div>

                    {asset.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.url}
                        alt="Выбранный креатив"
                        className="w-full rounded-xl object-contain"
                        style={{ maxHeight: 320 }}
                      />
                    ) : (
                      <video
                        src={asset.url}
                        className="w-full rounded-xl bg-black object-contain"
                        style={{ maxHeight: 320 }}
                        controls
                        playsInline
                      />
                    )}
                  </div>

                  <div className="glass-card flex flex-col justify-between gap-5 p-6">
                    <div>
                      <div className="text-sm font-semibold">Готово к анализу</div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        После запуска вы получите прогноз{" "}
                        <span className="text-zinc-200">
                          {filters.kpi.toUpperCase()}
                        </span>{" "}
                        и рекомендации по улучшению креатива.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleAnalyze}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-500 px-8 text-base font-medium text-black transition-all hover:bg-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
                      >
                        Проанализировать
                      </button>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/10 px-8 text-sm text-zinc-300 transition-all hover:border-white/20 hover:bg-white/5"
                      >
                        Заменить файл
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {stage === "loading" && (
            <AnalysisLoader creativeType={filters.creativeType} kpi={filters.kpi} />
          )}

          {stage === "result" && result && asset && (
            <AnalysisResult
              result={result}
              assetKind={asset.kind}
              assetUrl={asset.url}
              onReset={reset}
            />
          )}
        </div>
      </main>
    </>
  );
}
