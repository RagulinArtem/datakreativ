import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-grid">
          <div className="bg-radial absolute inset-0" />
          {/* Floating orbs */}
          <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-teal-500/5 blur-[100px]" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-teal-400/3 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <div className="animate-fade-in-up opacity-0">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-glow" />
                AI-платформа для анализа креативов
              </div>
            </div>

            <h1 className="animate-fade-in-up opacity-0 animate-delay-100 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Оцените эффективность
              <br />
              <span className="gradient-text">до запуска</span>
            </h1>

            <p className="animate-fade-in-up opacity-0 animate-delay-200 mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
              Настройте параметры кампании, загрузите креатив и получите
              предиктивный CTR, оценку эффективности и рекомендации
              по улучшению — за секунды.
            </p>

            <div className="animate-fade-in-up opacity-0 animate-delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/analyze"
                className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-500 px-8 text-base font-medium text-black transition-all hover:bg-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
              >
                Анализировать креатив
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-8 text-base text-zinc-300 transition-all hover:border-white/20 hover:bg-white/5"
              >
                Как это работает
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 animate-bounce">
            <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Всё что нужно для <span className="text-teal-400">оценки креатива</span>
              </h2>
              <p className="mt-4 text-zinc-400">
                Комплексный анализ каждого элемента вашей рекламы
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  ),
                  title: "Прогноз CTR",
                  desc: "Предиктивный CTR с доверительным интервалом, сравнение с бенчмарком площадки",
                },
                {
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: "Контекст кампании",
                  desc: "Учёт ниши, площадки, цели и аудитории — прогноз меняется под ваши параметры",
                },
                {
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  ),
                  title: "Рекомендации",
                  desc: "Конкретные советы по улучшению для повышения эффективности",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="glass-card group p-8 transition-all duration-300 hover:border-teal-500/20 hover:bg-white/[0.04]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 transition-colors group-hover:bg-teal-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Три шага к <span className="text-teal-400">результату</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Задайте параметры",
                  desc: "Ниша, площадка, цель кампании и характеристики целевой аудитории",
                },
                {
                  step: "02",
                  title: "Загрузите креатив",
                  desc: "Перетащите изображение баннера — нейросеть проанализирует его в контексте кампании",
                },
                {
                  step: "03",
                  title: "Получите прогноз",
                  desc: "Предиктивный CTR, разбор элементов, сильные/слабые стороны и рекомендации",
                },
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/5 text-2xl font-bold text-teal-400">
                    {item.step}
                  </div>
                  {i < 2 && (
                    <div className="absolute left-[calc(50%+48px)] top-8 hidden h-px w-[calc(100%-96px)] bg-gradient-to-r from-teal-500/30 to-transparent md:block" />
                  )}
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/analyze"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-teal-500 px-10 text-lg font-medium text-black transition-all hover:bg-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
              >
                Попробовать бесплатно
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span className="text-sm font-semibold">
                  Дата<span className="text-teal-400">Креатив</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500">
                AI-платформа для анализа рекламных креативов
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
