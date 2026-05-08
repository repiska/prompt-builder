import type { VideoBaseBlock, MotionBlock, VideoRecipe } from '../../lib/types'

// ── Base ──────────────────────────────────────────────────────────────────────
// A single base for all animate-from-photo recipes.
// Critical: NO prose_template (we want the deterministic 5-section path)
// NO prose_subject_intro (image carries the subject)
// NO prose_context (image carries the scene)
// The composer detects this base by id and emits a stripped 3-section prose.

export const ANIMATE_BASE_BLOCKS: VideoBaseBlock[] = [
  {
    kind: 'VIDEO_BASE',
    id: 'VB_ANIMATE',
    name: 'Animate from photo (universal)',
    name_ru: 'Анимация из фото (универсально)',
    description:
      'Universal motion overlay for an existing product/garment photo. The reference image carries all visual content; the prompt only adds motion, camera behavior, and physics. Works for any SKU without per-item rewrite.',
    description_ru:
      'Универсальная накладка движения на существующее фото товара. Исходник несёт весь визуал; промпт добавляет только движение, поведение камеры и физику. Работает на любом артикуле без переписывания.',
    variant: 'catalog',
    defaultDuration: 4,
    defaultAspectRatio: '9:16',
    defaultResolution: '720p',
    defaultTier: 'fast',
    slots: [],
    prose_realism_suffix:
      'Weighty fabric with realistic physics — natural inertia, visible fabric weave, fabric texture catches light naturally, no plastic sheen, no over-smoothing.',
  },
]

// ── Motion blocks ─────────────────────────────────────────────────────────────
// Generic referents only — no specific garment/model assumptions.

export const ANIMATE_MOTION_BLOCKS: MotionBlock[] = [
  {
    kind: 'MOTION',
    id: 'AM1',
    name: 'Subtle idle (loopable)',
    name_ru: 'Тонкое статичное дыхание (зацикленно)',
    loopable: true,
    prose_template:
      'The subject holds the pose with natural breathing rhythm — fabric drape settles under its own weight, hair shifts a couple of millimeters.',
  },
  {
    kind: 'MOTION',
    id: 'AM2',
    name: 'Slow 360° turn',
    name_ru: 'Медленный поворот на 360°',
    prose_template:
      'The figure performs a 360-degree turn at natural everyday speed, briefly settling at the three-quarter view. Fabric and hair respond to the rotation with weight and inertia, not stylized slow-motion.',
  },
  {
    kind: 'MOTION',
    id: 'AM3',
    name: 'Fabric catches breeze',
    name_ru: 'Ткань на ветру',
    prose_template:
      'The fabric is moved by a steady breeze with realistic weight — folds shift naturally, edges flutter at real-time speed, shadow patterns reform with each movement.',
  },
  {
    kind: 'MOTION',
    id: 'AM4',
    name: 'Slow dolly-in to detail',
    name_ru: 'Медленный наезд на деталь',
    prose_template:
      'Steady dolly-in from medium-wide to a tight close-up at natural pace, shallow depth of field reveals fabric weave and stitching detail. The subject remains still.',
  },
  {
    kind: 'MOTION',
    id: 'AM5',
    name: 'Product orbit (no model)',
    name_ru: 'Орбита продукта (без модели)',
    prose_template:
      'The product rotates 360 degrees on its axis at constant real-time speed — no acceleration, no slow-motion. Lighting is consistent throughout. Each angle reveals a different surface detail.',
  },
  {
    kind: 'MOTION',
    id: 'AM6',
    name: 'Lateral parallax pan',
    name_ru: 'Боковая панорама с параллаксом',
    prose_template:
      'Lateral camera pan from left to right at chest height, real-time pacing, parallax reveals depth and side profile. The subject maintains pose.',
  },
]

// ── Recipes ───────────────────────────────────────────────────────────────────

export const ANIMATE_RECIPES: VideoRecipe[] = [
  {
    id: 'VR_ANIMATE_PDP_TILE',
    name: 'Animate: PDP loopable tile',
    name_ru: 'Анимация: зацикленный PDP-тайл',
    baseId: 'VB_ANIMATE',
    motionId: 'AM1',
    cameraMoveId: 'VCM1',
    audioPresetId: 'VA1',
    duration: 4,
    aspectRatio: '9:16',
    resolution: '720p',
    tier: 'fast',
    motionSpeed: 'natural_real_time',
  },
  {
    id: 'VR_ANIMATE_360_HERO',
    name: 'Animate: 360° hero',
    name_ru: 'Анимация: герой 360°',
    baseId: 'VB_ANIMATE',
    motionId: 'AM2',
    cameraMoveId: 'VCM3',
    audioPresetId: 'VA2',
    duration: 8,
    aspectRatio: '9:16',
    resolution: '1080p',
    tier: 'generate',
    motionSpeed: 'natural_real_time',
  },
  {
    id: 'VR_ANIMATE_FABRIC_DETAIL',
    name: 'Animate: fabric detail',
    name_ru: 'Анимация: деталь ткани',
    baseId: 'VB_ANIMATE',
    motionId: 'AM3',
    cameraMoveId: 'VCM2',
    audioPresetId: 'VA1',
    duration: 8,
    aspectRatio: '16:9',
    resolution: '1080p',
    tier: 'generate',
    motionSpeed: 'natural_real_time',
  },
]
