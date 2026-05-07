import type { Block } from '../lib/types'

const COMPATIBLE_NORMAL = ['catalog_base', 'lifestyle_base']
const COMPATIBLE_LIFESTYLE = ['lifestyle_base']

export const POSE_BLOCKS: Block[] = [
  {
    type: 'POSE',
    id: 'P1',
    name: 'P1 — Front straight contrapposto',
    template:
      "Model standing facing camera, weight slightly on one leg in natural contrapposto, arms relaxed at sides, shoulders open, soft confident expression, {{gaze}}, {{expression}}.",
    slots: [
      {
        id: 'gaze',
        type: 'enum',
        label: 'Gaze',
        options: [
          { value: 'direct gaze into camera', label: 'Direct (default)' },
          { value: 'soft gaze into camera', label: 'Soft direct' },
          { value: 'looking slightly off-camera', label: 'Off-camera' },
        ],
        default: 'direct gaze into camera',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'neutral closed-mouth', label: 'Neutral' },
          { value: 'subtle closed-mouth smile', label: 'Subtle smile (default)' },
          { value: 'soft genuine smile', label: 'Genuine smile' },
        ],
        default: 'subtle closed-mouth smile',
      },
    ],
    tags: { compatible_with: COMPATIBLE_NORMAL, recommends_camera: ['C1', 'C2'] },
  },
  {
    type: 'POSE',
    id: 'P2',
    name: 'P2 — Editorial three-quarter',
    template:
      "Model's torso rotated {{rotation_deg}} degrees to camera-{{rotation_side}}, weight shifted to back leg in {{stance_intensity}} contrapposto, one hand resting naturally on hip with elbow out (creates triangle of negative space at waist), other arm relaxed at side, shoulders open and relaxed, chin {{chin_position}}, {{gaze_description}}, {{expression}} — magazine editorial energy.",
    slots: [
      {
        id: 'rotation_deg',
        type: 'number_slider',
        label: 'Body rotation',
        default: 25,
        min: 15,
        max: 35,
        step: 5,
        unit: '°',
      },
      {
        id: 'rotation_side',
        type: 'enum',
        label: 'Rotation side',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
        default: 'left',
      },
      {
        id: 'stance_intensity',
        type: 'enum',
        label: 'Contrapposto',
        options: [
          { value: 'subtle', label: 'Subtle' },
          { value: 'confident', label: 'Confident (default)' },
          { value: 'strong', label: 'Strong' },
        ],
        default: 'confident',
      },
      {
        id: 'chin_position',
        type: 'enum',
        label: 'Chin',
        options: [
          { value: 'level', label: 'Level' },
          { value: 'slightly forward and down', label: 'Slightly forward (default)' },
          { value: 'slightly up', label: 'Slightly up' },
        ],
        default: 'slightly forward and down',
      },
      {
        id: 'gaze_description',
        type: 'enum',
        label: 'Gaze',
        options: [
          { value: 'direct confident gaze into camera', label: 'Direct confident' },
          { value: 'soft gaze into camera', label: 'Soft direct' },
          { value: 'looking off-camera to the side', label: 'Off-camera' },
          { value: 'looking down past camera', label: 'Down past camera' },
        ],
        default: 'direct confident gaze into camera',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'neutral closed-mouth', label: 'Neutral' },
          { value: 'subtle closed-mouth smile', label: 'Subtle smile (default)' },
          { value: 'soft genuine smile', label: 'Genuine smile' },
          { value: 'slight knowing smile', label: 'Knowing smile' },
        ],
        default: 'subtle closed-mouth smile',
      },
    ],
    tags: { compatible_with: COMPATIBLE_NORMAL, recommends_camera: ['C1', 'C5', 'C6'] },
  },
  {
    type: 'POSE',
    id: 'P3',
    name: 'P3 — Side profile',
    template:
      'Model standing in profile facing {{profile_side}} of frame, arms naturally at sides, weight evenly distributed, eyes looking forward (in direction of profile), {{expression}}. Body silhouette is the focus — straight posture, no twist.',
    slots: [
      {
        id: 'profile_side',
        type: 'enum',
        label: 'Profile facing',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
        default: 'left',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'neutral expression', label: 'Neutral (default)' },
          { value: 'soft contemplative expression', label: 'Contemplative' },
          { value: 'subtle smile', label: 'Subtle smile' },
        ],
        default: 'neutral expression',
      },
    ],
    tags: { compatible_with: COMPATIBLE_NORMAL, recommends_camera: ['C1'] },
  },
  {
    type: 'POSE',
    id: 'P4',
    name: 'P4 — Back over shoulder',
    template:
      'Model with back to camera, head turned to look {{look_intensity}} over {{shoulder_side}} shoulder toward camera, arms relaxed at sides, weight slightly on one leg, {{expression}}, hair naturally falling. Shows back of garment.',
    slots: [
      {
        id: 'look_intensity',
        type: 'enum',
        label: 'Look intensity',
        options: [
          { value: 'softly', label: 'Soft (default)' },
          { value: 'directly', label: 'Direct' },
        ],
        default: 'softly',
      },
      {
        id: 'shoulder_side',
        type: 'enum',
        label: 'Shoulder',
        options: [
          { value: 'right', label: 'Right' },
          { value: 'left', label: 'Left' },
        ],
        default: 'right',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'calm expression', label: 'Calm (default)' },
          { value: 'subtle smile', label: 'Subtle smile' },
          { value: 'pensive expression', label: 'Pensive' },
        ],
        default: 'calm expression',
      },
    ],
    tags: { compatible_with: COMPATIBLE_NORMAL, recommends_camera: ['C1', 'C2'] },
  },
  {
    type: 'POSE',
    id: 'P5',
    name: 'P5 — Walking mid-stride',
    template:
      'Model walking, captured mid-step with one foot forward and one back, slight movement in dress hem and hair, one hand {{hand_action}}, other arm relaxed, looking {{gaze_direction}} with relaxed natural expression. Captured candidly — not posed, caught in motion.',
    slots: [
      {
        id: 'hand_action',
        type: 'enum',
        label: 'Hand',
        options: [
          { value: 'brushing hair behind ear', label: 'Hair behind ear (default)' },
          { value: 'holding a small bag', label: 'Holding bag' },
          { value: 'holding a coffee cup', label: 'Holding coffee' },
          { value: 'in pocket', label: 'In pocket' },
        ],
        default: 'brushing hair behind ear',
      },
      {
        id: 'gaze_direction',
        type: 'enum',
        label: 'Gaze',
        options: [
          { value: 'slightly off-camera', label: 'Off-camera (default)' },
          { value: 'into camera', label: 'Into camera' },
          { value: 'down past camera', label: 'Down past camera' },
        ],
        default: 'slightly off-camera',
      },
    ],
    tags: { compatible_with: COMPATIBLE_LIFESTYLE, recommends_camera: ['C4', 'C5'] },
  },
  {
    type: 'POSE',
    id: 'P6',
    name: 'P6 — Seated relaxed at table',
    template:
      'Model seated at a table, leaning {{lean_direction}}, one hand resting near a {{table_object}} on the table, other in lap or gesturing, body turned three-quarter to camera, looking softly toward camera with {{expression}}. Natural conversation energy.',
    slots: [
      {
        id: 'lean_direction',
        type: 'enum',
        label: 'Lean',
        options: [
          { value: 'slightly forward', label: 'Forward (engaged)' },
          { value: 'slightly back relaxed', label: 'Back relaxed (default)' },
        ],
        default: 'slightly back relaxed',
      },
      {
        id: 'table_object',
        type: 'enum',
        label: 'On table',
        options: [
          { value: 'cup', label: 'Cup (default)' },
          { value: 'wine glass', label: 'Wine glass' },
          { value: 'open notebook', label: 'Notebook' },
        ],
        default: 'cup',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'relaxed engaged expression', label: 'Engaged (default)' },
          { value: 'soft genuine smile', label: 'Soft smile' },
          { value: 'thoughtful expression', label: 'Thoughtful' },
        ],
        default: 'relaxed engaged expression',
      },
    ],
    tags: { compatible_with: COMPATIBLE_LIFESTYLE, recommends_camera: ['C5', 'C6'] },
  },
  {
    type: 'POSE',
    id: 'P7',
    name: 'P7 — Looking off (vista pose)',
    template:
      'Model standing turned three-quarter away from camera, looking off into the distance (away from camera), hand resting lightly on a {{rest_object}}, weight on back leg, hair moving slightly in breeze, {{expression}} expression — NOT looking at camera. Environmental "moment" energy.',
    slots: [
      {
        id: 'rest_object',
        type: 'enum',
        label: 'Hand rests on',
        options: [
          { value: 'railing', label: 'Railing (default)' },
          { value: 'hip', label: 'Hip' },
          { value: 'window frame', label: 'Window frame' },
        ],
        default: 'railing',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'soft contemplative', label: 'Contemplative (default)' },
          { value: 'confident', label: 'Confident' },
          { value: 'wistful', label: 'Wistful' },
        ],
        default: 'soft contemplative',
      },
    ],
    tags: { compatible_with: COMPATIBLE_LIFESTYLE, recommends_camera: ['C4', 'C5', 'C6'] },
  },
  {
    type: 'POSE',
    id: 'P8',
    name: 'P8 — Twirl / movement',
    template:
      'Model captured mid-twirl: body rotating, dress hem flying outward in circular arc, hair lifted following rotation, arms either extended for balance or relaxed swinging. Face in {{face_orientation}} to camera, {{expression}}, eyes might be closed or looking down at the dress. NOT a static held pose — captured in real movement.',
    slots: [
      {
        id: 'face_orientation',
        type: 'enum',
        label: 'Face orientation',
        options: [
          { value: 'profile', label: 'Profile' },
          { value: 'three-quarter', label: 'Three-quarter (default)' },
        ],
        default: 'three-quarter',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'genuine joyful expression possibly mid-laugh', label: 'Joyful laugh (default)' },
          { value: 'soft smile, eyes closed', label: 'Soft smile' },
          { value: 'serene expression', label: 'Serene' },
        ],
        default: 'genuine joyful expression possibly mid-laugh',
      },
    ],
    tags: { compatible_with: COMPATIBLE_LIFESTYLE, recommends_camera: ['C4', 'C5'] },
  },
  {
    type: 'POSE',
    id: 'P9',
    name: 'P9 — Leaning at railing/wall',
    template:
      'Model leaning casually with {{contact_part}} against a {{lean_object}}, weight shifted, one leg slightly crossed in front, hands {{hands_position}}, body turned three-quarter to camera, looking at camera with {{expression}}. Effortless lean energy.',
    slots: [
      {
        id: 'contact_part',
        type: 'enum',
        label: 'Contact part',
        options: [
          { value: 'back', label: 'Back' },
          { value: 'shoulder', label: 'Shoulder (default)' },
        ],
        default: 'shoulder',
      },
      {
        id: 'lean_object',
        type: 'enum',
        label: 'Object',
        options: [
          { value: 'wall', label: 'Wall (default)' },
          { value: 'railing', label: 'Railing' },
          { value: 'column', label: 'Column' },
        ],
        default: 'wall',
      },
      {
        id: 'hands_position',
        type: 'enum',
        label: 'Hands',
        options: [
          { value: 'in pockets', label: 'In pockets' },
          { value: 'one on hip', label: 'One on hip (default)' },
          { value: 'holding a small object', label: 'Holding object' },
        ],
        default: 'one on hip',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'calm composed expression', label: 'Composed (default)' },
          { value: 'slight smile', label: 'Slight smile' },
        ],
        default: 'calm composed expression',
      },
    ],
    tags: { compatible_with: COMPATIBLE_LIFESTYLE, recommends_camera: ['C5', 'C6'] },
  },
  {
    type: 'POSE',
    id: 'P10',
    name: 'P10 — Mirror selfie holding phone',
    template:
      'Model standing facing a mirror, holding a smartphone with {{hand_count}} at chest or face level — phone clearly visible in reflection (partial face occlusion is OK — realistic). Slight hip pop, weight on one leg, casual outfit-check energy. Soft natural expression, not modeling — just checking the look. Other hand may lightly touch the dress or relax at side.',
    slots: [
      {
        id: 'hand_count',
        type: 'enum',
        label: 'Phone held with',
        options: [
          { value: 'both hands', label: 'Both hands' },
          { value: 'one hand', label: 'One hand (default)' },
        ],
        default: 'one hand',
      },
    ],
    tags: { compatible_with: ['ugc_base'], incompatible_with: ['catalog_base', 'lifestyle_base'] },
  },
  {
    type: 'POSE',
    id: 'P11',
    name: 'P11 — OOTD straight-on',
    template:
      'Model standing facing camera, full body in frame, weight on one leg, hands {{hand_position}}. Casual aware-of-camera expression — {{expression}}. NOT modeling, but deliberately presenting the outfit (this is a chosen "outfit of the day" pose, slightly self-conscious in a charming way).',
    slots: [
      {
        id: 'hand_position',
        type: 'enum',
        label: 'Hands',
        options: [
          { value: 'loose at sides', label: 'Loose at sides' },
          { value: 'one hand lightly on hip', label: 'One on hip (default)' },
        ],
        default: 'one hand lightly on hip',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'soft smile', label: 'Soft smile (default)' },
          { value: 'neutral relaxed face', label: 'Neutral' },
        ],
        default: 'soft smile',
      },
    ],
    tags: { compatible_with: COMPATIBLE_LIFESTYLE, recommends_camera: ['C4', 'C5'] },
  },
  {
    type: 'POSE',
    id: 'P12',
    name: 'P12 — Detail close-up',
    template:
      "Hand visible in frame holding up a portion of the garment — {{detail_focus}} — toward camera. The fabric/detail IS the subject. Model's face NOT in frame or only partially at edge.",
    slots: [
      {
        id: 'detail_focus',
        type: 'enum',
        label: 'Detail focus',
        options: [
          { value: 'pinching fabric to show drape', label: 'Drape pinch (default)' },
          { value: 'sleeve held at arm length', label: 'Sleeve' },
          { value: 'hem lifted slightly', label: 'Hem' },
          { value: 'close-up of embroidery or trim', label: 'Embroidery/trim' },
        ],
        default: 'pinching fabric to show drape',
      },
    ],
    tags: { compatible_with: COMPATIBLE_NORMAL, recommends_camera: ['C2', 'C3'] },
  },
]
