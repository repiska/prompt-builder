import type { Block } from '../lib/types'

export const BASE_BLOCKS: Block[] = [
  {
    type: 'BASE',
    id: 'catalog_base',
    name: 'Catalog (studio)',
    description: 'Studio catalog wrapper. Pose, studio location and camera fill in.',
    template: `[REFERENCES] Reference photos of the same model wearing the same outfit. Use these references ONLY for: model identity, garment, and accessories. IGNORE backgrounds and lighting from the references — those will be generated fresh.

[TASK] Generate ONE new catalog photograph. The pose, location/lighting, and camera setup are each specified in the blocks below.

[STRICT 1:1 COPY FROM REFERENCES]
- Model: face, hair (exact color, length, style, parting), skin tone, body proportions — copy exactly
- Garment: every visible detail — fabric type and texture, color, cut, length, sleeves, neckline, waist, hem, all trims and construction details — reproduce 1:1
- Accessories: copy ONLY items that appear consistently across references
- Fabric texture: preserve exact surface character — do not smooth, do not add sheen, do not change weave or drape

[POSE]
{{POSE_BLOCK}}

[LOCATION & LIGHTING]
{{LOCATION_BLOCK}}

[CAMERA]
{{CAMERA_BLOCK}}

[RENDERING]
- Sharp focus, photorealistic, high resolution catalog quality
- Camera character: medium format digital ({{rendering_anchor}} look), natural micro-contrast, true-to-life color
- Aspect ratio: {{aspect_ratio}}
- Render: 16-bit color depth feel, smooth tonal transitions

[NEGATIVE]
{{negative_baseline}} {{negative_extra}}`,
    slots: [
      {
        id: 'rendering_anchor',
        type: 'enum',
        label: 'Rendering anchor',
        options: [
          { value: 'Hasselblad / Phase One', label: 'Premium catalog (default)' },
          { value: 'Nikon Z9 / Sony A1', label: 'Modern editorial' },
          { value: 'Canon 5D Mark IV', label: 'Classic e-commerce' },
        ],
        default: 'Hasselblad / Phase One',
      },
      {
        id: 'aspect_ratio',
        type: 'enum',
        label: 'Aspect ratio',
        options: [
          { value: '3:4 portrait', label: '3:4 (catalog standard)' },
          { value: '4:5 portrait', label: '4:5 (Instagram)' },
          { value: '1:1 square', label: '1:1 (square)' },
          { value: '9:16 portrait', label: '9:16 (story)' },
        ],
        default: '3:4 portrait',
      },
      {
        id: 'negative_baseline',
        type: 'hidden',
        default:
          'Do not add items not in references. Do not change face or body. Do not alter fabric character. No softboxes or studio equipment visible. No stylization, no filters, no artistic effects. No film grain, no analog film look, no vintage rendering.',
      },
      {
        id: 'negative_extra',
        type: 'multiselect',
        label: 'Additional negative tags',
        options: [
          { value: 'no plastic-CGI look', label: 'Avoid CGI feel' },
          { value: 'no overly retouched skin', label: 'Avoid over-retouching' },
          { value: 'no fake catchlights', label: 'Avoid fake catchlights in eyes' },
        ],
        default: [],
        join: ' ',
      },
    ],
    tags: {
      requires_blocks: ['POSE', 'LOCATION', 'CAMERA'],
      compatible_locations: ['L0'],
    },
  },
  {
    type: 'BASE',
    id: 'lifestyle_base',
    name: 'Lifestyle (in scene)',
    description: 'Real-world environment wrapper with lighting integration.',
    template: `[REFERENCES] Reference photos of the same model wearing the same outfit. Use these references ONLY for: model identity, garment, and accessories. IGNORE backgrounds and lighting from the references — those will be replaced by the location described below.

[TASK] Generate ONE new fashion lifestyle photograph showing the model in a real-world location. The pose, location, and camera are each specified in separate blocks.

[STRICT 1:1 COPY FROM REFERENCES]
- Model: face, hair, skin tone, body proportions — copy exactly
- Garment: fabric, color, cut, length, sleeves, neckline, waist, hem, trims — reproduce 1:1
- Accessories: only items consistently visible across references
- Fabric texture: preserve exact surface character

[POSE]
{{POSE_BLOCK}}

[LOCATION & LIGHTING]
{{LOCATION_BLOCK}}

[CAMERA]
{{CAMERA_BLOCK}}

[LIGHTING INTEGRATION — CRITICAL]
Lighting on model MUST physically match the lighting of the location:
- Direction of light on model = direction of dominant light source in the scene
- Color temperature on skin = color temperature of scene ambient
- Shadow density on model = consistent with shadows visible elsewhere
- The model should look like she is genuinely in this place, not composited or pasted in
- Integration strictness: {{integration_strictness}}

[RENDERING]
- Photorealistic, fashion editorial aesthetic — not studio catalog
- Camera character: {{rendering_anchor}} look, natural micro-contrast
- Aspect ratio: {{aspect_ratio}}
- Environment is part of the story, not just a backdrop
- Natural depth of field, subtle motion in fabric, hair, accessories where appropriate

[NEGATIVE]
{{negative_baseline}} {{negative_extra}}`,
    slots: [
      {
        id: 'rendering_anchor',
        type: 'enum',
        label: 'Rendering anchor',
        options: [
          { value: 'Hasselblad / Phase One', label: 'Premium editorial (default)' },
          { value: 'Nikon Z9 / Sony A1', label: 'Modern editorial' },
          { value: 'Leica SL', label: 'Cinematic' },
        ],
        default: 'Hasselblad / Phase One',
      },
      {
        id: 'aspect_ratio',
        type: 'enum',
        label: 'Aspect ratio',
        options: [
          { value: '3:4 portrait', label: '3:4 (default)' },
          { value: '4:5 portrait', label: '4:5 (Instagram)' },
          { value: '4:3 horizontal', label: '4:3 (horizontal)' },
          { value: '16:9 horizontal', label: '16:9 (cinematic)' },
        ],
        default: '3:4 portrait',
      },
      {
        id: 'integration_strictness',
        type: 'enum',
        label: 'Integration strictness',
        options: [
          { value: 'strict — every photon must match', label: 'Strict (default)' },
          { value: 'moderate — direction must match, density approximate', label: 'Moderate' },
          { value: 'loose — environmental cues only', label: 'Loose' },
        ],
        default: 'strict — every photon must match',
      },
      {
        id: 'negative_baseline',
        type: 'hidden',
        default:
          'No studio equipment, no softboxes, no seamless paper backdrop. Do not add items not in references. Do not change face or body proportions. Do not alter garment color, cut, or fabric. No HDR look, no over-saturation. No film grain unless P/L/C blocks specify it. No fake bokeh balls, no excessive lens flare.',
      },
      {
        id: 'negative_extra',
        type: 'multiselect',
        label: 'Additional negative tags',
        options: [
          { value: 'no plastic-CGI look', label: 'Avoid CGI feel' },
          { value: 'no overly retouched skin', label: 'Avoid over-retouching' },
          { value: 'no overly stylized color grade in pass 1', label: 'Avoid heavy grade pass-1' },
        ],
        default: [],
        join: ' ',
      },
    ],
    tags: {
      requires_blocks: ['POSE', 'LOCATION', 'CAMERA'],
    },
  },
  {
    type: 'BASE',
    id: 'ugc_base',
    name: 'UGC (smartphone)',
    description: 'Authentic smartphone photo — the SCENARIO block bundles location + pose + phone-tells.',
    template: `[REFERENCES] Reference photos of the same model wearing the same outfit. Use these references ONLY for: model identity, garment, and accessories. IGNORE backgrounds and lighting from the references.

[TASK] Generate ONE smartphone photo (NOT professional photography). The full scenario is specified in the SCENARIO block below.

[STRICT 1:1 COPY FROM REFERENCES]
- Model: face, hair, skin tone, body proportions — copy exactly
- Garment: fabric, color, cut, length — reproduce 1:1
- Accessories: only consistently visible items

[SCENARIO]
{{SCENARIO_BLOCK}}

[SMARTPHONE PHOTO CHARACTER — universal]
This is a casual smartphone photograph, NOT a professional shot. Camera = {{phone_type}}. Phone-style depth of field — mostly everything in focus, no buttery bokeh. Found light only — no studio, no controlled fashion lighting. Slight phone-rendering: HDR fusion (intensity {{hdr_intensity}}), mild noise in shadows, phone AI sharpening on edges.

[NEGATIVE]
{{negative_baseline}} {{negative_extra}}`,
    slots: [
      {
        id: 'phone_type',
        type: 'enum',
        label: 'Phone camera',
        options: [
          { value: 'phone main camera (~26mm equiv)', label: 'Main rear (default)' },
          { value: 'phone selfie camera (~24mm equiv)', label: 'Selfie' },
          { value: 'phone ultrawide (~14mm equiv)', label: 'Ultrawide' },
        ],
        default: 'phone main camera (~26mm equiv)',
      },
      {
        id: 'hdr_intensity',
        type: 'enum',
        label: 'HDR intensity',
        options: [
          { value: 'subtle', label: 'Subtle (iPhone smart HDR)' },
          { value: 'moderate', label: 'Moderate (default)' },
          { value: 'strong', label: 'Strong (overcooked phone HDR)' },
        ],
        default: 'moderate',
      },
      {
        id: 'negative_baseline',
        type: 'hidden',
        default:
          'No professional photography aesthetic. No studio lighting. No shallow medium-format depth of field. No editorial composition. No film look, no film grain. No color grading, no orange/teal split-tone. No HDR-overcooked look. Do not add items not in references. Do not change face or body. Do not perfect or smooth the lighting. Image must look authentically amateur, not "artistically amateur".',
      },
      {
        id: 'negative_extra',
        type: 'multiselect',
        label: 'Additional negative tags',
        options: [
          { value: 'no perfect framing', label: 'Avoid perfect framing' },
          { value: 'no professional retouching', label: 'Avoid pro retouching' },
        ],
        default: [],
        join: ' ',
      },
    ],
    tags: {
      requires_blocks: ['UGC_SCENARIO'],
    },
  },
]
