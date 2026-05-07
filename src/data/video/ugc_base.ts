import type { VideoBaseBlock } from '../../lib/types'

export const UGC_VIDEO_BASE: VideoBaseBlock = {
  kind: 'VIDEO_BASE',
  id: 'VB_UGC',
  name: 'UGC selfie video (social)',
  name_ru: 'UGC селфи-видео (соцсети)',
  description:
    'Vertical authentic selfie video for TikTok / Reels / Shorts — handheld, ring-light or window light, anti-AI cues by default.',
  description_ru:
    'Вертикальное аутентичное селфи-видео для TikTok / Reels / Shorts — хэндхелд, рингсвет или окно, анти-AI приёмы по умолчанию.',
  variant: 'ugc',
  defaultDuration: 8,
  defaultAspectRatio: '9:16',
  defaultResolution: '1080p',
  defaultTier: 'generate',
  slots: [],
  prose_template:
    'UGC creator. A selfie video shot on iPhone front camera, vertical 9:16, ' +
    'arm clearly visible holding the phone, handheld with slight wobble and micro-shake from breathing, ' +
    'slightly grainy, film-like, not over-sharpened. Natural skin texture with visible pores, ' +
    'minimal makeup, eyes drift naturally with occasional glance off-camera and irregular blinks. ' +
    'Imperfect framing — subject slightly off-center.',
  prose_subject_intro:
    'The model from the reference image, wearing the garment from the reference image.',
  prose_context:
    'No studio lighting; window light, ring-light reflection, or mall fluorescent only.',
}

export const UGC_VIDEO_BASE_BLOCKS: VideoBaseBlock[] = [UGC_VIDEO_BASE]
