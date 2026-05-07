import { findBlock } from '../data/blocks'
import {
  type BlockType,
  type Recipe,
  type ValidationIssue,
  REQUIRED_BLOCKS_BY_GEN,
  type GenerationType,
} from './types'

export interface ValidateInput {
  generation: GenerationType
  recipe: Recipe
}

export function validate({ generation, recipe }: ValidateInput): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const required = REQUIRED_BLOCKS_BY_GEN[generation]
  const baseBlock = findBlock('BASE', recipe.base)
  if (!baseBlock) {
    issues.push({ level: 'error', message: `Base block "${recipe.base}" not found` })
    return issues
  }

  for (const reqType of required) {
    if (!recipe.blocks.some((b) => b.type === reqType)) {
      issues.push({ level: 'error', message: `Missing required block: ${reqType}` })
    }
  }

  for (const ref of recipe.blocks) {
    const block = findBlock(ref.type, ref.id)
    if (!block) {
      issues.push({ level: 'error', message: `Unknown block: ${ref.type} ${ref.id}` })
      continue
    }
    const compat = block.tags.compatible_with as string[] | undefined
    if (compat && compat.length > 0 && !compat.includes(recipe.base)) {
      issues.push({
        level: 'error',
        message: `${ref.id} (${ref.type}) is not compatible with base "${recipe.base}"`,
        blockId: ref.id,
      })
    }
    const incompat = block.tags.incompatible_with as string[] | undefined
    if (incompat && incompat.includes(recipe.base)) {
      issues.push({
        level: 'error',
        message: `${ref.id} (${ref.type}) is explicitly incompatible with "${recipe.base}"`,
        blockId: ref.id,
      })
    }
  }

  // Cross-block: e.g. POSE.recommends_camera vs CAMERA.id
  const pose = recipe.blocks.find((b) => b.type === 'POSE')
  const camera = recipe.blocks.find((b) => b.type === 'CAMERA')
  if (pose && camera) {
    const poseBlock = findBlock('POSE', pose.id)
    if (poseBlock?.tags.recommends_camera && !poseBlock.tags.recommends_camera.includes(camera.id)) {
      issues.push({
        level: 'warning',
        message: `${pose.id} typically pairs with cameras: ${(poseBlock.tags.recommends_camera as string[]).join(', ')}`,
      })
    }
    if (poseBlock?.tags.requires_camera && !(poseBlock.tags.requires_camera as string[]).includes(camera.id)) {
      issues.push({
        level: 'error',
        message: `${pose.id} requires one of: ${(poseBlock.tags.requires_camera as string[]).join(', ')}`,
      })
    }
  }

  // Catalog: LOCATION must be L0
  if (generation === 'catalog') {
    const loc = recipe.blocks.find((b) => b.type === 'LOCATION')
    if (loc && loc.id !== 'L0') {
      issues.push({
        level: 'warning',
        message: 'Catalog usually uses L0 (studio). Other locations may produce off-spec results.',
      })
    }
  }

  return issues
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.level === 'error')
}

export function hasBlockType(recipe: Recipe, t: BlockType): boolean {
  return recipe.blocks.some((b) => b.type === t)
}
