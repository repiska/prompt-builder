import type { VideoBlock } from '../../lib/types'
import { VIDEO_BASE_BLOCKS } from './base'
import { MOTION_BLOCKS } from './motions'
import { CAMERA_MOVE_BLOCKS } from './camera_moves'
import { GRADE_VIDEO_BLOCKS } from './grades'
import { AUDIO_PRESET_BLOCKS } from './audio_presets'

export { VIDEO_BASE_BLOCKS } from './base'
export { MOTION_BLOCKS } from './motions'
export { CAMERA_MOVE_BLOCKS } from './camera_moves'
export { GRADE_VIDEO_BLOCKS } from './grades'
export { AUDIO_PRESET_BLOCKS } from './audio_presets'
export { VIDEO_RECIPES } from './recipes'

export const ALL_VIDEO_BLOCKS: VideoBlock[] = [
  ...VIDEO_BASE_BLOCKS,
  ...MOTION_BLOCKS,
  ...CAMERA_MOVE_BLOCKS,
  ...GRADE_VIDEO_BLOCKS,
  ...AUDIO_PRESET_BLOCKS,
]
