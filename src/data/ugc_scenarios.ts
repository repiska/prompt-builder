import type { Block } from '../lib/types'

const UGC_TAGS = { compatible_with: ['ugc_base'], incompatible_with: ['catalog_base', 'lifestyle_base'] }

export const UGC_SCENARIO_BLOCKS: Block[] = [
  {
    type: 'UGC_SCENARIO',
    id: 'U1',
    name: 'U1 — Mirror selfie home',
    name_ru: 'U1 — Селфи в зеркале дома',
    description_ru: 'Зеркальное селфи в спальне/прихожей с дневным светом из окна.',
    template:
      'A mirror selfie taken at home. Setting: a {{room_type}} with a full-length mirror, soft daylight from a window in frame edge, hint of {{decor}} visible. Pose: model standing facing mirror, holding a smartphone with one hand at chest level — phone clearly visible in reflection. Slight hip pop, weight on one leg, casual outfit-check energy. Soft natural expression. Phone-specific tells: phone visible in reflection, found daylight only, slight reflection of phone screen glow on hand.',
    slots: [
      {
        id: 'room_type',
        type: 'enum',
        label: 'Room',
        label_ru: 'Комната',
        options: [
          { value: 'bedroom', label: 'Bedroom (default)', label_ru: 'Спальня (по умолчанию)' },
          { value: 'hallway', label: 'Hallway', label_ru: 'Прихожая' },
          { value: 'walk-in closet', label: 'Walk-in closet', label_ru: 'Гардеробная' },
        ],
        default: 'bedroom',
      },
      {
        id: 'decor',
        type: 'enum',
        label: 'Decor accents',
        label_ru: 'Стиль интерьера',
        options: [
          { value: 'unmade bed and casual decor', label: 'Casual bedroom (default)', label_ru: 'Жилая спальня (по умолчанию)' },
          { value: 'minimalist Scandi decor', label: 'Scandi minimal', label_ru: 'Сканди-минимализм' },
          { value: 'plants and bohemian decor', label: 'Boho with plants', label_ru: 'Бохо с растениями' },
        ],
        default: 'unmade bed and casual decor',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U2',
    name: 'U2 — Dressing room selfie',
    name_ru: 'U2 — Селфи в примерочной',
    description_ru: 'Селфи в магазинной примерочной с жёстким верхним светом.',
    template:
      'Selfie taken inside a retail dressing room. Setting: small fitting room, mirror on one side, hangers and a curtain partially visible. Pose: model facing mirror, phone held at chest level, {{stance}}, slight outfit-check vibe. Phone-specific tells: harsh ceiling LED light from above, phone visible, clothing tags or extra hangers casually in frame.',
    slots: [
      {
        id: 'stance',
        type: 'enum',
        label: 'Stance',
        label_ru: 'Поза',
        options: [
          { value: 'one hand on hip', label: 'Hand on hip (default)', label_ru: 'Рука на бедре (по умолчанию)' },
          { value: 'lifting hem to inspect length', label: 'Inspecting hem', label_ru: 'Поднимает подол, осматривает длину' },
        ],
        default: 'one hand on hip',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U3',
    name: 'U3 — Friend POV outdoor',
    name_ru: 'U3 — Снимает подруга на улице',
    description_ru: 'Уличное candid-фото на телефон от подруги — пешеходная энергия.',
    template:
      'A photo taken by a friend on the street. Setting: {{street_type}} during {{time}}, candid pedestrian energy. Pose: model walking or standing slightly off-balance, looking at camera with a soft genuine smile, hair slightly windblown. Phone-specific tells: phone main camera (~26mm), found ambient light, slight motion blur in hands or hair, candid framing — not perfectly centered.',
    slots: [
      {
        id: 'street_type',
        type: 'enum',
        label: 'Street type',
        label_ru: 'Тип улицы',
        options: [
          { value: 'a quiet city side street', label: 'Quiet side street', label_ru: 'Тихий переулок' },
          { value: 'a busy city street', label: 'Busy street (default)', label_ru: 'Оживлённая улица (по умолчанию)' },
        ],
        default: 'a busy city street',
      },
      {
        id: 'time',
        type: 'enum',
        label: 'Time',
        label_ru: 'Время',
        options: [
          { value: 'mid-morning', label: 'Mid-morning', label_ru: 'Раннее утро' },
          { value: 'late afternoon', label: 'Late afternoon (default)', label_ru: 'Поздний день (по умолчанию)' },
          { value: 'overcast daytime', label: 'Overcast', label_ru: 'Пасмурный день' },
        ],
        default: 'late afternoon',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U4',
    name: 'U4 — Café candid',
    name_ru: 'U4 — В кафе, неформально',
    description_ru: 'Casual телефонное фото в тёплом интерьере кафе.',
    template:
      'A casual phone photo taken inside a café. Setting: small marble or wooden table, latte, hint of patterned tile floor or warm wood paneling, blurred warm interior. Pose: model seated, half-turned to camera, soft smile mid-sentence, hand near cup. Phone-specific tells: warm interior tungsten ambient, slight HDR fusion, phone-style sharpening, candid framing.',
    slots: [],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U5',
    name: 'U5 — OOTD home',
    name_ru: 'U5 — OOTD дома',
    description_ru: 'OOTD у стены дома, мягкий дневной свет из окна.',
    template:
      'An OOTD photo at home. Setting: front of a {{wall_type}} as backdrop, soft daylight from window. Pose: model standing facing camera, weight on one leg, hand lightly on hip, slight self-conscious smile. Phone-specific tells: phone main camera at chest level held by friend, found ambient light, slight overhead window glare on shoulders.',
    slots: [
      {
        id: 'wall_type',
        type: 'enum',
        label: 'Wall',
        label_ru: 'Стена',
        options: [
          { value: 'plain neutral wall', label: 'Plain neutral (default)', label_ru: 'Нейтральная (по умолчанию)' },
          { value: 'textured plaster wall', label: 'Textured plaster', label_ru: 'Фактурная штукатурка' },
          { value: 'brick wall', label: 'Brick', label_ru: 'Кирпич' },
        ],
        default: 'plain neutral wall',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U6',
    name: 'U6 — Walking candid',
    name_ru: 'U6 — Идущая, candid',
    description_ru: 'Кто-то снял в движении: размытие в подоле и волосах.',
    template:
      'A candid walking shot taken by a friend. Setting: {{location_kind}}. Pose: model mid-stride, looking slightly off-camera with a relaxed smile, hand brushing hair behind ear or holding bag. Phone-specific tells: phone main camera (~26mm), motion blur in hem and hair, ambient daylight, candid off-center framing.',
    slots: [
      {
        id: 'location_kind',
        type: 'enum',
        label: 'Location',
        label_ru: 'Локация',
        options: [
          { value: 'sunny boulevard with shops in background', label: 'Sunny boulevard (default)', label_ru: 'Солнечный бульвар (по умолчанию)' },
          { value: 'tree-lined sidewalk', label: 'Tree-lined sidewalk', label_ru: 'Тротуар вдоль деревьев' },
          { value: 'cobblestone alley', label: 'Cobblestone alley', label_ru: 'Брусчатый переулок' },
        ],
        default: 'sunny boulevard with shops in background',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U7',
    name: 'U7 — Elevator mirror selfie',
    name_ru: 'U7 — Селфи в лифте с зеркалом',
    description_ru: 'Селфи в лифте с зеркальными стенами — рекурсивные отражения.',
    template:
      "A mirror selfie taken in an elevator with mirrored walls. Setting: {{elevator_style}} building elevator, full-height mirror walls, {{accents}}, polished {{floor_material}} floor. Tight enclosed space.\n\nPose: model standing facing the elevator mirror, phone held up at chest or face level — phone clearly visible in reflection. Other hand at side or holding {{accessory}}. Weight on one leg, slight hip pop, full body or three-quarter visible in mirror. {{expression}}, '{{energy}}' energy.\n\nPhone-specific tells: phone visible in reflection (modern smartphone), {{lighting_quality}}, multiple soft mirror reflections of model and elevator interior visible (recursive feel), composition framed deliberately, slight reflection of phone screen glow on hand.",
    slots: [
      {
        id: 'elevator_style',
        type: 'enum',
        label: 'Elevator style',
        label_ru: 'Тип здания',
        options: [
          { value: 'modern office', label: 'Office building', label_ru: 'Офисное здание' },
          { value: 'luxury residential', label: 'Luxury residential', label_ru: 'Премиум жилой комплекс' },
          { value: 'boutique hotel', label: 'Boutique hotel', label_ru: 'Бутик-отель' },
        ],
        default: 'modern office',
      },
      {
        id: 'accents',
        type: 'enum',
        label: 'Interior accents',
        label_ru: 'Акценты интерьера',
        options: [
          { value: 'brushed metal accents, illuminated floor buttons panel', label: 'Brushed metal (default)', label_ru: 'Шлифованный металл (по умолчанию)' },
          { value: 'dark wood accents, brass fittings', label: 'Dark wood + brass', label_ru: 'Тёмное дерево + латунь' },
          { value: 'white marble accents, minimal black hardware', label: 'Marble minimal', label_ru: 'Белый мрамор, минимализм' },
        ],
        default: 'brushed metal accents, illuminated floor buttons panel',
      },
      {
        id: 'floor_material',
        type: 'enum',
        label: 'Floor',
        label_ru: 'Пол',
        options: [
          { value: 'marble', label: 'Marble', label_ru: 'Мрамор' },
          { value: 'patterned tile', label: 'Patterned tile', label_ru: 'Узорная плитка' },
          { value: 'polished concrete', label: 'Polished concrete', label_ru: 'Полированный бетон' },
        ],
        default: 'marble',
      },
      {
        id: 'accessory',
        type: 'enum',
        label: 'Accessory in hand',
        label_ru: 'Что в руке',
        options: [
          { value: 'no accessory', label: 'None', label_ru: 'Ничего' },
          { value: 'a small bag', label: 'Bag', label_ru: 'Сумка' },
          { value: 'a laptop sleeve', label: 'Laptop sleeve', label_ru: 'Чехол ноутбука' },
          { value: 'a coffee cup', label: 'Coffee cup', label_ru: 'Стакан кофе' },
        ],
        default: 'no accessory',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'Subtle confident expression', label: 'Confident', label_ru: 'Уверенное' },
          { value: 'Slight smile, casual mood', label: 'Casual smile', label_ru: 'Лёгкая улыбка' },
          { value: 'Neutral focused expression', label: 'Focused', label_ru: 'Сосредоточенное' },
        ],
        default: 'Subtle confident expression',
      },
      {
        id: 'energy',
        type: 'enum',
        label: 'Mood',
        label_ru: 'Настроение',
        options: [
          { value: 'going somewhere', label: 'Going out', label_ru: 'Куда-то идёт' },
          { value: 'morning commute', label: 'Morning commute', label_ru: 'Утренняя дорога' },
          { value: 'after-work drinks', label: 'After-work', label_ru: 'После работы' },
        ],
        default: 'going somewhere',
      },
      {
        id: 'lighting_quality',
        type: 'enum',
        label: 'Lighting',
        label_ru: 'Освещение',
        options: [
          { value: 'overhead LED elevator lighting — slightly cool, harsh on top of head and shoulders, shadows under jaw', label: 'LED cool (default)', label_ru: 'LED холодный (по умолчанию)' },
          { value: 'warm tungsten elevator lighting — soft amber from above, more flattering', label: 'Tungsten warm', label_ru: 'Тёплый накал (мягче)' },
        ],
        default: 'overhead LED elevator lighting — slightly cool, harsh on top of head and shoulders, shadows under jaw',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U8',
    name: 'U8 — Restaurant evening / date night',
    name_ru: 'U8 — Ресторан вечером / свидание',
    description_ru: 'Ресторанное date-night фото на телефон при свече.',
    template:
      'A date-night phone photo at an upscale restaurant. Setting: candle-lit table, blurred warm restaurant interior, leather banquette and dark wood paneling in background, {{table_detail}} on table. Pose: model leaning slightly forward at table, looking softly at camera, soft smile. Phone-specific tells: warm tungsten light, candle as fill, phone HDR fusion, slight noise in shadows, hand may be partially in frame.',
    slots: [
      {
        id: 'table_detail',
        type: 'enum',
        label: 'On table',
        label_ru: 'На столе',
        options: [
          { value: 'wine glass', label: 'Wine glass (default)', label_ru: 'Бокал вина (по умолчанию)' },
          { value: 'cocktail glass', label: 'Cocktail glass', label_ru: 'Коктейль' },
          { value: 'shared plate of food', label: 'Shared plate', label_ru: 'Тарелка на двоих' },
        ],
        default: 'wine glass',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U9',
    name: 'U9 — Detail / fabric close-up',
    name_ru: 'U9 — Деталь, крупный план',
    description_ru: 'Крупный план детали одежды на телефон у окна.',
    template:
      'A phone close-up of garment detail. Setting: held up to natural daylight near window. Pose: hand visible holding {{detail_subject}} toward camera. Face NOT in frame or only partially at edge. Phone-specific tells: phone main camera close-focus, slight chromatic aberration on bright edges, found ambient light, casual framing.',
    slots: [
      {
        id: 'detail_subject',
        type: 'enum',
        label: 'Detail',
        label_ru: 'Что показывает',
        options: [
          { value: 'embroidery on sleeve', label: 'Embroidery sleeve (default)', label_ru: 'Вышивка на рукаве (по умолчанию)' },
          { value: 'lace trim on hem', label: 'Lace hem', label_ru: 'Кружево на подоле' },
          { value: 'fabric drape pinch', label: 'Fabric drape', label_ru: 'Защип ткани' },
          { value: 'button row close-up', label: 'Button row', label_ru: 'Ряд пуговиц' },
        ],
        default: 'embroidery on sleeve',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U10',
    name: 'U10 — Twirl / movement shot',
    name_ru: 'U10 — Кружение / движение',
    description_ru: 'Burst-shot движения на телефон: лёгкая моушн-блюр в подоле.',
    template:
      'A phone shot capturing a twirl. Setting: open space ({{location_type}}), bright ambient daylight. Pose: model mid-twirl, dress hem flying, hair lifted, joyful expression possibly mid-laugh, eyes might be closed. Phone-specific tells: phone main camera, slight motion blur in hem and hair, candid burst-shot framing, HDR fusion.',
    slots: [
      {
        id: 'location_type',
        type: 'enum',
        label: 'Location',
        label_ru: 'Локация',
        options: [
          { value: 'park lawn', label: 'Park lawn (default)', label_ru: 'Лужайка в парке (по умолчанию)' },
          { value: 'rooftop terrace', label: 'Rooftop terrace', label_ru: 'Терраса на крыше' },
          { value: 'beach', label: 'Beach', label_ru: 'Пляж' },
          { value: 'living room', label: 'Living room', label_ru: 'Гостиная' },
        ],
        default: 'park lawn',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U11',
    name: 'U11 — Event / celebration',
    name_ru: 'U11 — Праздник / событие',
    description_ru: 'Фото на ивенте с тёплыми гирляндами и hand-held framing.',
    template:
      'A phone snapshot at an event. Setting: {{event_type}}, {{ambient_lighting}}, blurred crowd or decor in background. Pose: model facing camera with friend possibly in frame edge, soft smile, holding {{hand_object}}. Phone-specific tells: phone HDR with flash bounce or warm string-light bokeh, slight motion blur, hand-held framing.',
    slots: [
      {
        id: 'event_type',
        type: 'enum',
        label: 'Event',
        label_ru: 'Событие',
        options: [
          { value: 'wedding reception', label: 'Wedding (default)', label_ru: 'Свадьба (по умолчанию)' },
          { value: 'birthday dinner', label: 'Birthday dinner', label_ru: 'День рождения, ужин' },
          { value: 'gallery opening', label: 'Gallery opening', label_ru: 'Открытие галереи' },
        ],
        default: 'wedding reception',
      },
      {
        id: 'ambient_lighting',
        type: 'enum',
        label: 'Ambient lighting',
        label_ru: 'Освещение',
        options: [
          { value: 'warm string lights and candles', label: 'String lights (default)', label_ru: 'Гирлянды и свечи (по умолчанию)' },
          { value: 'mood-lit dim interior', label: 'Mood-lit', label_ru: 'Тёмный mood-light' },
        ],
        default: 'warm string lights and candles',
      },
      {
        id: 'hand_object',
        type: 'enum',
        label: 'In hand',
        label_ru: 'В руке',
        options: [
          { value: 'a champagne flute', label: 'Champagne (default)', label_ru: 'Бокал шампанского (по умолчанию)' },
          { value: 'a cocktail', label: 'Cocktail', label_ru: 'Коктейль' },
          { value: 'no object', label: 'Nothing', label_ru: 'Ничего' },
        ],
        default: 'a champagne flute',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U12',
    name: 'U12 — Pool / beach club',
    name_ru: 'U12 — Бассейн / пляж-клуб',
    description_ru: 'Телефонное фото у бассейна — отражения воды, яркий ambient.',
    template:
      'A poolside phone photo. Setting: hotel infinity pool with {{horizon_view}}, palm leaves at frame edge, white architecture. Pose: model leaning {{lean_object}}, looking slightly off-camera, soft confident expression. Phone-specific tells: bright ambient, blue water reflection bounce, slight phone HDR, sharpening on reflective edges.',
    slots: [
      {
        id: 'horizon_view',
        type: 'enum',
        label: 'Horizon',
        label_ru: 'Горизонт',
        options: [
          { value: 'sea horizon', label: 'Sea (default)', label_ru: 'Море (по умолчанию)' },
          { value: 'mountain horizon', label: 'Mountain', label_ru: 'Горы' },
        ],
        default: 'sea horizon',
      },
      {
        id: 'lean_object',
        type: 'enum',
        label: 'Leaning on',
        label_ru: 'Опирается на',
        options: [
          { value: 'against white pool wall', label: 'Pool wall (default)', label_ru: 'Бортик бассейна (по умолчанию)' },
          { value: 'on a sun lounger', label: 'Sun lounger', label_ru: 'Шезлонг' },
        ],
        default: 'against white pool wall',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U13',
    name: 'U13 — Office desk / coffee break',
    name_ru: 'U13 — Офис / кофе-брейк',
    description_ru: 'Кэжуал-фото за рабочим столом с холодным дневным светом.',
    template:
      'A casual phone photo at the office. Setting: minimal modern desk with laptop, coffee cup, plants, large window flooding cool daylight. Pose: model standing or seated at desk, looking softly at camera with subtle smile, hand near coffee. Phone-specific tells: cool window daylight, phone main camera, slight HDR, candid framing.',
    slots: [],
    tags: UGC_TAGS,
  },
]
