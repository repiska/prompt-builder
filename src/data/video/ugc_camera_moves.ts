import type { CameraMoveBlock } from '../../lib/types'

export const UGC_CAMERA_MOVE_BLOCKS: CameraMoveBlock[] = [
  {
    kind: 'CAMERA_MOVE',
    id: 'UCM1',
    name: 'Selfie arm-extended',
    name_ru: 'Селфи на вытянутой руке',
    veo_movement: 'handheld',
    prose_template:
      'Selfie front-camera, arm extended, eye level slightly below subject\'s chin, micro-shake from handheld grip, tight medium close-up.',
  },
  {
    kind: 'CAMERA_MOVE',
    id: 'UCM2',
    name: 'Mirror handheld',
    name_ru: 'Хэндхелд в зеркало',
    veo_movement: 'handheld',
    prose_template:
      'Camera held at chest height pointing at a full-length mirror, slight handheld tilt, the phone visible in the reflection, full-body framing.',
  },
  {
    kind: 'CAMERA_MOVE',
    id: 'UCM3',
    name: 'Propped on desk',
    name_ru: 'Телефон на столе',
    veo_movement: 'static',
    prose_template:
      'Phone propped on a desk or stack of books at slight upward angle, locked-off but with imperfect tilt, medium shot.',
  },
]
