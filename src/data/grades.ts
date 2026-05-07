import type { Block } from '../lib/types'

export const GRADE_BLOCKS: Block[] = [
  {
    type: 'GRADE',
    id: 'G_CAT',
    name: 'G_CAT — Catalog editorial',
    name_ru: 'G_CAT — Каталог editorial',
    description_ru: 'Полноценный пасс-2 для каталога: радиальный градиент фона, объёмный свет, журнальный grade.',
    stage: 'pass2',
    template: `Apply premium editorial color grading and dimensional lighting enhancement to this photograph. Treat input as locked composition.

[BACKGROUND TREATMENT]
Replace background with radial gradient: bright spot directly behind model's head/torso at {{gradient_center}}, fading smoothly outward to {{gradient_corners}} at all four corners. Center-to-corner contrast clearly visible. Gradient is radial, not linear. Floor seamlessly continues gradient.

[DIMENSIONAL LIGHTING]
Clear directional light from {{light_side}} at 45 degrees. Lit side of model noticeably brighter and warmer. Shadow side falls into soft shadow, ~{{shadow_density}}% darker than lit side. Add thin rim light along hair and shoulder edge on shadow side, approximately {{rim_brightness}}% brighter than skin midtones at that edge.

[COLOR GRADE]
Blacks: deepen by {{blacks_deepen}} points. Midtone contrast: increase by {{midtone_contrast}}%. Highlights: protect, do not blow out. Garment saturation: increase by {{garment_saturation}}% (only on garment, not skin). Skin tones: keep neutral-warm. {{splittone_clause}}.

[GENRE ANCHOR]
{{genre_anchor}}.

[NEGATIVE]
No recomposition. No new accessories. No fabric alteration. No face retouching beyond color grade. No artistic filters. No film grain. No bloom. No HDR look.`,
    slots: [
      {
        id: 'gradient_center',
        type: 'color_picker',
        label: 'Gradient center',
        label_ru: 'Центр градиента',
        default: '#B0B0B0',
        range_constraint: { min_lightness: 0.5, max_lightness: 0.85, saturation_max: 0.05 },
        help: 'Brighter center = stronger spotlight on model.',
        help_ru: 'Светлее центр — сильнее эффект «прожектора» на модели.',
      },
      {
        id: 'gradient_corners',
        type: 'color_picker',
        label: 'Gradient corners',
        label_ru: 'Углы градиента',
        default: '#5A5A5A',
        range_constraint: { min_lightness: 0.2, max_lightness: 0.55, saturation_max: 0.05 },
        help: 'Darker corners = stronger spot effect.',
        help_ru: 'Темнее углы — выразительнее «спот».',
      },
      {
        id: 'light_side',
        type: 'enum',
        label: 'Light direction',
        label_ru: 'Направление света',
        options: [
          { value: 'front-left', label: 'Front-left (default)', label_ru: 'Спереди-слева (по умолчанию)' },
          { value: 'front-right', label: 'Front-right', label_ru: 'Спереди-справа' },
          { value: 'side-left', label: 'Side-left (dramatic)', label_ru: 'Сбоку-слева (драматично)' },
        ],
        default: 'front-left',
      },
      {
        id: 'shadow_density',
        type: 'number_slider',
        label: 'Shadow side darkness',
        label_ru: 'Затемнение теневой стороны',
        default: 25,
        min: 15,
        max: 40,
        step: 5,
        unit: '%',
        help: '15% = soft volume. 40% = chiaroscuro.',
        help_ru: '15% — мягкий объём. 40% — кьяроскуро (сильный контраст).',
      },
      {
        id: 'rim_brightness',
        type: 'number_slider',
        label: 'Rim light brightness',
        label_ru: 'Яркость контрового света',
        default: 20,
        min: 0,
        max: 35,
        step: 5,
        unit: '%',
        help_ru: '0 — нет, 20 — лёгкое отделение от фона, 35 — драматично.',
      },
      { id: 'blacks_deepen', type: 'number_slider', label: 'Blacks depth', label_ru: 'Глубина чёрного', default: 12, min: 6, max: 18, step: 1, unit: 'pts' },
      { id: 'midtone_contrast', type: 'number_slider', label: 'Midtone contrast', label_ru: 'Контраст полутонов', default: 15, min: 8, max: 22, step: 1, unit: '%' },
      { id: 'garment_saturation', type: 'number_slider', label: 'Garment saturation', label_ru: 'Насыщенность одежды', default: 12, min: 5, max: 18, step: 1, unit: '%' },
      {
        id: 'splittone_enabled',
        type: 'toggle',
        label: 'Split-tone (warm/cool)',
        label_ru: 'Сплит-тон (тёплое/холодное)',
        default: true,
        computed_field: 'splittone_clause',
        computed_map: {
          'true': 'Subtle warmth in highlights, subtle coolness in shadows (split-tone, very mild — editorial print magazine style)',
          'false': 'Skip split-tone, keep colors true to scene',
        },
        help_ru: 'Лёгкое тепло в светах и холод в тенях — журнальный почерк.',
      },
      {
        id: 'genre_anchor',
        type: 'enum',
        label: 'Genre anchor',
        label_ru: 'Эталон стиля',
        help_ru: 'Под какой бренд/площадку «подгонять» финальный вид.',
        options: [
          { value: 'Final look: high-end e-commerce editorial, premium fashion catalog, Net-a-Porter / Mytheresa quality', label: 'Net-a-Porter (default)', label_ru: 'Net-a-Porter / Mytheresa (по умолчанию)' },
          { value: 'Final look: Vogue editorial magazine quality', label: 'Vogue editorial', label_ru: 'Vogue editorial' },
          { value: 'Final look: Zara / Mango catalog quality', label: 'Zara / Mango', label_ru: 'Zara / Mango (массмаркет)' },
          { value: 'Final look: ASOS product photography quality', label: 'ASOS', label_ru: 'ASOS (UK e-commerce)' },
          { value: 'Final look: Farfetch luxury catalog quality', label: 'Farfetch luxury', label_ru: 'Farfetch (люкс)' },
        ],
        default:
          'Final look: high-end e-commerce editorial, premium fashion catalog, Net-a-Porter / Mytheresa quality',
      },
    ],
    tags: { compatible_with: ['catalog_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_A',
    name: 'G_LIF_A — Warm Golden',
    name_ru: 'G_LIF_A — Тёплый золотистый',
    description_ru: 'Тёплый «золотой» grade под закаты, рестораны и тёплые сцены.',
    stage: 'pass2',
    template:
      'Warm golden grade. Highlights pulled warm (+{{warmth}} temperature), shadows neutral with hint of warm orange in deepest areas, skin glowing slightly amber-warm, saturation +{{sat_overall}}% overall and +{{sat_warm}}% on warm tones. Suits: golden hour, sunset, restaurant, outdoor warm scenes.',
    slots: [
      { id: 'warmth', type: 'number_slider', label: 'Warmth', label_ru: 'Теплота', default: 5, min: 2, max: 10, step: 1, unit: 'pts' },
      { id: 'sat_overall', type: 'number_slider', label: 'Sat overall', label_ru: 'Насыщенность общая', default: 6, min: 0, max: 12, step: 1, unit: '%' },
      { id: 'sat_warm', type: 'number_slider', label: 'Sat warm tones', label_ru: 'Насыщ. тёплых тонов', default: 10, min: 0, max: 15, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_B',
    name: 'G_LIF_B — Editorial Neutral',
    name_ru: 'G_LIF_B — Editorial нейтральный',
    description_ru: 'Сбалансированный journal-style grade: чистая кожа, лёгкий orange/teal сплит, премиум e-commerce.',
    stage: 'pass2',
    template:
      'Clean balanced editorial grade. Subtle orange/teal split (very mild, print-magazine style), skin tones true-to-life neither warm nor cool, blacks deepened by {{blacks}} points, saturation +{{sat}}% overall. Suits: office, urban, daytime, premium e-commerce mood.',
    slots: [
      { id: 'blacks', type: 'number_slider', label: 'Blacks', label_ru: 'Глубина чёрного', default: 8, min: 4, max: 14, step: 1, unit: 'pts' },
      { id: 'sat', type: 'number_slider', label: 'Saturation', label_ru: 'Насыщенность', default: 4, min: 0, max: 10, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_C',
    name: 'G_LIF_C — Soft Pastel',
    name_ru: 'G_LIF_C — Мягкий пастельный',
    description_ru: 'Мягкий пастельный grade под лето, пляж, виноградники — лайтовый «выцветший» film-look.',
    stage: 'pass2',
    template:
      'Soft pastel grade. Highlights lifted (+{{highlights}} brightness, hint of soft cream warmth), shadows lifted slightly (faded film look, NOT crushed blacks), saturation -{{sat_minus}}% overall and +{{sat_garment}}% on garment only, skin glowing softly diffused. Suits: summer, beach, vineyard, light airy locations.',
    slots: [
      { id: 'highlights', type: 'number_slider', label: 'Highlights lift', label_ru: 'Поднятие светов', default: 8, min: 4, max: 14, step: 1, unit: 'pts' },
      { id: 'sat_minus', type: 'number_slider', label: 'Sat overall (-)', label_ru: 'Насыщ. общая (-)', default: 5, min: 0, max: 12, step: 1, unit: '%' },
      { id: 'sat_garment', type: 'number_slider', label: 'Sat garment (+)', label_ru: 'Насыщ. одежды (+)', default: 8, min: 0, max: 14, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_D',
    name: 'G_LIF_D — Moody Cinematic',
    name_ru: 'G_LIF_D — Кинематографичный moody',
    description_ru: 'Тёмный кинематографичный grade: глубокие чёрные, тёплые света, холодные тени, сильный orange/teal.',
    stage: 'pass2',
    template:
      'Moody cinematic grade. Blacks deep (+{{blacks}} points), shadows cool, highlights warm but controlled (no blow-out), strong orange/teal split, saturation -{{sat_minus}}% overall and +{{sat_warm}}% on warm tones, skin slightly desaturated for filmic feel. Suits: evening, rooftop bar, hotel lobby, dramatic locations.',
    slots: [
      { id: 'blacks', type: 'number_slider', label: 'Blacks (+)', label_ru: 'Чёрные (+)', default: 15, min: 8, max: 22, step: 1, unit: 'pts' },
      { id: 'sat_minus', type: 'number_slider', label: 'Sat overall (-)', label_ru: 'Насыщ. общая (-)', default: 3, min: 0, max: 10, step: 1, unit: '%' },
      { id: 'sat_warm', type: 'number_slider', label: 'Sat warm (+)', label_ru: 'Насыщ. тёплых (+)', default: 12, min: 0, max: 18, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_UGC_W',
    name: 'G_UGC_W — Phone warm filter',
    name_ru: 'G_UGC_W — Телефонный тёплый фильтр',
    description_ru: 'VSCO-стиль тёплого фильтра: «телефонная» эстетика, без профессионального ретуша.',
    stage: 'pass2',
    template:
      'Subtle VSCO-style warm phone filter. Highlights warm +{{warmth}}, shadows lifted slightly, saturation +{{sat}}%, slight grain in shadows, mild warmth boost on skin. Keep "phone photo" character — do not make it look professional.',
    slots: [
      { id: 'warmth', type: 'number_slider', label: 'Warmth', label_ru: 'Теплота', default: 6, min: 2, max: 10, step: 1, unit: 'pts' },
      { id: 'sat', type: 'number_slider', label: 'Saturation', label_ru: 'Насыщенность', default: 4, min: 0, max: 10, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['ugc_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_UGC_M',
    name: 'G_UGC_M — Phone minimal filter',
    name_ru: 'G_UGC_M — Телефонный минималистичный',
    description_ru: 'Сдержанный «приглушённый» phone-фильтр — холоднее, минималистичнее.',
    stage: 'pass2',
    template:
      'Subtle muted phone filter. Saturation -{{sat_minus}}%, slight cool shift in shadows, highlights slightly desaturated, contrast +{{contrast}}%, clean minimal feel. Keep "phone photo" character.',
    slots: [
      { id: 'sat_minus', type: 'number_slider', label: 'Saturation (-)', label_ru: 'Насыщенность (-)', default: 8, min: 4, max: 14, step: 1, unit: '%' },
      { id: 'contrast', type: 'number_slider', label: 'Contrast (+)', label_ru: 'Контраст (+)', default: 5, min: 0, max: 10, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['ugc_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_UGC_P',
    name: 'G_UGC_P — Phone punchy filter',
    name_ru: 'G_UGC_P — Телефонный сочный',
    description_ru: 'Усиленный «iPhone vibrance» — насыщенные цвета, контраст, типичный phone-HDR.',
    stage: 'pass2',
    template:
      'Default iPhone-vibrance enhanced filter. Saturation +{{sat}}%, contrast +{{contrast}}%, blacks slightly deeper, highlights slightly warm, default phone HDR look enhanced. Keep "phone photo" character.',
    slots: [
      { id: 'sat', type: 'number_slider', label: 'Saturation (+)', label_ru: 'Насыщенность (+)', default: 10, min: 4, max: 16, step: 1, unit: '%' },
      { id: 'contrast', type: 'number_slider', label: 'Contrast (+)', label_ru: 'Контраст (+)', default: 8, min: 4, max: 14, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['ugc_base'], stage: 'pass2' },
  },
]
