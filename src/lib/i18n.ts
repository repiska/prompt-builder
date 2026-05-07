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
