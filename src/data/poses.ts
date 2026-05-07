import type { Block } from '../lib/types'

const COMPATIBLE_NORMAL = ['catalog_base', 'lifestyle_base']
const COMPATIBLE_LIFESTYLE = ['lifestyle_base']

export const POSE_BLOCKS: Block[] = [
  {
    type: 'POSE',
    id: 'P1',
    name: 'P1 — Front straight contrapposto',
    name_ru: 'P1 — Анфас, естественный контрапост',
    description_ru: 'Анфас, вес слегка перенесён на одну ногу — самая базовая каталожная поза.',
    template:
      "Model standing facing camera, weight slightly on one leg in natural contrapposto, arms relaxed at sides, shoulders open, soft confident expression, {{gaze}}, {{expression}}.",
    slots: [
      {
        id: 'gaze',
        type: 'enum',
        label: 'Gaze',
        label_ru: 'Взгляд',
        options: [
          { value: 'direct gaze into camera', label: 'Direct (default)', label_ru: 'В камеру (по умолчанию)' },
          { value: 'soft gaze into camera', label: 'Soft direct', label_ru: 'Мягко в камеру' },
          { value: 'looking slightly off-camera', label: 'Off-camera', label_ru: 'Чуть мимо камеры' },
        ],
        default: 'direct gaze into camera',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'neutral closed-mouth', label: 'Neutral', label_ru: 'Нейтральное' },
          { value: 'subtle closed-mouth smile', label: 'Subtle smile (default)', label_ru: 'Лёгкая улыбка (по умолчанию)' },
          { value: 'soft genuine smile', label: 'Genuine smile', label_ru: 'Искренняя улыбка' },
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
    name_ru: 'P2 — Editorial 3/4 (журнальная)',
    description_ru: 'Корпус развёрнут на 3/4, рука на бедре. Журнальная редакторская энергия.',
    template:
      "Model's torso rotated {{rotation_deg}} degrees to camera-{{rotation_side}}, weight shifted to back leg in {{stance_intensity}} contrapposto, one hand resting naturally on hip with elbow out (creates triangle of negative space at waist), other arm relaxed at side, shoulders open and relaxed, chin {{chin_position}}, {{gaze_description}}, {{expression}} — magazine editorial energy.",
    slots: [
      {
        id: 'rotation_deg',
        type: 'number_slider',
        label: 'Body rotation',
        label_ru: 'Поворот корпуса',
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
        label_ru: 'Сторона поворота',
        options: [
          { value: 'left', label: 'Left', label_ru: 'Влево' },
          { value: 'right', label: 'Right', label_ru: 'Вправо' },
        ],
        default: 'left',
      },
      {
        id: 'stance_intensity',
        type: 'enum',
        label: 'Contrapposto',
        label_ru: 'Сила контрапоста',
        options: [
          { value: 'subtle', label: 'Subtle', label_ru: 'Лёгкий' },
          { value: 'confident', label: 'Confident (default)', label_ru: 'Уверенный (по умолчанию)' },
          { value: 'strong', label: 'Strong', label_ru: 'Выраженный' },
        ],
        default: 'confident',
      },
      {
        id: 'chin_position',
        type: 'enum',
        label: 'Chin',
        label_ru: 'Подбородок',
        options: [
          { value: 'level', label: 'Level', label_ru: 'Прямо' },
          { value: 'slightly forward and down', label: 'Slightly forward (default)', label_ru: 'Слегка вперёд и вниз (по умолчанию)' },
          { value: 'slightly up', label: 'Slightly up', label_ru: 'Слегка приподнят' },
        ],
        default: 'slightly forward and down',
      },
      {
        id: 'gaze_description',
        type: 'enum',
        label: 'Gaze',
        label_ru: 'Взгляд',
        options: [
          { value: 'direct confident gaze into camera', label: 'Direct confident', label_ru: 'Уверенно в камеру' },
          { value: 'soft gaze into camera', label: 'Soft direct', label_ru: 'Мягко в камеру' },
          { value: 'looking off-camera to the side', label: 'Off-camera', label_ru: 'В сторону от камеры' },
          { value: 'looking down past camera', label: 'Down past camera', label_ru: 'Мимо вниз' },
        ],
        default: 'direct confident gaze into camera',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'neutral closed-mouth', label: 'Neutral', label_ru: 'Нейтральное' },
          { value: 'subtle closed-mouth smile', label: 'Subtle smile (default)', label_ru: 'Лёгкая улыбка (по умолчанию)' },
          { value: 'soft genuine smile', label: 'Genuine smile', label_ru: 'Искренняя улыбка' },
          { value: 'slight knowing smile', label: 'Knowing smile', label_ru: 'Понимающая улыбка' },
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
    name_ru: 'P3 — Боковой профиль',
    description_ru: 'Модель в профиль — фокус на силуэте и крое одежды.',
    template:
      'Model standing in profile facing {{profile_side}} of frame, arms naturally at sides, weight evenly distributed, eyes looking forward (in direction of profile), {{expression}}. Body silhouette is the focus — straight posture, no twist.',
    slots: [
      {
        id: 'profile_side',
        type: 'enum',
        label: 'Profile facing',
        label_ru: 'Лицом к',
        options: [
          { value: 'left', label: 'Left', label_ru: 'Влево' },
          { value: 'right', label: 'Right', label_ru: 'Вправо' },
        ],
        default: 'left',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'neutral expression', label: 'Neutral (default)', label_ru: 'Нейтральное (по умолчанию)' },
          { value: 'soft contemplative expression', label: 'Contemplative', label_ru: 'Задумчивое' },
          { value: 'subtle smile', label: 'Subtle smile', label_ru: 'Лёгкая улыбка' },
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
    name_ru: 'P4 — Спиной, взгляд через плечо',
    description_ru: 'Спиной к камере с поворотом головы — показывает спинку платья.',
    template:
      'Model with back to camera, head turned to look {{look_intensity}} over {{shoulder_side}} shoulder toward camera, arms relaxed at sides, weight slightly on one leg, {{expression}}, hair naturally falling. Shows back of garment.',
    slots: [
      {
        id: 'look_intensity',
        type: 'enum',
        label: 'Look intensity',
        label_ru: 'Интенсивность взгляда',
        options: [
          { value: 'softly', label: 'Soft (default)', label_ru: 'Мягко (по умолчанию)' },
          { value: 'directly', label: 'Direct', label_ru: 'Прямо' },
        ],
        default: 'softly',
      },
      {
        id: 'shoulder_side',
        type: 'enum',
        label: 'Shoulder',
        label_ru: 'Через плечо',
        options: [
          { value: 'right', label: 'Right', label_ru: 'Правое' },
          { value: 'left', label: 'Left', label_ru: 'Левое' },
        ],
        default: 'right',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'calm expression', label: 'Calm (default)', label_ru: 'Спокойное (по умолчанию)' },
          { value: 'subtle smile', label: 'Subtle smile', label_ru: 'Лёгкая улыбка' },
          { value: 'pensive expression', label: 'Pensive', label_ru: 'Задумчивое' },
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
    name_ru: 'P5 — В шаге, ходьба',
    description_ru: 'Модель в движении — пойман середина шага, ткань и волосы развеваются.',
    template:
      'Model walking, captured mid-step with one foot forward and one back, slight movement in dress hem and hair, one hand {{hand_action}}, other arm relaxed, looking {{gaze_direction}} with relaxed natural expression. Captured candidly — not posed, caught in motion.',
    slots: [
      {
        id: 'hand_action',
        type: 'enum',
        label: 'Hand',
        label_ru: 'Что делает рука',
        options: [
          { value: 'brushing hair behind ear', label: 'Hair behind ear (default)', label_ru: 'Заправляет волосы (по умолчанию)' },
          { value: 'holding a small bag', label: 'Holding bag', label_ru: 'Держит сумку' },
          { value: 'holding a coffee cup', label: 'Holding coffee', label_ru: 'Держит кофе' },
          { value: 'in pocket', label: 'In pocket', label_ru: 'В кармане' },
        ],
        default: 'brushing hair behind ear',
      },
      {
        id: 'gaze_direction',
        type: 'enum',
        label: 'Gaze',
        label_ru: 'Взгляд',
        options: [
          { value: 'slightly off-camera', label: 'Off-camera (default)', label_ru: 'Чуть мимо камеры (по умолчанию)' },
          { value: 'into camera', label: 'Into camera', label_ru: 'В камеру' },
          { value: 'down past camera', label: 'Down past camera', label_ru: 'Вниз мимо камеры' },
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
    name_ru: 'P6 — За столом, расслабленно',
    description_ru: 'Сидячая поза за столом — энергия живого разговора.',
    template:
      'Model seated at a table, leaning {{lean_direction}}, one hand resting near a {{table_object}} on the table, other in lap or gesturing, body turned three-quarter to camera, looking softly toward camera with {{expression}}. Natural conversation energy.',
    slots: [
      {
        id: 'lean_direction',
        type: 'enum',
        label: 'Lean',
        label_ru: 'Наклон',
        options: [
          { value: 'slightly forward', label: 'Forward (engaged)', label_ru: 'Слегка вперёд (вовлечённо)' },
          { value: 'slightly back relaxed', label: 'Back relaxed (default)', label_ru: 'Слегка назад, расслабленно (по умолчанию)' },
        ],
        default: 'slightly back relaxed',
      },
      {
        id: 'table_object',
        type: 'enum',
        label: 'On table',
        label_ru: 'На столе',
        options: [
          { value: 'cup', label: 'Cup (default)', label_ru: 'Чашка (по умолчанию)' },
          { value: 'wine glass', label: 'Wine glass', label_ru: 'Бокал вина' },
          { value: 'open notebook', label: 'Notebook', label_ru: 'Блокнот' },
        ],
        default: 'cup',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'relaxed engaged expression', label: 'Engaged (default)', label_ru: 'Вовлечённое (по умолчанию)' },
          { value: 'soft genuine smile', label: 'Soft smile', label_ru: 'Мягкая улыбка' },
          { value: 'thoughtful expression', label: 'Thoughtful', label_ru: 'Задумчивое' },
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
    name_ru: 'P7 — Взгляд вдаль (vista)',
    description_ru: 'Поза «момент» — модель смотрит вдаль, не в камеру.',
    template:
      'Model standing turned three-quarter away from camera, looking off into the distance (away from camera), hand resting lightly on a {{rest_object}}, weight on back leg, hair moving slightly in breeze, {{expression}} expression — NOT looking at camera. Environmental "moment" energy.',
    slots: [
      {
        id: 'rest_object',
        type: 'enum',
        label: 'Hand rests on',
        label_ru: 'Рука опирается на',
        options: [
          { value: 'railing', label: 'Railing (default)', label_ru: 'Перила (по умолчанию)' },
          { value: 'hip', label: 'Hip', label_ru: 'Бедро' },
          { value: 'window frame', label: 'Window frame', label_ru: 'Раму окна' },
        ],
        default: 'railing',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'soft contemplative', label: 'Contemplative (default)', label_ru: 'Задумчивое (по умолчанию)' },
          { value: 'confident', label: 'Confident', label_ru: 'Уверенное' },
          { value: 'wistful', label: 'Wistful', label_ru: 'Мечтательное' },
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
    name_ru: 'P8 — Кружение, движение',
    description_ru: 'Движение в кадре — подол летит, волосы взмётнулись.',
    template:
      'Model captured mid-twirl: body rotating, dress hem flying outward in circular arc, hair lifted following rotation, arms either extended for balance or relaxed swinging. Face in {{face_orientation}} to camera, {{expression}}, eyes might be closed or looking down at the dress. NOT a static held pose — captured in real movement.',
    slots: [
      {
        id: 'face_orientation',
        type: 'enum',
        label: 'Face orientation',
        label_ru: 'Положение лица',
        options: [
          { value: 'profile', label: 'Profile', label_ru: 'Профиль' },
          { value: 'three-quarter', label: 'Three-quarter (default)', label_ru: 'Три четверти (по умолчанию)' },
        ],
        default: 'three-quarter',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'genuine joyful expression possibly mid-laugh', label: 'Joyful laugh (default)', label_ru: 'Радость, возможно смех (по умолчанию)' },
          { value: 'soft smile, eyes closed', label: 'Soft smile', label_ru: 'Мягкая улыбка, глаза закрыты' },
          { value: 'serene expression', label: 'Serene', label_ru: 'Безмятежное' },
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
    name_ru: 'P9 — Прислонилась к стене/перилам',
    description_ru: 'Расслабленный наклон к опоре — энергия лёгкости.',
    template:
      'Model leaning casually with {{contact_part}} against a {{lean_object}}, weight shifted, one leg slightly crossed in front, hands {{hands_position}}, body turned three-quarter to camera, looking at camera with {{expression}}. Effortless lean energy.',
    slots: [
      {
        id: 'contact_part',
        type: 'enum',
        label: 'Contact part',
        label_ru: 'Чем прислонилась',
        options: [
          { value: 'back', label: 'Back', label_ru: 'Спиной' },
          { value: 'shoulder', label: 'Shoulder (default)', label_ru: 'Плечом (по умолчанию)' },
        ],
        default: 'shoulder',
      },
      {
        id: 'lean_object',
        type: 'enum',
        label: 'Object',
        label_ru: 'Опора',
        options: [
          { value: 'wall', label: 'Wall (default)', label_ru: 'Стена (по умолчанию)' },
          { value: 'railing', label: 'Railing', label_ru: 'Перила' },
          { value: 'column', label: 'Column', label_ru: 'Колонна' },
        ],
        default: 'wall',
      },
      {
        id: 'hands_position',
        type: 'enum',
        label: 'Hands',
        label_ru: 'Руки',
        options: [
          { value: 'in pockets', label: 'In pockets', label_ru: 'В карманах' },
          { value: 'one on hip', label: 'One on hip (default)', label_ru: 'Одна на бедре (по умолчанию)' },
          { value: 'holding a small object', label: 'Holding object', label_ru: 'Держит небольшой предмет' },
        ],
        default: 'one on hip',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'calm composed expression', label: 'Composed (default)', label_ru: 'Сдержанное (по умолчанию)' },
          { value: 'slight smile', label: 'Slight smile', label_ru: 'Лёгкая улыбка' },
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
    name_ru: 'P10 — Селфи в зеркале с телефоном',
    description_ru: 'Селфи перед зеркалом — поза для UGC.',
    template:
      'Model standing facing a mirror, holding a smartphone with {{hand_count}} at chest or face level — phone clearly visible in reflection (partial face occlusion is OK — realistic). Slight hip pop, weight on one leg, casual outfit-check energy. Soft natural expression, not modeling — just checking the look. Other hand may lightly touch the dress or relax at side.',
    slots: [
      {
        id: 'hand_count',
        type: 'enum',
        label: 'Phone held with',
        label_ru: 'Телефон в руках',
        options: [
          { value: 'both hands', label: 'Both hands', label_ru: 'Двумя руками' },
          { value: 'one hand', label: 'One hand (default)', label_ru: 'Одной рукой (по умолчанию)' },
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
    name_ru: 'P11 — OOTD анфас',
    description_ru: 'Поза «outfit of the day» — анфас, лёгкая стеснительность, осознанная демонстрация образа.',
    template:
      'Model standing facing camera, full body in frame, weight on one leg, hands {{hand_position}}. Casual aware-of-camera expression — {{expression}}. NOT modeling, but deliberately presenting the outfit (this is a chosen "outfit of the day" pose, slightly self-conscious in a charming way).',
    slots: [
      {
        id: 'hand_position',
        type: 'enum',
        label: 'Hands',
        label_ru: 'Руки',
        options: [
          { value: 'loose at sides', label: 'Loose at sides', label_ru: 'Свободно вдоль тела' },
          { value: 'one hand lightly on hip', label: 'One on hip (default)', label_ru: 'Одна на бедре (по умолчанию)' },
        ],
        default: 'one hand lightly on hip',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        label_ru: 'Выражение лица',
        options: [
          { value: 'soft smile', label: 'Soft smile (default)', label_ru: 'Мягкая улыбка (по умолчанию)' },
          { value: 'neutral relaxed face', label: 'Neutral', label_ru: 'Нейтральное' },
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
    name_ru: 'P12 — Деталь, крупный план',
    description_ru: 'Крупный план детали одежды — лица в кадре нет (или только частично).',
    template:
      "Hand visible in frame holding up a portion of the garment — {{detail_focus}} — toward camera. The fabric/detail IS the subject. Model's face NOT in frame or only partially at edge.",
    slots: [
      {
        id: 'detail_focus',
        type: 'enum',
        label: 'Detail focus',
        label_ru: 'Что показывает',
        options: [
          { value: 'pinching fabric to show drape', label: 'Drape pinch (default)', label_ru: 'Защип, показывает драпировку (по умолчанию)' },
          { value: 'sleeve held at arm length', label: 'Sleeve', label_ru: 'Рукав на вытянутой руке' },
          { value: 'hem lifted slightly', label: 'Hem', label_ru: 'Подол приподнят' },
          { value: 'close-up of embroidery or trim', label: 'Embroidery/trim', label_ru: 'Вышивка или отделка' },
        ],
        default: 'pinching fabric to show drape',
      },
    ],
    tags: { compatible_with: COMPATIBLE_NORMAL, recommends_camera: ['C2', 'C3'] },
  },
]
