import type { VideoBaseBlock } from '../../lib/types'

export const VIDEO_BASE_BLOCKS: VideoBaseBlock[] = [
  {
    kind: 'VIDEO_BASE',
    id: 'VB_CATALOG',
    name: 'Catalog product video (loopable)',
    name_ru: 'Видео для каталога (зацикленное)',
    description: 'Short loopable clip for product detail pages — subtle motion, garment-focused, silent or ambient-only.',
    description_ru: 'Короткий зацикленный клип для карточки товара — лёгкая динамика, фокус на одежде, тишина или эмбиент.',
    variant: 'catalog',
    defaultDuration: 6,
    defaultAspectRatio: '9:16',
    defaultResolution: '1080p',
    defaultTier: 'fast',
    slots: [],
    prose_template: undefined,
    prose_subject_intro: 'A model wearing the garment from the reference image.',
    prose_context: 'Neutral seamless studio backdrop, even soft lighting.',
  },
]
