// Mock AI analysis engine
// Designed for easy replacement with real AI (Claude API / OpenAI Vision)

import { Filters, CtrPrediction, predictCtr } from "./filters";

export interface AnalysisResult {
  score: number;
  efficiency: string;
  prediction: CtrPrediction;
  filters: Filters;
  elements: {
    text: { score: number; label: string; details: string };
    visual: { score: number; label: string; details: string };
    cta: { score: number; label: string; details: string };
    composition: { score: number; label: string; details: string };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface AnalysisTemplate {
  score: number;
  efficiency: string;
  elements: AnalysisResult["elements"];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const analysisTemplates: AnalysisTemplate[] = [
  {
    score: 78,
    efficiency: "Высокая",
    elements: {
      text: { score: 72, label: "Текст", details: "Заголовок читаемый, но длинноват. Рекомендуется сократить до 5-7 слов для лучшего восприятия." },
      visual: { score: 85, label: "Визуал", details: "Хороший контраст и цветовая гамма. Главный объект выделен, фокус внимания направлен верно." },
      cta: { score: 65, label: "Призыв к действию", details: "CTA присутствует, но недостаточно заметен. Увеличьте размер кнопки и контраст." },
      composition: { score: 80, label: "Композиция", details: "Сбалансированная компоновка элементов. Визуальная иерархия выстроена корректно." },
    },
    strengths: [
      "Сильная визуальная иерархия",
      "Уместная цветовая палитра",
      "Продукт в фокусе внимания",
    ],
    weaknesses: [
      "CTA-кнопка малозаметна",
      "Заголовок перегружен текстом",
    ],
    recommendations: [
      "Сделайте CTA-кнопку более контрастной и увеличьте её размер",
      "Сократите заголовок до 5-7 слов",
      "Добавьте элемент срочности (ограниченное предложение, таймер)",
    ],
  },
  {
    score: 62,
    efficiency: "Средняя",
    elements: {
      text: { score: 55, label: "Текст", details: "Слишком много текста на креативе. Читабельность снижена из-за мелкого шрифта." },
      visual: { score: 70, label: "Визуал", details: "Изображение качественное, но фон конкурирует с основным сообщением." },
      cta: { score: 50, label: "Призыв к действию", details: "CTA отсутствует или не выделен. Пользователь не понимает, что делать дальше." },
      composition: { score: 68, label: "Композиция", details: "Элементы расположены хаотично. Нет чёткой точки входа для взгляда." },
    },
    strengths: [
      "Качественное изображение продукта",
      "Узнаваемый бренд",
    ],
    weaknesses: [
      "Отсутствует явный CTA",
      "Перегруженность текстом",
      "Нет визуальной иерархии",
    ],
    recommendations: [
      "Добавьте яркую CTA-кнопку с чётким призывом",
      "Уберите 60% текста, оставьте только ключевое сообщение",
      "Упростите фон, чтобы продукт был в центре внимания",
      "Используйте правило третей для композиции",
    ],
  },
  {
    score: 91,
    efficiency: "Очень высокая",
    elements: {
      text: { score: 88, label: "Текст", details: "Краткий, ёмкий заголовок. Шрифт хорошо читается, контраст с фоном высокий." },
      visual: { score: 95, label: "Визуал", details: "Отличная работа с цветом и светом. Продукт представлен максимально привлекательно." },
      cta: { score: 90, label: "Призыв к действию", details: "CTA яркий, заметный и понятный. Расположен в оптимальной зоне внимания." },
      composition: { score: 89, label: "Композиция", details: "Идеальный баланс элементов. Взгляд естественно следует от заголовка к продукту и CTA." },
    },
    strengths: [
      "Превосходная визуальная иерархия",
      "Чёткий и заметный CTA",
      "Минимализм в тексте — только суть",
      "Эмоциональный визуал",
    ],
    weaknesses: [
      "Можно усилить элемент социального доказательства",
    ],
    recommendations: [
      "Добавьте отзыв или рейтинг для повышения доверия",
      "Протестируйте альтернативную цветовую схему CTA",
    ],
  },
  {
    score: 45,
    efficiency: "Низкая",
    elements: {
      text: { score: 35, label: "Текст", details: "Текст плохо читается из-за низкого контраста с фоном. Шрифт слишком мелкий." },
      visual: { score: 50, label: "Визуал", details: "Изображение размытое или низкого качества. Не вызывает эмоциональный отклик." },
      cta: { score: 40, label: "Призыв к действию", details: "CTA сливается с остальными элементами. Нет чёткого указания на действие." },
      composition: { score: 48, label: "Композиция", details: "Элементы конкурируют за внимание. Нет единой точки фокуса." },
    },
    strengths: [
      "Релевантная тематика",
    ],
    weaknesses: [
      "Низкое качество изображения",
      "Нечитаемый текст",
      "CTA не выделен",
      "Хаотичная композиция",
    ],
    recommendations: [
      "Используйте изображение высокого разрешения",
      "Увеличьте контраст текста — белый на тёмном или тёмный на светлом",
      "Выделите CTA цветом и размером",
      "Определите одну ключевую мысль и постройте вокруг неё композицию",
      "Добавьте «воздух» между элементами",
    ],
  },
  {
    score: 83,
    efficiency: "Высокая",
    elements: {
      text: { score: 80, label: "Текст", details: "Хороший баланс информативности и краткости. Ключевое УТП считывается за 2 секунды." },
      visual: { score: 88, label: "Визуал", details: "Яркие, насыщенные цвета привлекают внимание. Продукт показан в контексте использования." },
      cta: { score: 75, label: "Призыв к действию", details: "CTA присутствует и заметен, но формулировка могла бы быть более побуждающей." },
      composition: { score: 85, label: "Композиция", details: "Профессиональная компоновка. Z-паттерн просмотра реализован корректно." },
    },
    strengths: [
      "Продукт показан в контексте использования",
      "Яркая, запоминающаяся палитра",
      "Быстро считываемое УТП",
    ],
    weaknesses: [
      "CTA можно сделать более побуждающим",
      "Не хватает элемента ограниченности предложения",
    ],
    recommendations: [
      "Замените «Подробнее» на «Получить скидку 30%» или аналогичный побуждающий текст",
      "Добавьте таймер или фразу «Только до...»",
      "Рассмотрите добавление иконок доверия (гарантия, бесплатная доставка)",
    ],
  },
];

export function getRandomAnalysis(filters: Filters): AnalysisResult {
  const idx = Math.floor(Math.random() * analysisTemplates.length);
  const tpl = JSON.parse(JSON.stringify(analysisTemplates[idx])) as AnalysisTemplate;

  // Лёгкая рандомизация скоринга (±5)
  const jitter = () => Math.floor(Math.random() * 11) - 5;
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const score = clamp(tpl.score + jitter());
  const elements = {
    text: { ...tpl.elements.text, score: clamp(tpl.elements.text.score + jitter()) },
    visual: { ...tpl.elements.visual, score: clamp(tpl.elements.visual.score + jitter()) },
    cta: { ...tpl.elements.cta, score: clamp(tpl.elements.cta.score + jitter()) },
    composition: { ...tpl.elements.composition, score: clamp(tpl.elements.composition.score + jitter()) },
  };

  const prediction = predictCtr(score, filters);

  // Контекстуальные рекомендации зависят от выбранной площадки
  const platformTip = getPlatformTip(filters);
  const recommendations = platformTip
    ? [...tpl.recommendations, platformTip]
    : tpl.recommendations;

  return {
    score,
    efficiency: tpl.efficiency,
    prediction,
    filters,
    elements,
    strengths: tpl.strengths,
    weaknesses: tpl.weaknesses,
    recommendations,
  };
}

function getPlatformTip(filters: Filters): string | null {
  switch (filters.platform) {
    case "instagram":
      return "Для Instagram адаптируйте креатив под формат 9:16 и добавьте динамику в первые 3 секунды";
    case "vk":
      return "Для ВКонтакте усильте эмоциональный посыл — пользователи площадки лучше реагируют на эмпатичный контент";
    case "yandex":
      return "Для Яндекс.Директ сделайте акцент на УТП и цене — пользователь ищет конкретное решение";
    case "telegram":
      return "Для Telegram Ads сократите текст до 1-2 фраз и используйте нативный, не «рекламный» тон";
    case "mytarget":
      return "Для myTarget учитывайте старшую аудиторию: укрупните шрифт и используйте простые формулировки";
    default:
      return null;
  }
}
