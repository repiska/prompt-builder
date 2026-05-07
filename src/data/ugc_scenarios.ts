import type { Block } from '../lib/types'

const UGC_TAGS = { compatible_with: ['ugc_base'], incompatible_with: ['catalog_base', 'lifestyle_base'] }

export const UGC_SCENARIO_BLOCKS: Block[] = [
  {
    type: 'UGC_SCENARIO',
    id: 'U1',
    name: 'U1 — Mirror selfie home',
    template:
      'A mirror selfie taken at home. Setting: a {{room_type}} with a full-length mirror, soft daylight from a window in frame edge, hint of {{decor}} visible. Pose: model standing facing mirror, holding a smartphone with one hand at chest level — phone clearly visible in reflection. Slight hip pop, weight on one leg, casual outfit-check energy. Soft natural expression. Phone-specific tells: phone visible in reflection, found daylight only, slight reflection of phone screen glow on hand.',
    slots: [
      {
        id: 'room_type',
        type: 'enum',
        label: 'Room',
        options: [
          { value: 'bedroom', label: 'Bedroom (default)' },
          { value: 'hallway', label: 'Hallway' },
          { value: 'walk-in closet', label: 'Walk-in closet' },
        ],
        default: 'bedroom',
      },
      {
        id: 'decor',
        type: 'enum',
        label: 'Decor accents',
        options: [
          { value: 'unmade bed and casual decor', label: 'Casual bedroom (default)' },
          { value: 'minimalist Scandi decor', label: 'Scandi minimal' },
          { value: 'plants and bohemian decor', label: 'Boho with plants' },
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
    template:
      'Selfie taken inside a retail dressing room. Setting: small fitting room, mirror on one side, hangers and a curtain partially visible. Pose: model facing mirror, phone held at chest level, {{stance}}, slight outfit-check vibe. Phone-specific tells: harsh ceiling LED light from above, phone visible, clothing tags or extra hangers casually in frame.',
    slots: [
      {
        id: 'stance',
        type: 'enum',
        label: 'Stance',
        options: [
          { value: 'one hand on hip', label: 'Hand on hip (default)' },
          { value: 'lifting hem to inspect length', label: 'Inspecting hem' },
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
    template:
      'A photo taken by a friend on the street. Setting: {{street_type}} during {{time}}, candid pedestrian energy. Pose: model walking or standing slightly off-balance, looking at camera with a soft genuine smile, hair slightly windblown. Phone-specific tells: phone main camera (~26mm), found ambient light, slight motion blur in hands or hair, candid framing — not perfectly centered.',
    slots: [
      {
        id: 'street_type',
        type: 'enum',
        label: 'Street type',
        options: [
          { value: 'a quiet city side street', label: 'Quiet side street' },
          { value: 'a busy city street', label: 'Busy street (default)' },
        ],
        default: 'a busy city street',
      },
      {
        id: 'time',
        type: 'enum',
        label: 'Time',
        options: [
          { value: 'mid-morning', label: 'Mid-morning' },
          { value: 'late afternoon', label: 'Late afternoon (default)' },
          { value: 'overcast daytime', label: 'Overcast' },
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
    template:
      'A casual phone photo taken inside a café. Setting: small marble or wooden table, latte, hint of patterned tile floor or warm wood paneling, blurred warm interior. Pose: model seated, half-turned to camera, soft smile mid-sentence, hand near cup. Phone-specific tells: warm interior tungsten ambient, slight HDR fusion, phone-style sharpening, candid framing.',
    slots: [],
    tags: UGC_TAGS,
  },
  {
    type: 'UGC_SCENARIO',
    id: 'U5',
    name: 'U5 — OOTD home',
    template:
      'An OOTD photo at home. Setting: front of a {{wall_type}} as backdrop, soft daylight from window. Pose: model standing facing camera, weight on one leg, hand lightly on hip, slight self-conscious smile. Phone-specific tells: phone main camera at chest level held by friend, found ambient light, slight overhead window glare on shoulders.',
    slots: [
      {
        id: 'wall_type',
        type: 'enum',
        label: 'Wall',
        options: [
          { value: 'plain neutral wall', label: 'Plain neutral (default)' },
          { value: 'textured plaster wall', label: 'Textured plaster' },
          { value: 'brick wall', label: 'Brick' },
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
    template:
      'A candid walking shot taken by a friend. Setting: {{location_kind}}. Pose: model mid-stride, looking slightly off-camera with a relaxed smile, hand brushing hair behind ear or holding bag. Phone-specific tells: phone main camera (~26mm), motion blur in hem and hair, ambient daylight, candid off-center framing.',
    slots: [
      {
        id: 'location_kind',
        type: 'enum',
        label: 'Location',
        options: [
          { value: 'sunny boulevard with shops in background', label: 'Sunny boulevard (default)' },
          { value: 'tree-lined sidewalk', label: 'Tree-lined sidewalk' },
          { value: 'cobblestone alley', label: 'Cobblestone alley' },
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
    template:
      "A mirror selfie taken in an elevator with mirrored walls. Setting: {{elevator_style}} building elevator, full-height mirror walls, {{accents}}, polished {{floor_material}} floor. Tight enclosed space.\n\nPose: model standing facing the elevator mirror, phone held up at chest or face level — phone clearly visible in reflection. Other hand at side or holding {{accessory}}. Weight on one leg, slight hip pop, full body or three-quarter visible in mirror. {{expression}}, '{{energy}}' energy.\n\nPhone-specific tells: phone visible in reflection (modern smartphone), {{lighting_quality}}, multiple soft mirror reflections of model and elevator interior visible (recursive feel), composition framed deliberately, slight reflection of phone screen glow on hand.",
    slots: [
      {
        id: 'elevator_style',
        type: 'enum',
        label: 'Elevator style',
        options: [
          { value: 'modern office', label: 'Office building' },
          { value: 'luxury residential', label: 'Luxury residential' },
          { value: 'boutique hotel', label: 'Boutique hotel' },
        ],
        default: 'modern office',
      },
      {
        id: 'accents',
        type: 'enum',
        label: 'Interior accents',
        options: [
          { value: 'brushed metal accents, illuminated floor buttons panel', label: 'Brushed metal (default)' },
          { value: 'dark wood accents, brass fittings', label: 'Dark wood + brass' },
          { value: 'white marble accents, minimal black hardware', label: 'Marble minimal' },
        ],
        default: 'brushed metal accents, illuminated floor buttons panel',
      },
      {
        id: 'floor_material',
        type: 'enum',
        label: 'Floor',
        options: [
          { value: 'marble', label: 'Marble' },
          { value: 'patterned tile', label: 'Patterned tile' },
          { value: 'polished concrete', label: 'Polished concrete' },
        ],
        default: 'marble',
      },
      {
        id: 'accessory',
        type: 'enum',
        label: 'Accessory in hand',
        options: [
          { value: 'no accessory', label: 'None' },
          { value: 'a small bag', label: 'Bag' },
          { value: 'a laptop sleeve', label: 'Laptop sleeve' },
          { value: 'a coffee cup', label: 'Coffee cup' },
        ],
        default: 'no accessory',
      },
      {
        id: 'expression',
        type: 'enum',
        label: 'Expression',
        options: [
          { value: 'Subtle confident expression', label: 'Confident' },
          { value: 'Slight smile, casual mood', label: 'Casual smile' },
          { value: 'Neutral focused expression', label: 'Focused' },
        ],
        default: 'Subtle confident expression',
      },
      {
        id: 'energy',
        type: 'enum',
        label: 'Mood',
        options: [
          { value: 'going somewhere', label: 'Going out' },
          { value: 'morning commute', label: 'Morning commute' },
          { value: 'after-work drinks', label: 'After-work' },
        ],
        default: 'going somewhere',
      },
      {
        id: 'lighting_quality',
        type: 'enum',
        label: 'Lighting',
        options: [
          { value: 'overhead LED elevator lighting — slightly cool, harsh on top of head and shoulders, shadows under jaw', label: 'LED cool (default)' },
          { value: 'warm tungsten elevator lighting — soft amber from above, more flattering', label: 'Tungsten warm' },
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
    template:
      'A date-night phone photo at an upscale restaurant. Setting: candle-lit table, blurred warm restaurant interior, leather banquette and dark wood paneling in background, {{table_detail}} on table. Pose: model leaning slightly forward at table, looking softly at camera, soft smile. Phone-specific tells: warm tungsten light, candle as fill, phone HDR fusion, slight noise in shadows, hand may be partially in frame.',
    slots: [
      {
        id: 'table_detail',
        type: 'enum',
        label: 'On table',
        options: [
          { value: 'wine glass', label: 'Wine glass (default)' },
          { value: 'cocktail glass', label: 'Cocktail glass' },
          { value: 'shared plate of food', label: 'Shared plate' },
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
    template:
      'A phone close-up of garment detail. Setting: held up to natural daylight near window. Pose: hand visible holding {{detail_subject}} toward camera. Face NOT in frame or only partially at edge. Phone-specific tells: phone main camera close-focus, slight chromatic aberration on bright edges, found ambient light, casual framing.',
    slots: [
      {
        id: 'detail_subject',
        type: 'enum',
        label: 'Detail',
        options: [
          { value: 'embroidery on sleeve', label: 'Embroidery sleeve (default)' },
          { value: 'lace trim on hem', label: 'Lace hem' },
          { value: 'fabric drape pinch', label: 'Fabric drape' },
          { value: 'button row close-up', label: 'Button row' },
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
    template:
      'A phone shot capturing a twirl. Setting: open space ({{location_type}}), bright ambient daylight. Pose: model mid-twirl, dress hem flying, hair lifted, joyful expression possibly mid-laugh, eyes might be closed. Phone-specific tells: phone main camera, slight motion blur in hem and hair, candid burst-shot framing, HDR fusion.',
    slots: [
      {
        id: 'location_type',
        type: 'enum',
        label: 'Location',
        options: [
          { value: 'park lawn', label: 'Park lawn (default)' },
          { value: 'rooftop terrace', label: 'Rooftop terrace' },
          { value: 'beach', label: 'Beach' },
          { value: 'living room', label: 'Living room' },
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
    template:
      'A phone snapshot at an event. Setting: {{event_type}}, {{ambient_lighting}}, blurred crowd or decor in background. Pose: model facing camera with friend possibly in frame edge, soft smile, holding {{hand_object}}. Phone-specific tells: phone HDR with flash bounce or warm string-light bokeh, slight motion blur, hand-held framing.',
    slots: [
      {
        id: 'event_type',
        type: 'enum',
        label: 'Event',
        options: [
          { value: 'wedding reception', label: 'Wedding (default)' },
          { value: 'birthday dinner', label: 'Birthday dinner' },
          { value: 'gallery opening', label: 'Gallery opening' },
        ],
        default: 'wedding reception',
      },
      {
        id: 'ambient_lighting',
        type: 'enum',
        label: 'Ambient lighting',
        options: [
          { value: 'warm string lights and candles', label: 'String lights (default)' },
          { value: 'mood-lit dim interior', label: 'Mood-lit' },
        ],
        default: 'warm string lights and candles',
      },
      {
        id: 'hand_object',
        type: 'enum',
        label: 'In hand',
        options: [
          { value: 'a champagne flute', label: 'Champagne (default)' },
          { value: 'a cocktail', label: 'Cocktail' },
          { value: 'no object', label: 'Nothing' },
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
    template:
      'A poolside phone photo. Setting: hotel infinity pool with {{horizon_view}}, palm leaves at frame edge, white architecture. Pose: model leaning {{lean_object}}, looking slightly off-camera, soft confident expression. Phone-specific tells: bright ambient, blue water reflection bounce, slight phone HDR, sharpening on reflective edges.',
    slots: [
      {
        id: 'horizon_view',
        type: 'enum',
        label: 'Horizon',
        options: [
          { value: 'sea horizon', label: 'Sea (default)' },
          { value: 'mountain horizon', label: 'Mountain' },
        ],
        default: 'sea horizon',
      },
      {
        id: 'lean_object',
        type: 'enum',
        label: 'Leaning on',
        options: [
          { value: 'against white pool wall', label: 'Pool wall (default)' },
          { value: 'on a sun lounger', label: 'Sun lounger' },
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
    template:
      'A casual phone photo at the office. Setting: minimal modern desk with laptop, coffee cup, plants, large window flooding cool daylight. Pose: model standing or seated at desk, looking softly at camera with subtle smile, hand near coffee. Phone-specific tells: cool window daylight, phone main camera, slight HDR, candid framing.',
    slots: [],
    tags: UGC_TAGS,
  },
]
