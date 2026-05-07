import type { AudioPresetBlock } from '../../lib/types'

export const UGC_AUDIO_PRESET_BLOCKS: AudioPresetBlock[] = [
  {
    kind: 'AUDIO_PRESET',
    id: 'UA1',
    name: 'Bedroom ambience',
    name_ru: 'Атмосфера спальни',
    ambient: {
      id: 'bedroom_room_tone',
      label: 'Bedroom room tone',
      label_ru: 'Тишина спальни',
      prose: 'soft bedroom room tone, distant TV in another room',
    },
    sfx: [],
    dialogue_hint: 'Hook line for the archetype, ≤ 12 words.',
    dialogue_hint_ru: 'Хук-фраза для архетипа, до 12 слов.',
  },
  {
    kind: 'AUDIO_PRESET',
    id: 'UA2',
    name: 'Mall fluorescent',
    name_ru: 'Торговый центр',
    ambient: {
      id: 'mall_fluorescent',
      label: 'Mall fluorescent hum',
      label_ru: 'Гул торгового центра',
      prose: 'mall fluorescent hum, distant chatter, faint store music',
    },
    sfx: [
      {
        id: 'hanger_clink',
        label: 'Hanger clink',
        label_ru: 'Звон вешалки',
        prose: 'a single clothes-hanger clink',
      },
    ],
  },
  {
    kind: 'AUDIO_PRESET',
    id: 'UA3',
    name: 'Café murmur',
    name_ru: 'Гул кафе',
    ambient: {
      id: 'cafe_ugc',
      label: 'Café murmur',
      label_ru: 'Гул кафе',
      prose: 'a quiet café murmur, distant espresso machine',
    },
    sfx: [],
    dialogue_hint: 'Single line, intimate tone, ≤ 10 words.',
    dialogue_hint_ru: 'Одна фраза, доверительный тон, до 10 слов.',
  },
  {
    kind: 'AUDIO_PRESET',
    id: 'UA4',
    name: 'Silent — overlay voiceover',
    name_ru: 'Тишина — для наложения голоса',
    ambient: {
      id: 'silent_for_vo',
      label: 'Silent — overlay voiceover',
      label_ru: 'Тишина — для накладывания голоса',
      prose: 'minimal room tone, intentionally quiet for voiceover overlay',
    },
    sfx: [],
    dialogue_hint:
      'Leave dialogue empty — voiceover added in CapCut/ElevenLabs post-gen.',
    dialogue_hint_ru:
      'Оставьте диалог пустым — голос накладывается в CapCut/ElevenLabs после генерации.',
  },
]
