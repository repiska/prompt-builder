import type { Block, BlockType } from '../lib/types'
import { BASE_BLOCKS } from './base'
import { POSE_BLOCKS } from './poses'
import { LOCATION_BLOCKS } from './locations'
import { CAMERA_BLOCKS } from './cameras'
import { GRADE_BLOCKS } from './grades'
import { UGC_SCENARIO_BLOCKS } from './ugc_scenarios'

export const ALL_BLOCKS: Block[] = [
  ...BASE_BLOCKS,
  ...POSE_BLOCKS,
  ...LOCATION_BLOCKS,
  ...CAMERA_BLOCKS,
  ...GRADE_BLOCKS,
  ...UGC_SCENARIO_BLOCKS,
]

export function findBlock(type: BlockType, id: string): Block | undefined {
  return ALL_BLOCKS.find((b) => b.type === type && b.id === id)
}

export function findBlockById(id: string): Block | undefined {
  return ALL_BLOCKS.find((b) => b.id === id)
}

export function blocksOfType(type: BlockType): Block[] {
  return ALL_BLOCKS.filter((b) => b.type === type)
}

export function blocksOfTypeForBase(type: BlockType, baseId: string): Block[] {
  return blocksOfType(type).filter((b) => {
    const compat = b.tags.compatible_with as string[] | undefined
    if (compat && compat.length > 0 && !compat.includes(baseId)) return false
    const incompat = b.tags.incompatible_with as string[] | undefined
    if (incompat && incompat.includes(baseId)) return false
    return true
  })
}
