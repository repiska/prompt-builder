import type { AudioPresetBlock } from '../../lib/types'

export const AUDIO_PRESET_BLOCKS: AudioPresetBlock[] = [
  {
    kind: 'AUDIO_PRESET',
    id: 'VA1',
    name: 'Studio silence',
    name_ru: 'Студийная тишина',
    ambient: {
      id: 'studio_silence',
      label: 'Studio silence',
      label_ru: 'Студийная тишина',
      prose: 'a clean studio room tone with no music',
    },
    sfx: [],
  },
  {
    kind: 'AUDIO_PRESET',
    id: 'VA2',
    name: 'Lookbook ambience',
    name_ru: 'Лукбук-атмосфера',
    ambient: {
      id: 'lookbook_room',
      label: 'Open loft room tone',
      label_ru: 'Просторный лофт',
      prose: 'soft room tone of a sunlit loft, distant city hum',
    },
    sfx: [
      {
        id: 'fabric_rustle',
        label: 'Fabric rustle',
        label_ru: 'Шорох ткани',
        prose: 'subtle fabric rustle as the garment moves',
      },
    ],
  },
  {
    kind: 'AUDIO_PRESET',
    id: 'VA3',
    name: 'Café UGC',
    name_ru: 'Кафе (UGC)',
    ambient: {
      id: 'cafe_murmur',
      label: 'Café murmur',
      label_ru: 'Гул кафе',
      prose: 'a quiet café murmur, distant espresso machine',
    },
    sfx: [
      {
        id: 'cup_clink',
        label: 'Cup clink',
        label_ru: 'Звон чашки',
        prose: 'a single cup clink in the background',
      },
    ],
    dialogue_hint: 'A single short line — under 12 words.',
    dialogue_hint_ru: 'Одна короткая фраза — до 12 слов.',
  },
]
