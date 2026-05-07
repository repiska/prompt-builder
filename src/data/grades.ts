import type { Block } from '../lib/types'

export const GRADE_BLOCKS: Block[] = [
  {
    type: 'GRADE',
    id: 'G_CAT',
    name: 'G_CAT — Catalog editorial',
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
        default: '#B0B0B0',
        range_constraint: { min_lightness: 0.5, max_lightness: 0.85, saturation_max: 0.05 },
        help: 'Brighter center = stronger spotlight on model.',
      },
      {
        id: 'gradient_corners',
        type: 'color_picker',
        label: 'Gradient corners',
        default: '#5A5A5A',
        range_constraint: { min_lightness: 0.2, max_lightness: 0.55, saturation_max: 0.05 },
        help: 'Darker corners = stronger spot effect.',
      },
      {
        id: 'light_side',
        type: 'enum',
        label: 'Light direction',
        options: [
          { value: 'front-left', label: 'Front-left (default)' },
          { value: 'front-right', label: 'Front-right' },
          { value: 'side-left', label: 'Side-left (dramatic)' },
        ],
        default: 'front-left',
      },
      {
        id: 'shadow_density',
        type: 'number_slider',
        label: 'Shadow side darkness',
        default: 25,
        min: 15,
        max: 40,
        step: 5,
        unit: '%',
        help: '15% = soft volume. 40% = chiaroscuro.',
      },
      {
        id: 'rim_brightness',
        type: 'number_slider',
        label: 'Rim light brightness',
        default: 20,
        min: 0,
        max: 35,
        step: 5,
        unit: '%',
      },
      { id: 'blacks_deepen', type: 'number_slider', label: 'Blacks depth', default: 12, min: 6, max: 18, step: 1, unit: 'pts' },
      { id: 'midtone_contrast', type: 'number_slider', label: 'Midtone contrast', default: 15, min: 8, max: 22, step: 1, unit: '%' },
      { id: 'garment_saturation', type: 'number_slider', label: 'Garment saturation', default: 12, min: 5, max: 18, step: 1, unit: '%' },
      {
        id: 'splittone_enabled',
        type: 'toggle',
        label: 'Split-tone (warm/cool)',
        default: true,
        computed_field: 'splittone_clause',
        computed_map: {
          'true': 'Subtle warmth in highlights, subtle coolness in shadows (split-tone, very mild — editorial print magazine style)',
          'false': 'Skip split-tone, keep colors true to scene',
        },
      },
      {
        id: 'genre_anchor',
        type: 'enum',
        label: 'Genre anchor',
        options: [
          { value: 'Final look: high-end e-commerce editorial, premium fashion catalog, Net-a-Porter / Mytheresa quality', label: 'Net-a-Porter (default)' },
          { value: 'Final look: Vogue editorial magazine quality', label: 'Vogue editorial' },
          { value: 'Final look: Zara / Mango catalog quality', label: 'Zara / Mango' },
          { value: 'Final look: ASOS product photography quality', label: 'ASOS' },
          { value: 'Final look: Farfetch luxury catalog quality', label: 'Farfetch luxury' },
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
    stage: 'pass2',
    template:
      'Warm golden grade. Highlights pulled warm (+{{warmth}} temperature), shadows neutral with hint of warm orange in deepest areas, skin glowing slightly amber-warm, saturation +{{sat_overall}}% overall and +{{sat_warm}}% on warm tones. Suits: golden hour, sunset, restaurant, outdoor warm scenes.',
    slots: [
      { id: 'warmth', type: 'number_slider', label: 'Warmth', default: 5, min: 2, max: 10, step: 1, unit: 'pts' },
      { id: 'sat_overall', type: 'number_slider', label: 'Sat overall', default: 6, min: 0, max: 12, step: 1, unit: '%' },
      { id: 'sat_warm', type: 'number_slider', label: 'Sat warm tones', default: 10, min: 0, max: 15, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_B',
    name: 'G_LIF_B — Editorial Neutral',
    stage: 'pass2',
    template:
      'Clean balanced editorial grade. Subtle orange/teal split (very mild, print-magazine style), skin tones true-to-life neither warm nor cool, blacks deepened by {{blacks}} points, saturation +{{sat}}% overall. Suits: office, urban, daytime, premium e-commerce mood.',
    slots: [
      { id: 'blacks', type: 'number_slider', label: 'Blacks', default: 8, min: 4, max: 14, step: 1, unit: 'pts' },
      { id: 'sat', type: 'number_slider', label: 'Saturation', default: 4, min: 0, max: 10, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_C',
    name: 'G_LIF_C — Soft Pastel',
    stage: 'pass2',
    template:
      'Soft pastel grade. Highlights lifted (+{{highlights}} brightness, hint of soft cream warmth), shadows lifted slightly (faded film look, NOT crushed blacks), saturation -{{sat_minus}}% overall and +{{sat_garment}}% on garment only, skin glowing softly diffused. Suits: summer, beach, vineyard, light airy locations.',
    slots: [
      { id: 'highlights', type: 'number_slider', label: 'Highlights lift', default: 8, min: 4, max: 14, step: 1, unit: 'pts' },
      { id: 'sat_minus', type: 'number_slider', label: 'Sat overall (-)', default: 5, min: 0, max: 12, step: 1, unit: '%' },
      { id: 'sat_garment', type: 'number_slider', label: 'Sat garment (+)', default: 8, min: 0, max: 14, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_LIF_D',
    name: 'G_LIF_D — Moody Cinematic',
    stage: 'pass2',
    template:
      'Moody cinematic grade. Blacks deep (+{{blacks}} points), shadows cool, highlights warm but controlled (no blow-out), strong orange/teal split, saturation -{{sat_minus}}% overall and +{{sat_warm}}% on warm tones, skin slightly desaturated for filmic feel. Suits: evening, rooftop bar, hotel lobby, dramatic locations.',
    slots: [
      { id: 'blacks', type: 'number_slider', label: 'Blacks (+)', default: 15, min: 8, max: 22, step: 1, unit: 'pts' },
      { id: 'sat_minus', type: 'number_slider', label: 'Sat overall (-)', default: 3, min: 0, max: 10, step: 1, unit: '%' },
      { id: 'sat_warm', type: 'number_slider', label: 'Sat warm (+)', default: 12, min: 0, max: 18, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['lifestyle_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_UGC_W',
    name: 'G_UGC_W — Phone warm filter',
    stage: 'pass2',
    template:
      'Subtle VSCO-style warm phone filter. Highlights warm +{{warmth}}, shadows lifted slightly, saturation +{{sat}}%, slight grain in shadows, mild warmth boost on skin. Keep "phone photo" character — do not make it look professional.',
    slots: [
      { id: 'warmth', type: 'number_slider', label: 'Warmth', default: 6, min: 2, max: 10, step: 1, unit: 'pts' },
      { id: 'sat', type: 'number_slider', label: 'Saturation', default: 4, min: 0, max: 10, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['ugc_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_UGC_M',
    name: 'G_UGC_M — Phone minimal filter',
    stage: 'pass2',
    template:
      'Subtle muted phone filter. Saturation -{{sat_minus}}%, slight cool shift in shadows, highlights slightly desaturated, contrast +{{contrast}}%, clean minimal feel. Keep "phone photo" character.',
    slots: [
      { id: 'sat_minus', type: 'number_slider', label: 'Saturation (-)', default: 8, min: 4, max: 14, step: 1, unit: '%' },
      { id: 'contrast', type: 'number_slider', label: 'Contrast (+)', default: 5, min: 0, max: 10, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['ugc_base'], stage: 'pass2' },
  },
  {
    type: 'GRADE',
    id: 'G_UGC_P',
    name: 'G_UGC_P — Phone punchy filter',
    stage: 'pass2',
    template:
      'Default iPhone-vibrance enhanced filter. Saturation +{{sat}}%, contrast +{{contrast}}%, blacks slightly deeper, highlights slightly warm, default phone HDR look enhanced. Keep "phone photo" character.',
    slots: [
      { id: 'sat', type: 'number_slider', label: 'Saturation (+)', default: 10, min: 4, max: 16, step: 1, unit: '%' },
      { id: 'contrast', type: 'number_slider', label: 'Contrast (+)', default: 8, min: 4, max: 14, step: 1, unit: '%' },
    ],
    tags: { compatible_with: ['ugc_base'], stage: 'pass2' },
  },
]
