// Mock AI analysis engine for MVP.
// The structure is ready to be replaced with a real model, but the output is
// intentionally human-readable and tailored to the selected campaign context.

import {
  Filters,
  PerformancePrediction,
  predictPerformance,
} from "./filters";

interface AnalysisItem {
  score: number;
  label: string;
  details: string;
}

export interface AnalysisResult {
  score: number;
  efficiency: string;
  prediction: PerformancePrediction;
  filters: Filters;
  elements: {
    text: AnalysisItem;
    visual: AnalysisItem;
    message: AnalysisItem;
    cta: AnalysisItem;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface AnalysisTemplate {
  score: number;
  elements: AnalysisResult["elements"];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const bannerTemplates: AnalysisTemplate[] = [
  {
    score: 79,
    elements: {
      text: {
        score: 74,
        label: "Текст",
        details:
          "Текст читается быстро, но заголовок можно сократить, чтобы усилить первый контакт.",
      },
      visual: {
        score: 82,
        label: "Визуал",
        details:
          "Контраст между главным объектом и фоном хороший, внимание сразу уходит в нужную зону.",
      },
      message: {
        score: 76,
        label: "Ключевое сообщение",
        details:
          "Основное обещание понятно, но можно сделать его конкретнее и убрать второстепенные акценты.",
      },
      cta: {
        score: 68,
        label: "CTA",
        details:
          "Призыв к действию есть, но он не доминирует в макете и теряется рядом с текстом.",
      },
    },
    strengths: [
      "Считываемый визуальный фокус",
      "Понятная структура баннера",
      "Креатив не перегружен лишними элементами",
    ],
    weaknesses: [
      "CTA недостаточно заметен",
      "Заголовок можно сделать короче",
    ],
    recommendations: [
      "Усилить контраст CTA и добавить более прямую формулировку действия",
      "Сократить заголовок до одной ключевой мысли",
      "Оставить один главный визуальный акцент вместо нескольких конкурирующих деталей",
    ],
  },
  {
    score: 63,
    elements: {
      text: {
        score: 58,
        label: "Текст",
        details:
          "Текста заметно больше, чем нужно для первого экрана, из-за этого баннер читается медленно.",
      },
      visual: {
        score: 66,
        label: "Визуал",
        details:
          "Визуал качественный, но фон и декоративные элементы перетягивают внимание на себя.",
      },
      message: {
        score: 60,
        label: "Ключевое сообщение",
        details:
          "Смысл креатива понятен только после чтения нескольких блоков, а не с первого взгляда.",
      },
      cta: {
        score: 54,
        label: "CTA",
        details:
          "Призыв к действию либо слишком общий, либо визуально не отделён от остальных элементов.",
      },
    },
    strengths: [
      "Есть базовая логика композиции",
      "Сообщение релевантно задаче кампании",
    ],
    weaknesses: [
      "Перегрузка второстепенными деталями",
      "CTA не ведёт пользователя к следующему шагу",
      "Сообщение читается не с первого взгляда",
    ],
    recommendations: [
      "Убрать часть текста и оставить только главное обещание",
      "Ослабить фон или декоративные элементы, чтобы усилить продукт",
      "Сделать CTA более конкретным: например, \"Получить предложение\" вместо нейтральной формулировки",
    ],
  },
  {
    score: 87,
    elements: {
      text: {
        score: 84,
        label: "Текст",
        details:
          "Короткий и понятный заголовок хорошо поддерживает сценарий быстрого сканирования баннера.",
      },
      visual: {
        score: 90,
        label: "Визуал",
        details:
          "Главный объект выделен уверенно, а цветовые контрасты помогают быстро считать смысл.",
      },
      message: {
        score: 85,
        label: "Ключевое сообщение",
        details:
          "Сообщение раскрыто ясно: пользователь понимает, что предлагают и почему это важно.",
      },
      cta: {
        score: 82,
        label: "CTA",
        details:
          "CTA заметен и поддерживает остальную структуру, не споря с главным сообщением.",
      },
    },
    strengths: [
      "Быстро считываемое УТП",
      "Хороший баланс текста и визуала",
      "CTA естественно завершает маршрут внимания",
    ],
    weaknesses: [
      "Можно протестировать более сильный триггер срочности",
    ],
    recommendations: [
      "Добавить ограничитель по времени или количеству, если это уместно для оффера",
      "Проверить альтернативную формулировку CTA с более сильным действием",
    ],
  },
];

const olvTemplates: AnalysisTemplate[] = [
  {
    score: 81,
    elements: {
      text: {
        score: 75,
        label: "Текст / титры",
        details:
          "Титры читаемы, но первые секунды можно сделать ещё лаконичнее, чтобы не перегружать старт ролика.",
      },
      visual: {
        score: 84,
        label: "Первые кадры",
        details:
          "Старт ролика визуально цепляет и быстро задаёт контекст, что хорошо для удержания просмотра.",
      },
      message: {
        score: 79,
        label: "Ключевое сообщение",
        details:
          "Главное обещание проявляется вовремя, но бренд можно вывести в кадр чуть раньше.",
      },
      cta: {
        score: 70,
        label: "CTA / финальный экран",
        details:
          "Финальный экран понятен, однако призыв к действию не самый сильный с точки зрения клика или досмотра.",
      },
    },
    strengths: [
      "Есть хороший хук в начале ролика",
      "Визуальный темп удерживает внимание",
      "Сообщение не теряется внутри сюжета",
    ],
    weaknesses: [
      "Бренд можно показать раньше",
      "Финальный CTA можно сделать убедительнее",
    ],
    recommendations: [
      "Вынести бренд или логотип ближе к первым секундам ролика",
      "Сделать финальный экран контрастнее и короче",
      "Упростить титры в первой половине ролика",
    ],
  },
  {
    score: 66,
    elements: {
      text: {
        score: 61,
        label: "Текст / титры",
        details:
          "Титров многовато для мобильного просмотра, поэтому часть смысла теряется без паузы.",
      },
      visual: {
        score: 64,
        label: "Первые кадры",
        details:
          "Первые секунды не дают достаточно сильного повода смотреть дальше, ролик стартует слишком спокойно.",
      },
      message: {
        score: 63,
        label: "Ключевое сообщение",
        details:
          "Основной смысл проявляется не сразу, из-за этого ролик теряет часть потенциальных досмотров.",
      },
      cta: {
        score: 56,
        label: "CTA / финальный экран",
        details:
          "Финальная сцена передаёт действие неявно, поэтому клик или переход выглядят необязательными.",
      },
    },
    strengths: [
      "Есть логика сюжета",
      "Ролик можно улучшить точечными правками без полной пересборки",
    ],
    weaknesses: [
      "Слабый хук в начале",
      "Сообщение раскрывается поздно",
      "Финальный кадр не фиксирует действие",
    ],
    recommendations: [
      "Перенести ключевую мысль в первые 3 секунды ролика",
      "Сократить количество титров и укрупнить основной текст",
      "Сделать финальный экран более конкретным: одно действие, один акцент",
    ],
  },
  {
    score: 89,
    elements: {
      text: {
        score: 86,
        label: "Текст / титры",
        details:
          "Титры короткие и помогают ролику, не перегружая пользователя лишними словами.",
      },
      visual: {
        score: 91,
        label: "Первые кадры",
        details:
          "Старт ролика цепляет сразу и задаёт правильный темп для удержания внимания.",
      },
      message: {
        score: 88,
        label: "Ключевое сообщение",
        details:
          "Пользователь быстро понимает, о чём ролик и какую выгоду предлагает продукт.",
      },
      cta: {
        score: 84,
        label: "CTA / финальный экран",
        details:
          "Финальный экран чистый и понятный: сообщение завершает ролик без лишнего шума.",
      },
    },
    strengths: [
      "Сильный хук с первых секунд",
      "Чистая подача ключевого обещания",
      "Финальный экран не перегружен",
    ],
    weaknesses: [
      "Можно протестировать более выраженный бренд-момент в середине ролика",
    ],
    recommendations: [
      "Проверить альтернативный финальный кадр с более заметным брендингом",
      "Сохранить быстрый темп монтажа в начале ролика",
    ],
  },
];

export function getRandomAnalysis(filters: Filters): AnalysisResult {
  const templates =
    filters.creativeType === "banner" ? bannerTemplates : olvTemplates;
  const template = structuredClone(
    templates[Math.floor(Math.random() * templates.length)]
  );

  const jitter = () => Math.floor(Math.random() * 9) - 4;
  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const score = clamp(template.score + jitter());
  const elements = {
    text: {
      ...template.elements.text,
      score: clamp(template.elements.text.score + jitter()),
    },
    visual: {
      ...template.elements.visual,
      score: clamp(template.elements.visual.score + jitter()),
    },
    message: {
      ...template.elements.message,
      score: clamp(template.elements.message.score + jitter()),
    },
    cta: {
      ...template.elements.cta,
      score: clamp(template.elements.cta.score + jitter()),
    },
  };

  const prediction = predictPerformance(score, filters);
  const recommendations = dedupeRecommendations([
    ...template.recommendations,
    ...getContextualRecommendations(filters),
  ]).slice(0, 4);

  return {
    score,
    efficiency: getEfficiencyLabel(score),
    prediction,
    filters,
    elements,
    strengths: template.strengths,
    weaknesses: template.weaknesses,
    recommendations,
  };
}

function getContextualRecommendations(filters: Filters): string[] {
  const recommendations: string[] = [];

  if (filters.device === "mobile") {
    recommendations.push(
      "Проверьте, что ключевой текст и CTA считываются без приближения на mobile-экране"
    );
  }

  if (filters.creativeType === "banner") {
    if (filters.placementFormat === "native") {
      recommendations.push(
        "Для native-формата сделайте визуал менее похожим на классический баннер и ближе к контентной подаче"
      );
    }

    if (filters.placementFormat === "fullscreen") {
      recommendations.push(
        "Для fullscreen-формата оставьте один главный акцент на первом экране, чтобы избежать визуального шума"
      );
    }
  }

  if (filters.creativeType === "olv") {
    if (filters.videoLength === "30plus") {
      recommendations.push(
        "Сместите бренд и ключевое обещание ближе к началу ролика: в длинных видео удержание падает быстрее"
      );
    }

    if (filters.videoLength === "6s") {
      recommendations.push(
        "Для короткого ролика оставьте одну мысль и один CTA: 6 секунд не прощают лишние сообщения"
      );
    }

    if (filters.placementFormat === "rewarded") {
      recommendations.push(
        "В rewarded video важно показать ценность ролика до момента награды, иначе досмотр будет формальным"
      );
    }
  }

  if (filters.kpi === "ctr") {
    recommendations.push(
      "Если цель — CTR, сделайте действие максимально конкретным и визуально отделите CTA от остального сообщения"
    );
  }

  if (filters.kpi === "vtr") {
    recommendations.push(
      "Если цель — VTR, усилите первые секунды ролика и уберите все элементы, которые тормозят старт просмотра"
    );
  }

  return recommendations;
}

function getEfficiencyLabel(score: number): string {
  if (score >= 75) return "Выше среднего";
  if (score <= 54) return "Ниже среднего";
  return "Средний";
}

function dedupeRecommendations(items: string[]): string[] {
  return Array.from(new Set(items));
}
