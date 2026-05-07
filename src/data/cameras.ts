import type { Block } from '../lib/types'

const APERTURE_MAP_FULL: Record<string, string> = {
  '1.4': 'background heavily blurred (hero portrait)',
  '2': 'shallow background blur',
  '2.8': 'background heavily blurred',
  '4': 'shallow background blur',
  '5.6': 'model fully sharp, background slightly soft',
  '8': 'everything sharp for product accuracy',
  '11': 'deep depth of field',
  '16': 'maximum depth of field',
}

const FOCAL_OPTIONS_PORTRAIT = [70, 85, 100, 105, 135]
const FOCAL_OPTIONS_LIFESTYLE = [24, 35, 50, 85]
const APERTURE_OPTIONS_NARROW = [2.8, 4, 5.6, 8, 11]
const APERTURE_OPTIONS_OPEN = [1.4, 2, 2.8, 4, 5.6]

export const CAMERA_BLOCKS: Block[] = [
  {
    type: 'CAMERA',
    id: 'C1',
    name: 'C1 — Catalog full body',
    template:
      '{{focal_length}}mm lens equivalent, {{angle}} perspective, shot from {{height}} height, standard portrait compression, full body in frame {{frame_fill_text}}, equal margin top and bottom, model occupies ~{{frame_fill_pct}}% frame height, aperture f/{{aperture}} ({{aperture_effect}}), vertical 3:4 framing.',
    slots: [
      {
        id: 'focal_length',
        type: 'focal_length',
        label: 'Focal length',
        options: FOCAL_OPTIONS_PORTRAIT,
        default: 85,
        unit: 'mm',
      },
      {
        id: 'aperture',
        type: 'aperture',
        label: 'Aperture',
        options: APERTURE_OPTIONS_NARROW,
        default: 5.6,
        computed_field: 'aperture_effect',
        computed_map: APERTURE_MAP_FULL,
      },
      {
        id: 'angle',
        type: 'enum',
        label: 'Camera angle',
        options: [
          { value: 'eye-level', label: 'Eye-level (default)' },
          { value: 'slight low angle', label: 'Slight low' },
          { value: 'slight high angle', label: 'Slight high' },
        ],
        default: 'eye-level',
      },
      {
        id: 'height',
        type: 'enum',
        label: 'Camera height',
        options: [
          { value: 'waist', label: 'Waist' },
          { value: 'chest', label: 'Chest (default)' },
          { value: 'eye', label: 'Eye' },
        ],
        default: 'chest',
      },
      {
        id: 'frame_fill_pct',
        type: 'number_slider',
        label: 'Model fills frame',
        default: 70,
        min: 60,
        max: 85,
        step: 5,
        unit: '%',
        computed_field: 'frame_fill_text',
        computed_map: {
          '60': 'with significant breathing room',
          '65': 'with significant breathing room',
          '70': 'from above-head to below-feet',
          '75': 'from above-head to below-feet',
          '80': 'tightly framed',
          '85': 'tightly framed',
        },
      },
    ],
    tags: { compatible_with: ['catalog_base', 'lifestyle_base'] },
  },
  {
    type: 'CAMERA',
    id: 'C2',
    name: 'C2 — Catalog detail medium',
    template:
      '{{focal_length}}mm lens equivalent (slight compression for product detail), {{angle}}, shot from {{height}} height, framed from {{frame_top}} to {{frame_bottom}} — tighter than full body, fabric texture clearly readable. Aperture f/{{aperture}} ({{aperture_effect}}). Vertical 3:4 framing.',
    slots: [
      {
        id: 'focal_length',
        type: 'focal_length',
        label: 'Focal length',
        options: [85, 100, 105, 135],
        default: 100,
        unit: 'mm',
      },
      {
        id: 'aperture',
        type: 'aperture',
        label: 'Aperture',
        options: APERTURE_OPTIONS_NARROW,
        default: 8,
        computed_field: 'aperture_effect',
        computed_map: APERTURE_MAP_FULL,
      },
      {
        id: 'angle',
        type: 'enum',
        label: 'Camera angle',
        options: [
          { value: 'eye-level', label: 'Eye-level (default)' },
          { value: 'slight high angle', label: 'Slight high' },
        ],
        default: 'eye-level',
      },
      {
        id: 'height',
        type: 'enum',
        label: 'Camera height',
        options: [
          { value: 'chest', label: 'Chest (default)' },
          { value: 'waist', label: 'Waist' },
        ],
        default: 'chest',
      },
      {
        id: 'frame_top',
        type: 'enum',
        label: 'Frame top',
        options: [
          { value: 'chest', label: 'Chest' },
          { value: 'waist', label: 'Waist' },
        ],
        default: 'chest',
      },
      {
        id: 'frame_bottom',
        type: 'enum',
        label: 'Frame bottom',
        options: [
          { value: 'mid-thigh', label: 'Mid-thigh (default)' },
          { value: 'thigh', label: 'Thigh' },
          { value: 'knee', label: 'Knee' },
        ],
        default: 'mid-thigh',
      },
    ],
    tags: { compatible_with: ['catalog_base', 'lifestyle_base'] },
  },
  {
    type: 'CAMERA',
    id: 'C3',
    name: 'C3 — Catalog detail lower',
    template:
      '{{focal_length}}mm lens equivalent, slight high angle (camera at waist height, pointed slightly downward) to show skirt drape and floor, framed from {{frame_top}} to floor, lower body and garment hem in focus. Aperture f/{{aperture}} (full depth of field). Vertical 3:4 framing.',
    slots: [
      {
        id: 'focal_length',
        type: 'focal_length',
        label: 'Focal length',
        options: [70, 85, 100],
        default: 85,
        unit: 'mm',
      },
      {
        id: 'aperture',
        type: 'aperture',
        label: 'Aperture',
        options: [5.6, 8, 11],
        default: 8,
      },
      {
        id: 'frame_top',
        type: 'enum',
        label: 'Frame top',
        options: [
          { value: 'waist', label: 'Waist (default)' },
          { value: 'hip', label: 'Hip' },
        ],
        default: 'waist',
      },
    ],
    tags: { compatible_with: ['catalog_base', 'lifestyle_base'] },
  },
  {
    type: 'CAMERA',
    id: 'C4',
    name: 'C4 — Lifestyle environmental wide',
    template:
      '{{focal_length}}mm lens equivalent (captures environment context), aperture f/{{aperture}} ({{aperture_effect}}), {{angle}}. Full body in frame. Composition: model takes {{composition}}, environment fills remainder. {{aspect}}.',
    slots: [
      {
        id: 'focal_length',
        type: 'focal_length',
        label: 'Focal length',
        options: [24, 28, 35],
        default: 35,
        unit: 'mm',
      },
      {
        id: 'aperture',
        type: 'aperture',
        label: 'Aperture',
        options: [2.8, 4, 5.6],
        default: 4,
        computed_field: 'aperture_effect',
        computed_map: APERTURE_MAP_FULL,
      },
      {
        id: 'angle',
        type: 'enum',
        label: 'Camera angle',
        options: [
          { value: 'eye-level', label: 'Eye-level (default)' },
          { value: 'slight low angle', label: 'Slight low' },
        ],
        default: 'eye-level',
      },
      {
        id: 'composition',
        type: 'enum',
        label: 'Composition',
        options: [
          { value: 'center', label: 'Center' },
          { value: 'off-center third', label: 'Rule of thirds (default)' },
        ],
        default: 'off-center third',
      },
      {
        id: 'aspect',
        type: 'enum',
        label: 'Aspect',
        options: [
          { value: 'Vertical 3:4', label: 'Vertical 3:4 (default)' },
          { value: 'Horizontal 4:3', label: 'Horizontal 4:3' },
        ],
        default: 'Vertical 3:4',
      },
    ],
    tags: { compatible_with: ['lifestyle_base'] },
  },
  {
    type: 'CAMERA',
    id: 'C5',
    name: 'C5 — Lifestyle portrait in scene',
    template:
      '{{focal_length}}mm lens equivalent (natural perspective), aperture f/{{aperture}} ({{aperture_effect}}), {{angle}}, framed from {{frame_top}} up — environmental portrait. Vertical 3:4.',
    slots: [
      {
        id: 'focal_length',
        type: 'focal_length',
        label: 'Focal length',
        options: FOCAL_OPTIONS_LIFESTYLE,
        default: 50,
        unit: 'mm',
      },
      {
        id: 'aperture',
        type: 'aperture',
        label: 'Aperture',
        options: APERTURE_OPTIONS_OPEN,
        default: 2,
        computed_field: 'aperture_effect',
        computed_map: APERTURE_MAP_FULL,
      },
      {
        id: 'angle',
        type: 'enum',
        label: 'Camera angle',
        options: [
          { value: 'eye-level', label: 'Eye-level (default)' },
          { value: 'slight low angle', label: 'Slight low' },
        ],
        default: 'eye-level',
      },
      {
        id: 'frame_top',
        type: 'enum',
        label: 'Frame top',
        options: [
          { value: 'chest', label: 'Chest (default)' },
          { value: 'waist', label: 'Waist' },
        ],
        default: 'chest',
      },
    ],
    tags: { compatible_with: ['lifestyle_base'] },
  },
  {
    type: 'CAMERA',
    id: 'C6',
    name: 'C6 — Lifestyle hero',
    template:
      '{{focal_length}}mm lens equivalent (compresses background for hero portrait energy), aperture f/{{aperture}} ({{aperture_effect}}), {{angle}} (camera at chest level pointed slightly upward) for elongated silhouette. Framed {{framing}}. Vertical 3:4.',
    slots: [
      {
        id: 'focal_length',
        type: 'focal_length',
        label: 'Focal length',
        options: [85, 100, 135],
        default: 85,
        unit: 'mm',
      },
      {
        id: 'aperture',
        type: 'aperture',
        label: 'Aperture',
        options: APERTURE_OPTIONS_OPEN,
        default: 2,
        computed_field: 'aperture_effect',
        computed_map: APERTURE_MAP_FULL,
      },
      {
        id: 'angle',
        type: 'enum',
        label: 'Camera angle',
        options: [
          { value: 'eye-level', label: 'Eye-level' },
          { value: 'slight low angle', label: 'Slight low (default)' },
        ],
        default: 'slight low angle',
      },
      {
        id: 'framing',
        type: 'enum',
        label: 'Framing',
        options: [
          { value: 'full body', label: 'Full body' },
          { value: 'three-quarter from waist up', label: 'Three-quarter (default)' },
        ],
        default: 'three-quarter from waist up',
      },
    ],
    tags: { compatible_with: ['lifestyle_base'] },
  },
  {
    type: 'CAMERA',
    id: 'C7',
    name: 'C7 — UGC phone (implicit)',
    description: 'Reference only — UGC scenarios bundle camera in the SCENARIO block.',
    template:
      'NOTE: UGC scenarios bundle camera-character into the SCENARIO block. Phone main wide ~26mm or selfie camera, aperture f/1.8 phone-style, phone HDR rendering. Vertical 3:4 or 9:16 portrait.',
    slots: [],
    tags: { compatible_with: ['ugc_base'] },
  },
]
