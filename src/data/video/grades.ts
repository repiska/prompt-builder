import type { GradeVideoBlock } from '../../lib/types'

export const GRADE_VIDEO_BLOCKS: GradeVideoBlock[] = [
  {
    kind: 'GRADE_VIDEO',
    id: 'VG1',
    name: 'Soft daylight',
    name_ru: 'Мягкий дневной свет',
    prose_template:
      'Soft natural daylight, gentle key from a large window, low-contrast filmic grade, true skin tones.',
  },
  {
    kind: 'GRADE_VIDEO',
    id: 'VG2',
    name: 'High-key studio',
    name_ru: 'Хай-кей студийный',
    prose_template:
      'High-key studio lighting, even illumination, white seamless background, clean catalog look.',
  },
  {
    kind: 'GRADE_VIDEO',
    id: 'VG3',
    name: 'Golden hour',
    name_ru: 'Золотой час',
    prose_template:
      "Golden-hour backlight, warm rim light on the subject's edge, gentle lens flare, slow exposure shift.",
  },
]
