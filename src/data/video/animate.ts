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
      'The subject stays in pose with subtle breathing motion, fabric drape settles, hair shifts a few millimeters.',
  },
  {
    kind: 'MOTION',
    id: 'AM2',
    name: 'Slow 360° turn',
    name_ru: 'Медленный поворот на 360°',
    prose_template:
      'The figure turns 360 degrees showing the full outfit from every angle. The turn is confident and smooth with a brief pause at the three-quarter view. Hair and fabric respond to the rotation with natural physics.',
  },
  {
    kind: 'MOTION',
    id: 'AM3',
    name: 'Fabric catches breeze',
    name_ru: 'Ткань на ветру',
    prose_template:
      "The fabric catches a gentle breeze and billows softly away from the body. Each fold creates new shadow patterns. The motion is slow and elegant, emphasizing the material's weight and drape.",
  },
  {
    kind: 'MOTION',
    id: 'AM4',
    name: 'Slow dolly-in to detail',
    name_ru: 'Медленный наезд на деталь',
    prose_template:
      'Slow cinematic dolly-in from a medium-wide framing to a tight close-up, shallow depth of field reveals fabric texture and stitching. The subject remains still.',
  },
  {
    kind: 'MOTION',
    id: 'AM5',
    name: 'Product orbit (no model)',
    name_ru: 'Орбита продукта (без модели)',
    prose_template:
      'The product rotates smoothly 360 degrees on its axis. Lighting remains consistent throughout the rotation. Each angle reveals a different surface detail. The rotation is slow and steady with no acceleration or deceleration.',
  },
  {
    kind: 'MOTION',
    id: 'AM6',
    name: 'Lateral parallax pan',
    name_ru: 'Боковая панорама с параллаксом',
    prose_template:
      'Smooth lateral camera pan from left to right at chest height, parallax reveals depth and side profile. The subject maintains pose.',
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
  },
]
