import type { Block } from '../lib/types'

export const BASE_BLOCKS: Block[] = [
  {
    type: 'BASE',
    id: 'catalog_base',
    name: 'Catalog (studio)',
    name_ru: 'Каталог (студия)',
    description: 'Studio catalog wrapper. Pose, studio location and camera fill in.',
    description_ru: 'Студийная каталожная обёртка. Поза, студийная локация и камера подставляются отдельно.',
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
        label_ru: 'Эталон рендера',
        help: 'Camera/sensor reference the model targets for skin and color rendering.',
        help_ru: 'Эталонная камера/сенсор — на её цвет и фактуру кожи равняется генерация.',
        options: [
          { value: 'Hasselblad / Phase One', label: 'Premium catalog (default)', label_ru: 'Премиум-каталог (по умолчанию)' },
          { value: 'Nikon Z9 / Sony A1', label: 'Modern editorial', label_ru: 'Современный editorial' },
          { value: 'Canon 5D Mark IV', label: 'Classic e-commerce', label_ru: 'Классический e-commerce' },
        ],
        default: 'Hasselblad / Phase One',
      },
      {
        id: 'aspect_ratio',
        type: 'enum',
        label: 'Aspect ratio',
        label_ru: 'Соотношение сторон',
        options: [
          { value: '3:4 portrait', label: '3:4 (catalog standard)', label_ru: '3:4 (стандарт каталога)' },
          { value: '4:5 portrait', label: '4:5 (Instagram)', label_ru: '4:5 (Instagram)' },
          { value: '1:1 square', label: '1:1 (square)', label_ru: '1:1 (квадрат)' },
          { value: '9:16 portrait', label: '9:16 (story)', label_ru: '9:16 (вертикальная stories)' },
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
        label_ru: 'Доп. негативные теги',
        help: 'Extra rules to avoid common artifacts.',
        help_ru: 'Дополнительные правила, чтобы убрать типичные артефакты.',
        options: [
          { value: 'no plastic-CGI look', label: 'Avoid CGI feel', label_ru: 'Без CGI-пластика' },
          { value: 'no overly retouched skin', label: 'Avoid over-retouching', label_ru: 'Без пересглаженной кожи' },
          { value: 'no fake catchlights', label: 'Avoid fake catchlights in eyes', label_ru: 'Без искусственных бликов в глазах' },
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
    name_ru: 'Lifestyle (в локации)',
    description: 'Real-world environment wrapper with lighting integration.',
    description_ru: 'Обёртка для съёмки в реальной локации с интеграцией света сцены и модели.',
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
        label_ru: 'Эталон рендера',
        options: [
          { value: 'Hasselblad / Phase One', label: 'Premium editorial (default)', label_ru: 'Премиум editorial (по умолчанию)' },
          { value: 'Nikon Z9 / Sony A1', label: 'Modern editorial', label_ru: 'Современный editorial' },
          { value: 'Leica SL', label: 'Cinematic', label_ru: 'Кинематографичный' },
        ],
        default: 'Hasselblad / Phase One',
      },
      {
        id: 'aspect_ratio',
        type: 'enum',
        label: 'Aspect ratio',
        label_ru: 'Соотношение сторон',
        options: [
          { value: '3:4 portrait', label: '3:4 (default)', label_ru: '3:4 (по умолчанию)' },
          { value: '4:5 portrait', label: '4:5 (Instagram)', label_ru: '4:5 (Instagram)' },
          { value: '4:3 horizontal', label: '4:3 (horizontal)', label_ru: '4:3 (горизонтальный)' },
          { value: '16:9 horizontal', label: '16:9 (cinematic)', label_ru: '16:9 (кино)' },
        ],
        default: '3:4 portrait',
      },
      {
        id: 'integration_strictness',
        type: 'enum',
        label: 'Integration strictness',
        label_ru: 'Строгость интеграции',
        help: 'How tightly the model lighting must match the scene.',
        help_ru: 'Насколько точно свет на модели должен совпадать со светом сцены.',
        options: [
          { value: 'strict — every photon must match', label: 'Strict (default)', label_ru: 'Строго (по умолчанию)' },
          { value: 'moderate — direction must match, density approximate', label: 'Moderate', label_ru: 'Умеренно' },
          { value: 'loose — environmental cues only', label: 'Loose', label_ru: 'Свободно' },
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
        label_ru: 'Доп. негативные теги',
        options: [
          { value: 'no plastic-CGI look', label: 'Avoid CGI feel', label_ru: 'Без CGI-пластика' },
          { value: 'no overly retouched skin', label: 'Avoid over-retouching', label_ru: 'Без пересглаженной кожи' },
          { value: 'no overly stylized color grade in pass 1', label: 'Avoid heavy grade pass-1', label_ru: 'Без сильного грейда в первом проходе' },
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
    name_ru: 'UGC (смартфон)',
    description: 'Authentic smartphone photo — the SCENARIO block bundles location + pose + phone-tells.',
    description_ru: 'Аутентичное фото со смартфона. Сценарий уже включает локацию, позу и характерные «телефонные» детали.',
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
        label_ru: 'Камера телефона',
        options: [
          { value: 'phone main camera (~26mm equiv)', label: 'Main rear (default)', label_ru: 'Основная задняя (по умолчанию)' },
          { value: 'phone selfie camera (~24mm equiv)', label: 'Selfie', label_ru: 'Селфи' },
          { value: 'phone ultrawide (~14mm equiv)', label: 'Ultrawide', label_ru: 'Ультраширик' },
        ],
        default: 'phone main camera (~26mm equiv)',
      },
      {
        id: 'hdr_intensity',
        type: 'enum',
        label: 'HDR intensity',
        label_ru: 'Сила HDR',
        help: 'How aggressive the phone-style HDR fusion is.',
        help_ru: 'Насколько сильно «телефонный» HDR пережимает контраст.',
        options: [
          { value: 'subtle', label: 'Subtle (iPhone smart HDR)', label_ru: 'Лёгкий (как iPhone smart HDR)' },
          { value: 'moderate', label: 'Moderate (default)', label_ru: 'Средний (по умолчанию)' },
          { value: 'strong', label: 'Strong (overcooked phone HDR)', label_ru: 'Сильный (типичный «пережатый» HDR)' },
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
        label_ru: 'Доп. негативные теги',
        options: [
          { value: 'no perfect framing', label: 'Avoid perfect framing', label_ru: 'Без идеально выстроенного кадра' },
          { value: 'no professional retouching', label: 'Avoid pro retouching', label_ru: 'Без профессиональной ретуши' },
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
