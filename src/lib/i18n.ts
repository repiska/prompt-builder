// Minimal i18n: a translation dictionary and a hook keyed off the editor store's `lang`.

export type Lang = 'en' | 'ru'

type Dict = Record<string, { en: string; ru: string }>

const DICT: Dict = {
  // App chrome
  'app.title': { en: 'AI Photo Prompt Builder', ru: 'Билдер AI-промптов для фото' },
  'app.subtitle': {
    en: 'Visual editor for catalog · lifestyle · UGC prompts — v3.0 architecture',
    ru: 'Визуальный редактор для catalog · lifestyle · UGC-промптов — v3.0',
  },

  // Generation type
  'gen.label': { en: 'Generation type', ru: 'Тип генерации' },
  'gen.catalog': { en: 'Catalog', ru: 'Каталог' },
  'gen.catalog.desc': {
    en: 'Studio backdrop, controlled lighting',
    ru: 'Студийный фон, контролируемый свет',
  },
  'gen.lifestyle': { en: 'Lifestyle', ru: 'Lifestyle' },
  'gen.lifestyle.desc': {
    en: 'Real-world location, integrated lighting',
    ru: 'Реальная локация, интегрированный свет',
  },
  'gen.ugc': { en: 'UGC', ru: 'UGC' },
  'gen.ugc.desc': { en: 'Authentic smartphone photo', ru: 'Аутентичное фото со смартфона' },

  // Use case
  'uc.label': { en: 'Use case (optional filter)', ru: 'Use case (опц. фильтр)' },
  'uc.all': { en: 'All use cases', ru: 'Все use cases' },
  'uc.UC1': { en: 'Evening / cocktail', ru: 'Вечернее / коктейльное' },
  'uc.UC2': { en: 'Office / business', ru: 'Офисное / business' },
  'uc.UC3': { en: 'Summer / resort', ru: 'Летнее / курорт' },
  'uc.UC4': { en: 'Casual / dress', ru: 'Сарафан / casual' },

  // Recipe panel
  'recipe.label': { en: 'Recipe', ru: 'Рецепт' },
  'recipe.modified': { en: 'modified', ru: 'изменён' },
  'recipe.builtin': { en: 'Built-in', ru: 'Встроенные' },
  'recipe.custom': { en: 'Custom', ru: 'Свои' },
  'recipe.saveAs': { en: 'Save as recipe', ru: 'Сохранить как рецепт' },
  'recipe.saveName': { en: 'Recipe name', ru: 'Название рецепта' },
  'recipe.save': { en: 'Save', ru: 'Сохранить' },
  'recipe.cancel': { en: 'Cancel', ru: 'Отмена' },
  'recipe.export': { en: 'Export JSON', ru: 'Экспорт JSON' },
  'recipe.import': { en: 'Import', ru: 'Импорт' },
  'recipe.importFailed': {
    en: 'Import failed: invalid recipe JSON',
    ru: 'Импорт не удался: невалидный JSON',
  },
  'recipe.manageCustom': { en: 'Manage custom recipes', ru: 'Управление пользовательскими' },
  'recipe.delete': { en: 'delete', ru: 'удалить' },
  'recipe.confirmDelete': { en: 'Delete "{name}"?', ru: 'Удалить «{name}»?' },
  'recipe.resetAll': { en: 'Reset to defaults', ru: 'Сбросить к дефолтам' },

  // Mode
  'mode.label': { en: 'Editing mode', ru: 'Режим редактирования' },
  'mode.recipe': { en: 'recipe', ru: 'рецепт' },
  'mode.block': { en: 'block', ru: 'блок' },
  'mode.expert': { en: 'expert', ru: 'эксперт' },
  'mode.recipe.help': {
    en: 'Pick a built-in recipe and copy. Fastest path.',
    ru: 'Выберите готовый рецепт и скопируйте. Самый быстрый путь.',
  },
  'mode.block.help': {
    en: 'Swap blocks. Expert parameters hidden under each card.',
    ru: 'Переключайте блоки. Параметры скрыты под каждой карточкой.',
  },
  'mode.expert.help': {
    en: 'Every parameter visible — slidable, swappable, savable.',
    ru: 'Все параметры видны — слайдеры, цвета, числа.',
  },

  // Validation
  'val.label': { en: 'Validation', ru: 'Валидация' },
  'val.allPassed': { en: 'All checks passed', ru: 'Все проверки пройдены' },
  'val.error': { en: 'error', ru: 'ошибка' },
  'val.warning': { en: 'warning', ru: 'предупреждение' },
  'val.resolveErrors': {
    en: 'Resolve errors in the validation panel before sending this prompt.',
    ru: 'Сначала исправьте ошибки в панели валидации.',
  },

  // Block card / center panel
  'block.BASE': { en: 'Base', ru: 'База' },
  'block.POSE': { en: 'Pose', ru: 'Поза' },
  'block.LOCATION': { en: 'Location & Lighting', ru: 'Локация и свет' },
  'block.CAMERA': { en: 'Camera', ru: 'Камера' },
  'block.GRADE': { en: 'Grade (Pass 2)', ru: 'Grade (пасс 2)' },
  'block.UGC_SCENARIO': { en: 'Scenario', ru: 'Сценарий' },
  'block.required': { en: 'Required', ru: 'Обязательно' },
  'block.pick': { en: 'Pick a {type}', ru: 'Выберите: {type}' },
  'block.choose': { en: 'Choose…', ru: 'Выбрать…' },
  'block.expertParams': { en: 'Expert parameters', ru: 'Эксперт-параметры' },
  'block.resetSlots': { en: 'Reset to defaults', ru: 'Сбросить к дефолтам' },
  'block.addGrade': { en: '+ Add Pass-2 Grade block', ru: '+ Добавить Grade-блок (пасс 2)' },
  'block.removeTitle': { en: 'Remove this block', ru: 'Убрать блок' },
  'block.baseParams': { en: 'Base parameters', ru: 'Параметры базы' },
  'block.globalBase': { en: 'Global / base', ru: 'Глобальное / база' },
  'block.indicator.error': { en: 'required', ru: 'обязат.' },
  'block.indicator.warning': { en: 'check', ru: 'проверьте' },
  'block.indicator.ok': { en: 'ok', ru: 'ок' },

  // Right panel
  'prompt.title': { en: 'Live prompt', ru: 'Живой промпт' },
  'prompt.pass1': { en: 'Pass 1', ru: 'Пасс 1' },
  'prompt.pass2': { en: 'Pass 2', ru: 'Пасс 2' },
  'prompt.noPass2': {
    en: '(no Pass 2 — add a GRADE block)',
    ru: '(нет пасса 2 — добавьте GRADE-блок)',
  },
  'prompt.copy': { en: 'Copy {pass}', ru: 'Скопировать {pass}' },
  'prompt.copyBoth': { en: 'Copy both', ru: 'Оба пасса' },
  'prompt.copied': { en: 'Copied ✓', ru: 'Скопировано ✓' },
  'prompt.words': { en: 'words', ru: 'слов' },
  'prompt.chars': { en: 'chars', ru: 'симв.' },
  'prompt.perBlock': { en: 'Per-block breakdown', ru: 'По блокам' },
  'prompt.smallCopy': { en: 'copy', ru: 'копир.' },
  'prompt.smallCopied': { en: 'copied', ru: 'скопир.' },

  // Mobile tabs
  'tab.setup': { en: 'Setup', ru: 'Настройка' },
  'tab.blocks': { en: 'Blocks', ru: 'Блоки' },
  'tab.prompt': { en: 'Prompt', ru: 'Промпт' },

  // Header
  'header.lang': { en: 'Language', ru: 'Язык' },

  // Media type toggle
  'media.photo': { en: 'Photo', ru: 'Фото' },
  'media.video': { en: 'Video', ru: 'Видео' },

  // Video mode panel
  'video.modeTitle': { en: 'Veo 3.1 — Catalog video (MVP)', ru: 'Veo 3.1 — Каталожное видео (MVP)' },
  'video.composedPrompt': { en: 'Composed prompt', ru: 'Готовый промпт' },
  'video.negativePrompt': { en: 'Negative prompt', ru: 'Негативный промпт' },
  'video.apiParams': { en: 'API parameters', ru: 'Параметры API' },
  'video.warnings': { en: 'Warnings', ru: 'Предупреждения' },
  'video.copy': { en: 'Copy', ru: 'Скопировать' },
  'video.copied': { en: 'Copied', ru: 'Скопировано' },
  'video.recipeDuration': { en: 'Duration', ru: 'Длительность' },
  'video.recipeAspect': { en: 'Aspect ratio', ru: 'Соотношение сторон' },
  'video.recipeResolution': { en: 'Resolution', ru: 'Разрешение' },
  'video.recipeTier': { en: 'Tier', ru: 'Тир' },
  'video.recipeRefCount': { en: 'Reference images', ru: 'Референс-изображения' },
  'video.recipeNotFound': { en: 'Recipe not found.', ru: 'Рецепт не найден.' },

  // Video sub-tabs
  'video.subtabSingleClip': { en: 'Single clip', ru: 'Один клип' },
  'video.subtabProject': { en: 'Project', ru: 'Проект' },

  // Project meta
  'video.projectName': { en: 'Project name', ru: 'Название проекта' },
  'video.projectNamePlaceholder': { en: 'Untitled project', ru: 'Без названия' },

  // Shared references
  'video.sharedReferences': { en: 'Reference images', ru: 'Опорные изображения' },
  'video.sharedReferencesHelp': {
    en: 'Up to 3 reference images. JPG / PNG only. Veo 3.1 will preserve their identity across all clips.',
    ru: 'До 3 опорных изображений. Только JPG / PNG. Veo 3.1 сохранит их облик во всех клипах.',
  },
  'video.referenceFormatError': {
    en: 'JPG or PNG only. WebP/HEIC not supported by Veo 3.1.',
    ru: 'Только JPG или PNG. WebP/HEIC не поддерживаются Veo 3.1.',
  },
  'video.referenceTooLargeError': {
    en: 'File exceeds 5 MB limit.',
    ru: 'Файл превышает ограничение в 5 МБ.',
  },
  'video.referenceRoleModel': { en: 'Model', ru: 'Модель' },
  'video.referenceRoleGarment': { en: 'Garment', ru: 'Одежда' },
  'video.referenceRoleLocation': { en: 'Location', ru: 'Локация' },
  'video.referenceDescriptionPlaceholderModel': {
    en: 'the woman in the reference image',
    ru: 'девушка на опорном изображении',
  },
  'video.referenceDescriptionPlaceholderGarment': {
    en: 'the beige trench coat in the reference image',
    ru: 'бежевый тренч на опорном изображении',
  },
  'video.referenceDescriptionPlaceholderLocation': {
    en: 'a sunlit Parisian café terrace at golden hour',
    ru: 'солнечная парижская терраса в час золотого света',
  },
  'video.referenceUpload': { en: 'Choose image', ru: 'Выбрать изображение' },
  'video.referenceRemove': { en: 'Remove', ru: 'Удалить' },

  // Shared identity
  'video.sharedIdentity': { en: 'Identity descriptor', ru: 'Описание персонажа' },
  'video.sharedIdentityPlaceholder': {
    en: 'Same female protagonist, mid-20s, shoulder-length brown hair, oversized beige blazer.',
    ru: 'Одна и та же героиня, ~25 лет, каре-русые волосы до плеч, оверсайз-пиджак цвета беж.',
  },
  'video.sharedIdentityHelp': {
    en: 'Repeated verbatim in every clip prompt to anchor the subject. Exact phrasing reduces drift.',
    ru: 'Дословно вставляется в промпт каждого клипа — фиксирует персонажа и снижает дрейф.',
  },

  // Continuity lock
  'video.continuityLock': { en: 'Continuity lock', ru: 'Continuity (фиксация деталей)' },
  'video.continuityHelp': {
    en: 'Injected into every clip prompt for cross-clip consistency.',
    ru: 'Добавляется в каждый клип для единообразия монтажа.',
  },
  'video.continuityWardrobe': { en: 'Wardrobe', ru: 'Гардероб' },
  'video.continuityWardrobePlaceholder': {
    en: 'beige trench, white tee, straight-leg jeans',
    ru: 'бежевый тренч, белая футболка, прямые джинсы',
  },
  'video.continuityLens': { en: 'Lens', ru: 'Объектив' },
  'video.continuityLensPlaceholder': { en: '35mm equivalent', ru: '35 мм эквивалент' },
  'video.continuityGrade': { en: 'Grade', ru: 'Грейд' },
  'video.continuityGradePlaceholder': {
    en: 'warm filmic, soft contrast',
    ru: 'тёплое кино, мягкий контраст',
  },
  'video.continuityLighting': { en: 'Lighting', ru: 'Свет' },
  'video.continuityLightingPlaceholder': {
    en: 'soft window light, no studio fixtures',
    ru: 'мягкий оконный свет, без студийных приборов',
  },
  'video.continuityTimeOfDay': { en: 'Time of day', ru: 'Время суток' },
  'video.continuityTimeOfDayPlaceholder': {
    en: 'late afternoon golden hour',
    ru: 'послеполуденный золотой час',
  },

  // Seed
  'video.seed': { en: 'Shared seed', ru: 'Общий seed' },
  'video.seedHelp': {
    en: 'Optional fixed seed. Same seed across clips improves identity consistency.',
    ru: 'Необязательный фиксированный seed. Одинаковый seed улучшает единообразие персонажа.',
  },
  'video.seedPlaceholder': { en: 'e.g. 42', ru: 'напр. 42' },

  // Audio strategy
  'video.audioStrategy': { en: 'Audio strategy', ru: 'Стратегия аудио' },
  'video.audioStrategySilent': { en: 'Silent + voiceover overlay', ru: 'Тишина + voiceover' },
  'video.audioStrategySilentHelp': {
    en: 'Recommended for multi-clip. Generate clips silent, then overlay ElevenLabs voiceover in CapCut.',
    ru: 'Рекомендуется для мульти-клипов. Генерируйте без звука, затем накладывайте голос ElevenLabs в CapCut.',
  },
  'video.audioStrategyNative': { en: 'Native audio per clip', ru: 'Нативный звук на клип' },
  'video.audioStrategyNativeHelp': {
    en: 'Each clip generates its own Veo audio. Transitions may sound jarring when stitched.',
    ru: 'Каждый клип генерирует свой звук Veo. При склейке переходы могут звучать резко.',
  },

  // Voiceover script
  'video.voiceoverScript': { en: 'Voiceover script', ru: 'Скрипт голоса' },
  'video.voiceoverLang': { en: 'Script language', ru: 'Язык скрипта' },
  'video.voiceoverVoice': { en: 'Voice preset', ru: 'Голосовой пресет' },
  'video.voiceoverText': { en: 'Script text', ru: 'Текст скрипта' },
  'video.voiceoverScriptPlaceholderEn': {
    en: 'Paste the script you will record or generate with ElevenLabs...',
    ru: 'Вставьте скрипт для записи или генерации в ElevenLabs...',
  },
  'video.voiceoverScriptPlaceholderRu': {
    en: 'Вставьте текст для озвучки...',
    ru: 'Вставьте текст для озвучки...',
  },
  'video.voiceoverHelp': {
    en: 'Paste this script into ElevenLabs (or equivalent) and overlay the audio in CapCut after generating clips.',
    ru: 'Вставьте скрипт в ElevenLabs (или аналог) и наложите аудио в CapCut после генерации клипов.',
  },

  // Clips
  'video.clips': { en: 'Clips', ru: 'Клипы' },
  'video.addClip': { en: 'Add clip', ru: 'Добавить клип' },
  'video.clipRole.hook': { en: 'Hook', ru: 'Хук' },
  'video.clipRole.demo': { en: 'Demo', ru: 'Демо' },
  'video.clipRole.reaction': { en: 'Reaction', ru: 'Реакция' },
  'video.clipRole.cta': { en: 'CTA', ru: 'CTA' },
  'video.clipRole.b_roll': { en: 'B-roll', ru: 'B-roll' },
  'video.recipe': { en: 'Recipe', ru: 'Рецепт' },
  'video.noRecipeSelected': { en: 'No recipe selected', ru: 'Рецепт не выбран' },
  'video.removeClip': { en: 'Remove clip', ru: 'Удалить клип' },
  'video.addFirstClip': { en: 'Add your first clip', ru: 'Добавить первый клип' },
  'video.noClipsYet': { en: 'No clips yet.', ru: 'Клипов пока нет.' },

  // Voiceover hint (single-clip Cyrillic detection)
  'video.voiceoverHint': { en: 'Voiceover hint', ru: 'Подсказка для озвучки' },
  'video.voiceoverHintHelp': {
    en: "This dialogue contains Russian. Veo doesn't reliably lip-sync Cyrillic — generate silent and overlay this script via ElevenLabs in CapCut.",
    ru: 'Диалог на русском. Veo плохо синхронизирует губы по-русски — сгенерируйте без звука и наложите озвучку через ElevenLabs в CapCut.',
  },
  'video.voiceoverHintSuggestedVoice': { en: 'Suggested voice', ru: 'Рекомендуемый голос' },

  // Animate-from-photo tip
  'video.animateTip': {
    en: "Tip: 'Animate' recipes work on any product photo without per-SKU rewriting.",
    ru: "Совет: рецепты «Анимация» работают на любом фото товара без переписывания под артикул.",
  },

  // Project output
  'video.composedClipPrompts': { en: 'Composed clip prompts', ru: 'Готовые промпты клипов' },
  'video.continuityChecklist': { en: 'Continuity checklist', ru: 'Чеклист continuity' },
  'video.projectWarnings': { en: 'Project warnings', ru: 'Предупреждения проекта' },
  'video.copyAll': { en: 'Copy all', ru: 'Скопировать всё' },
  'video.clipN': { en: 'Clip {n}', ru: 'Клип {n}' },
  'video.clipRoleLabel': { en: 'Role', ru: 'Роль' },
}

export function t(lang: Lang, key: string, params?: Record<string, string>): string {
  const entry = DICT[key]
  let str = entry ? entry[lang] : key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replaceAll(`{${k}}`, v)
    }
  }
  return str
}

/** Pick the localized variant of a record's text field — falls back to the EN field. */
export function loc(obj: object, lang: Lang, field: string): string {
  const o = obj as Record<string, unknown>
  if (lang === 'ru') {
    const ru = o[`${field}_ru`]
    if (typeof ru === 'string' && ru.length > 0) return ru
  }
  const en = o[field]
  return typeof en === 'string' ? en : ''
}
