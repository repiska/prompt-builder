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
    prose_template:
      "{{subject}} takes a mirror selfie at home — in a {{room_type}} with a full-length mirror, soft daylight spilling in from a window at the frame edge, a hint of {{decor}} visible. She stands facing the mirror, holding her phone with one hand at chest level (the phone is clearly visible in the reflection). Slight hip pop, weight on one leg, casual outfit-check energy — caught right before she heads out the door. Her expression is soft and natural. Phone tells: found daylight only, a slight glow of the phone screen on her hand.",
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
    prose_template:
      "{{subject}} takes a selfie inside a retail dressing room — a small fitting room, mirror on one side, hangers and a curtain partially in frame. She faces the mirror with her phone at chest level, {{stance}}, slight outfit-check vibe — between fittings on a quick errand. Phone tells: harsh ceiling LED light from above, the phone visible in reflection, clothing tags and extra hangers casually in the shot.",
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
    prose_template:
      "A photo of {{subject}} taken by a friend on the street — {{street_type}} during {{time}}, candid pedestrian energy. She is walking or standing slightly off-balance, looking at the camera with a soft genuine smile, hair lightly windblown — her friend just made a joke. Phone tells: phone main camera (~26mm equivalent), found ambient light, slight motion blur in her hands or hair, candid framing — not perfectly centered.",
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
    prose_template:
      "A casual phone photo of {{subject}} inside a café. A small marble or wooden table holds her latte; a hint of patterned tile floor or warm wood paneling sits in the blurred interior. She is seated, half-turned to the camera with a soft mid-sentence smile, hand near the half-full cup — her friend across the table just said something funny. Phone tells: warm interior tungsten ambient, slight HDR fusion, phone-style sharpening, candid framing.",
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
    prose_template:
      "{{subject}} poses for an OOTD photo at home, a {{wall_type}} as the backdrop, soft daylight pooling in from a window. She stands facing the camera, weight on one leg, hand lightly on her hip, with a slight self-conscious smile — first OOTD post of the day. Phone tells: phone main camera at chest level (held by a friend), found ambient light, a slight overhead window glare on her shoulders.",
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
    prose_template:
      "A candid walking shot of {{subject}} taken by a friend on {{location_kind}}. She is caught mid-stride, looking slightly off-camera with a relaxed smile, one hand brushing her hair behind her ear or holding a bag — caught between shops on a Saturday afternoon. Phone tells: phone main camera (~26mm), motion blur in the hem and hair, ambient daylight, candid off-center framing.",
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
    prose_template:
      "{{subject}} takes a mirror selfie in a {{elevator_style}} building elevator — full-height mirror walls, {{accents}}, polished {{floor_material}} floor, the tight enclosed space framing her in. She stands facing the elevator mirror, phone held at chest or face level (clearly visible in the reflection); her other hand rests at her side or holds {{accessory}}. Weight on one leg, slight hip pop, full body or three-quarter visible in the mirror, the elevator gently moving (a hint of vibration in the reflection). {{expression}}, with the energy of someone {{energy}}. Phone tells: a modern smartphone visible in reflection, {{lighting_quality}}, multiple soft recursive mirror reflections of her and the elevator interior, deliberate framing, a slight glow of the phone screen on her hand.",
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
    prose_template:
      "A date-night phone photo of {{subject}} at an upscale restaurant. A candle-lit table sits in front of her, with a blurred warm interior behind — leather banquette, dark wood paneling — and a {{table_detail}} on the table. She leans slightly forward, looking softly at the camera with a soft smile, her glass half-raised — mid-conversation, the candle just lit. Phone tells: warm tungsten ambient, candle as fill, phone HDR fusion, slight noise in the shadows; a hand may be partially in the frame.",
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
    prose_template:
      "A phone close-up of garment detail held up to natural daylight near a window. A hand is visible holding {{detail_subject}} toward the camera as morning light catches the texture; {{subject}}'s face is not in the frame, or only partially at the edge. Phone tells: phone main camera close-focus, slight chromatic aberration on the bright edges, found ambient light, casual framing.",
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
    prose_template:
      "A phone shot capturing {{subject}} mid-twirl in an open space — {{location_type}} — under bright ambient daylight. Her dress hem flies outward, her hair lifts, her expression is joyful and possibly mid-laugh; her eyes may be closed — caught on the second twirl after the first one missed. Phone tells: phone main camera, slight motion blur in the hem and hair, candid burst-shot framing, HDR fusion.",
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
    prose_template:
      "A phone snapshot of {{subject}} at a {{event_type}}, with {{ambient_lighting}} and a blurred crowd or decor behind her. She faces the camera (a friend may sit at the frame edge), wearing a soft smile and holding {{hand_object}} — between songs, mid-conversation. Phone tells: phone HDR with flash bounce or warm string-light bokeh, slight motion blur, hand-held framing.",
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
    prose_template:
      "A poolside phone photo of {{subject}} at a hotel infinity pool with a {{horizon_view}}, palm leaves at the frame edge, white architecture all around. She leans {{lean_object}}, looking slightly off-camera with a soft confident expression — between sips, sun warm on her shoulder. Phone tells: bright ambient, blue water-reflection bounce, slight phone HDR, sharpening on the reflective edges.",
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
    prose_template:
      "A casual phone photo of {{subject}} at the office — a minimal modern desk with a laptop, coffee cup, plants, and a large window flooding cool daylight. She stands or sits at the desk, looking softly at the camera with a subtle smile, one hand near her coffee — mid-Slack-message, monitor glow faintly catching her face. Phone tells: cool window daylight, phone main camera, slight HDR, candid framing.",
    slots: [],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U14',
    name: 'U14 — GRWM (get ready with me)',
    name_ru: 'U14 — GRWM (собираемся вместе)',
    description_ru: 'Кадр из «собираемся со мной»: халат поверх образа, незаконченный макияж/укладка.',
    template:
      "A 'getting ready' phone shot before going out. Setting: in front of a {{vanity_type}}, soft warm bathroom or vanity light, {{vanity_detail}}. Pose: model captured mid-{{styling_stage}}, robe loosely over the outfit or visible in mirror, holding {{styling_tool}} or paused mid-action. Soft expression — focused, slightly tired, real morning energy. Phone-specific tells: phone propped up or held selfie-style, found vanity light, slight haze on mirror, makeup products visible at edge.",
    prose_template:
      "{{subject}} captures a 'getting ready' phone moment before going out. She is in front of a {{vanity_type}}, soft warm vanity light around her, {{vanity_detail}} on the counter. She is mid-{{styling_stage}} — a robe loose over her outfit (or visible in the mirror), holding a {{styling_tool}} or paused mid-action. Her expression is focused, slightly tired — real morning energy, not modeling. Phone tells: phone propped up or held selfie-style, found vanity light only, slight haze on the mirror, makeup products visible at the frame edge.",
    slots: [
      {
        id: 'vanity_type',
        type: 'enum',
        label: 'Mirror setup',
        label_ru: 'Тип зеркала',
        options: [
          { value: 'bathroom mirror with full countertop', label: 'Bathroom mirror (default)', label_ru: 'Зеркало в ванной (по умолчанию)' },
          { value: 'vanity desk with ring light', label: 'Vanity + ring light', label_ru: 'Туалетный столик с кольцевой лампой' },
          { value: 'hotel bathroom mirror', label: 'Hotel bathroom', label_ru: 'Зеркало в отеле' },
        ],
        default: 'bathroom mirror with full countertop',
      },
      {
        id: 'vanity_detail',
        type: 'enum',
        label: 'Counter clutter',
        label_ru: 'Беспорядок на полке',
        options: [
          { value: 'casually cluttered with skincare and makeup products', label: 'Cluttered (default)', label_ru: 'Беспорядочно (по умолчанию)' },
          { value: 'minimally organized with a few essentials', label: 'Minimal', label_ru: 'Минимум' },
          { value: 'hotel-clean with travel pouches and a few items', label: 'Hotel-clean', label_ru: 'Отельная чистота' },
        ],
        default: 'casually cluttered with skincare and makeup products',
      },
      {
        id: 'styling_stage',
        type: 'enum',
        label: 'Styling stage',
        label_ru: 'Стадия сборов',
        options: [
          { value: 'makeup', label: 'Mid-makeup (default)', label_ru: 'Макияж (по умолчанию)' },
          { value: 'hair-styling', label: 'Hair styling', label_ru: 'Укладка' },
          { value: 'final-touches', label: 'Final touches', label_ru: 'Финальные штрихи' },
          { value: 'post-shower', label: 'Just out of shower', label_ru: 'Только из душа' },
        ],
        default: 'makeup',
      },
      {
        id: 'styling_tool',
        type: 'enum',
        label: 'Tool in hand',
        label_ru: 'В руке',
        options: [
          { value: 'mascara wand', label: 'Mascara wand (default)', label_ru: 'Тушь (по умолчанию)' },
          { value: 'curling iron', label: 'Curling iron', label_ru: 'Плойка' },
          { value: 'hairbrush', label: 'Hairbrush', label_ru: 'Расчёска' },
          { value: 'lipstick', label: 'Lipstick', label_ru: 'Помада' },
          { value: 'no tool, hands paused', label: 'No tool', label_ru: 'Ничего, руки опущены' },
        ],
        default: 'mascara wand',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U15',
    name: 'U15 — Friend POV at table',
    name_ru: 'U15 — Подруга снимает за столом',
    description_ru: 'Подруга через стол снимает кадр на телефон — candid, mid-laugh.',
    template:
      "A candid phone photo taken across a table by a friend. Setting: {{table_setting}}, two people, partial blur of {{table_object}} in foreground, friend's hand or arm possibly in frame edge. Pose: model leaning slightly on table, looking up at the friend's phone with {{moment}}, soft natural expression — caught mid-conversation. Phone-specific tells: phone main camera, found ambient light, slight off-center framing (composition is the friend's casual choice), occasional reflection of menu or window in glassware.",
    prose_template:
      "A candid phone photo of {{subject}} taken from across a table by a friend. The setting is a {{table_setting}}, with two people sharing it; a partial blur of {{table_object}} sits in the foreground, and the friend's hand or arm may sit at the frame edge. {{subject}} leans slightly on the table, looking up at her friend's phone, {{moment}} — caught mid-conversation. Phone tells: phone main camera, found ambient light, slight off-center framing (the friend's casual choice), occasional reflections of menu or window in nearby glassware.",
    slots: [
      {
        id: 'table_setting',
        type: 'enum',
        label: 'Setting',
        label_ru: 'Заведение',
        options: [
          { value: 'cosy coffee shop', label: 'Coffee shop (default)', label_ru: 'Кофейня (по умолчанию)' },
          { value: 'dinner restaurant', label: 'Dinner restaurant', label_ru: 'Ресторан, ужин' },
          { value: 'brunch place with big windows', label: 'Brunch place', label_ru: 'Бранч с панорамными окнами' },
        ],
        default: 'cosy coffee shop',
      },
      {
        id: 'moment',
        type: 'enum',
        label: 'Caught mid-',
        label_ru: 'Что делает',
        options: [
          { value: 'mid-laugh', label: 'Mid-laugh (default)', label_ru: 'Смеётся (по умолчанию)' },
          { value: 'listening intently', label: 'Listening', label_ru: 'Слушает' },
          { value: 'pointing at the menu', label: 'Pointing at menu', label_ru: 'Указывает в меню' },
          { value: 'smiling at the joke', label: 'Soft smile', label_ru: 'Улыбается' },
        ],
        default: 'mid-laugh',
      },
      {
        id: 'table_object',
        type: 'enum',
        label: 'On the table',
        label_ru: 'На столе',
        options: [
          { value: 'a coffee cup', label: 'Coffee cup (default)', label_ru: 'Кофе (по умолчанию)' },
          { value: 'a cocktail glass', label: 'Cocktail glass', label_ru: 'Бокал коктейля' },
          { value: 'a shared plate', label: 'Shared plate', label_ru: 'Тарелка на двоих' },
          { value: 'an open menu', label: 'Open menu', label_ru: 'Открытое меню' },
        ],
        default: 'a coffee cup',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U16',
    name: 'U16 — Friend group selfie',
    name_ru: 'U16 — Селфи с подругами на ивенте',
    description_ru: 'Групповое селфи с друзьями — несколько лиц в кадре, mid-laugh.',
    template:
      "A friend-group selfie or candid taken at {{event_setting}}. Setting: warm bar interior, club, or rooftop, ambient party lighting, blurred crowd. Pose: model with {{friend_count}} squeezed into the frame next to her, all looking at the camera or each other, mid-laugh or mid-toast. {{lighting_type}} casts warm tones across faces. Phone-specific tells: phone selfie or main camera held by one of the group, motion blur as they squeezed in, partial faces or hands cropped at edges, slight phone-flash bounce on the foreground people, deliberate vertical framing.",
    prose_template:
      "A friend-group photo of {{subject}} taken at a {{event_setting}}. She stands squeezed into the frame with {{friend_count}} (visible in the frame next to her), all looking at the camera or at each other, mid-laugh or mid-toast. {{lighting_type}} casts warm tones across their faces; the bar interior or rooftop spreads behind in a blur of warm bokeh. Phone tells: phone selfie or main camera held by one of the group, slight motion blur as they squeezed in, partial faces or hands cropped at the edges, a slight phone-flash bounce on the foreground.",
    slots: [
      {
        id: 'event_setting',
        type: 'enum',
        label: 'Event setting',
        label_ru: 'Тип события',
        options: [
          { value: 'cocktail bar', label: 'Cocktail bar (default)', label_ru: 'Коктейль-бар (по умолчанию)' },
          { value: 'private rooftop hangout', label: 'Private rooftop', label_ru: 'Частная крыша' },
          { value: "friend's birthday dinner", label: "Friend's birthday", label_ru: 'День рождения подруги' },
          { value: 'club VIP table', label: 'Club VIP', label_ru: 'VIP-стол в клубе' },
        ],
        default: 'cocktail bar',
      },
      {
        id: 'friend_count',
        type: 'enum',
        label: 'Friends in frame',
        label_ru: 'Подруг в кадре',
        options: [
          { value: 'one close friend', label: 'One friend', label_ru: 'Одна подруга' },
          { value: 'two friends', label: 'Two friends (default)', label_ru: 'Две подруги (по умолчанию)' },
          { value: 'a casual group of three or four friends', label: 'Group 3-4', label_ru: 'Компания 3-4' },
        ],
        default: 'two friends',
      },
      {
        id: 'lighting_type',
        type: 'enum',
        label: 'Lighting',
        label_ru: 'Освещение',
        options: [
          { value: 'warm string lights overhead', label: 'String lights (default)', label_ru: 'Гирлянды (по умолчанию)' },
          { value: 'a soft phone-flash', label: 'Phone flash', label_ru: 'Вспышка телефона' },
          { value: 'mixed warm bar lighting', label: 'Bar mix', label_ru: 'Тёплый бар' },
          { value: 'soft candles on the table', label: 'Candles', label_ru: 'Свечи' },
        ],
        default: 'warm string lights overhead',
      },
    ],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U17',
    name: 'U17 — Store window reflection',
    name_ru: 'U17 — Отражение в витрине',
    description_ru: 'Самофото в витрине магазина — отражение наслаивается на товары за стеклом.',
    template:
      'A self-photo using a store window as a mirror. Setting: outside a {{store_type}}, daytime, {{store_window_dressing}} visible through the glass behind the reflection. Pose: model standing slightly to the side, phone at chest or hip level, looking softly at the reflection — full or three-quarter visible. Phone-specific tells: reflection layered with merchandise behind the glass, slight glare on the window, ambient daylight, casual urban energy.',
    prose_template:
      "{{subject}} captures a self-photo using a store window as a mirror, outside a {{store_type}} during the day. The reflection layers her with the {{store_window_dressing}} visible through the glass behind it. She stands slightly to the side, phone at chest or hip level, looking softly at the reflection — full or three-quarter visible. Phone tells: the reflection mingles with the merchandise behind the glass, slight glare across the window, ambient daylight, casual urban energy.",
    slots: [
      {
        id: 'store_type',
        type: 'enum',
        label: 'Store type',
        label_ru: 'Тип магазина',
        options: [
          { value: 'luxury fashion boutique', label: 'Luxury boutique (default)', label_ru: 'Премиум-бутик (по умолчанию)' },
          { value: 'streetwear flagship store', label: 'Streetwear', label_ru: 'Стритвир-флагман' },
          { value: 'minimalist department store', label: 'Department store', label_ru: 'Универмаг' },
          { value: 'speciality coffee shop', label: 'Coffee shop', label_ru: 'Кофейня' },
        ],
        default: 'luxury fashion boutique',
      },
      {
        id: 'store_window_dressing',
        type: 'enum',
        label: 'Window display',
        label_ru: 'В витрине',
        options: [
          { value: 'mannequins styled in coordinated looks', label: 'Coordinated mannequins (default)', label_ru: 'Манекены в образах (по умолчанию)' },
          { value: 'a minimalist display with a single product', label: 'Single product', label_ru: 'Один продукт' },
          { value: 'soft neon signage and a logo', label: 'Neon + logo', label_ru: 'Неон и логотип' },
          { value: 'an espresso bar with people inside', label: 'Espresso bar interior', label_ru: 'Интерьер кофейни' },
        ],
        default: 'mannequins styled in coordinated looks',
      },
    ],
    tags: UGC_TAGS,
  },
]
