import type { CameraMoveBlock } from '../../lib/types'

export const CAMERA_MOVE_BLOCKS: CameraMoveBlock[] = [
  {
    kind: 'CAMERA_MOVE',
    id: 'VCM1',
    name: 'Locked-off medium',
    name_ru: 'Статичный средний план',
    veo_movement: 'static',
    prose_template: 'Locked-off medium shot, eye level, 50mm equivalent.',
  },
  {
    kind: 'CAMERA_MOVE',
    id: 'VCM2',
    name: 'Slow dolly in',
    name_ru: 'Медленный наезд камеры',
    veo_movement: 'dolly',
    prose_template:
      'Slow cinematic dolly-in from a medium-wide to a medium close-up, shallow depth of field.',
  },
  {
    kind: 'CAMERA_MOVE',
    id: 'VCM3',
    name: 'Lateral pan',
    name_ru: 'Плавная боковая панорама',
    veo_movement: 'pan',
    prose_template:
      "Smooth lateral pan from left to right at chest height, following the subject's silhouette.",
  },
  {
    kind: 'CAMERA_MOVE',
    id: 'VCM4',
    name: 'Slight handheld',
    name_ru: 'Лёгкий хэндхелд',
    veo_movement: 'handheld',
    prose_template:
      'Handheld camera at eye level with subtle natural sway, micro-shake from breathing, 35mm equivalent.',
  },
  {
    kind: 'CAMERA_MOVE',
    id: 'VCM5',
    name: 'Quarter arc',
    name_ru: 'Дуговой облёт',
    veo_movement: 'arc',
    prose_template:
      'Camera arcs a quarter turn around the subject at waist height, parallax reveals depth.',
  },
]
