import type { MotionBlock } from '../../lib/types'

export const MOTION_BLOCKS: MotionBlock[] = [
  {
    kind: 'MOTION',
    id: 'VM1',
    name: 'Subtle idle (loopable)',
    name_ru: 'Лёгкое статичное дыхание (зацикленно)',
    loopable: true,
    prose_template:
      'The subject stands still with quiet breathing, hair shifts a few millimeters, fabric drape settles.',
  },
  {
    kind: 'MOTION',
    id: 'VM2',
    name: 'Slow half-turn (loopable)',
    name_ru: 'Медленный полуповорот (зацикленно)',
    loopable: true,
    prose_template:
      'The subject performs a slow half-turn from facing-forward to a three-quarter angle, the garment hem swings gently.',
  },
  {
    kind: 'MOTION',
    id: 'VM3',
    name: 'Walk forward',
    name_ru: 'Шаг навстречу камере',
    prose_template:
      'The subject walks two steps toward the camera with natural weight transfer, fabric ripples with the motion.',
  },
  {
    kind: 'MOTION',
    id: 'VM4',
    name: 'Hand on collar',
    name_ru: 'Рука на воротнике',
    prose_template:
      'The subject brushes a hand along the collar of the garment, head micro-tilts, eyes briefly meet the camera.',
  },
  {
    kind: 'MOTION',
    id: 'VM5',
    name: 'Hair flick',
    name_ru: 'Жест рукой по волосам',
    prose_template:
      'The subject runs a hand through their hair, shoulders relax, a small smile forms.',
  },
]
