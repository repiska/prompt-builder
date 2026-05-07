import type { VideoBlock } from '../../lib/types'
import { VIDEO_BASE_BLOCKS } from './base'
import { MOTION_BLOCKS } from './motions'
import { CAMERA_MOVE_BLOCKS } from './camera_moves'
import { GRADE_VIDEO_BLOCKS } from './grades'
import { AUDIO_PRESET_BLOCKS } from './audio_presets'
import { UGC_VIDEO_BASE_BLOCKS } from './ugc_base'
import { UGC_MOTION_BLOCKS } from './ugc_motions'
import { UGC_CAMERA_MOVE_BLOCKS } from './ugc_camera_moves'
import { UGC_AUDIO_PRESET_BLOCKS } from './ugc_audio_presets'
import { VIDEO_RECIPES } from './recipes'
import { UGC_RECIPES } from './ugc_recipes'

export { VIDEO_BASE_BLOCKS } from './base'
export { MOTION_BLOCKS } from './motions'
export { CAMERA_MOVE_BLOCKS } from './camera_moves'
export { GRADE_VIDEO_BLOCKS } from './grades'
export { AUDIO_PRESET_BLOCKS } from './audio_presets'
export { VIDEO_RECIPES } from './recipes'
export { UGC_VIDEO_BASE_BLOCKS } from './ugc_base'
export { UGC_MOTION_BLOCKS } from './ugc_motions'
export { UGC_CAMERA_MOVE_BLOCKS } from './ugc_camera_moves'
export { UGC_AUDIO_PRESET_BLOCKS } from './ugc_audio_presets'
export { UGC_RECIPES } from './ugc_recipes'

export const ALL_VIDEO_BLOCKS: VideoBlock[] = [
  ...VIDEO_BASE_BLOCKS,
  ...MOTION_BLOCKS,
  ...CAMERA_MOVE_BLOCKS,
  ...GRADE_VIDEO_BLOCKS,
  ...AUDIO_PRESET_BLOCKS,
  ...UGC_VIDEO_BASE_BLOCKS,
  ...UGC_MOTION_BLOCKS,
  ...UGC_CAMERA_MOVE_BLOCKS,
  ...UGC_AUDIO_PRESET_BLOCKS,
]

export const ALL_VIDEO_RECIPES = [...VIDEO_RECIPES, ...UGC_RECIPES]
