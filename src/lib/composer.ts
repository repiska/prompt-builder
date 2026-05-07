import { findBlock } from '../data/blocks'
import { renderBlock } from './render'
import type { BlockType, Recipe } from './types'

export interface ComposedPrompt {
  pass1: string
  pass2: string | null
  perBlock: { type: BlockType; id: string; rendered: string }[]
}

export function composePrompt(recipe: Recipe): ComposedPrompt {
  const baseBlock = findBlock('BASE', recipe.base)
  if (!baseBlock) {
    return { pass1: `[ERROR] base "${recipe.base}" not found`, pass2: null, perBlock: [] }
  }

  const perBlock: ComposedPrompt['perBlock'] = []
  const renderedByType: Partial<Record<BlockType, string>> = {}

  for (const ref of recipe.blocks) {
    const blk = findBlock(ref.type, ref.id)
    if (!blk) continue
    if (blk.stage === 'pass2') continue
    const text = renderBlock(blk, ref.slots ?? {})
    renderedByType[blk.type] = text
    perBlock.push({ type: blk.type, id: blk.id, rendered: text })
  }

  // Pass-1 = base template with pass-1 blocks rendered into placeholders + base slots.
  let pass1 = renderBlock(
    {
      ...baseBlock,
      template: baseBlock.template
        .replaceAll('{{POSE_BLOCK}}', renderedByType.POSE ?? '')
        .replaceAll('{{LOCATION_BLOCK}}', renderedByType.LOCATION ?? '')
        .replaceAll('{{CAMERA_BLOCK}}', renderedByType.CAMERA ?? '')
        .replaceAll('{{SCENARIO_BLOCK}}', renderedByType.UGC_SCENARIO ?? ''),
    },
    {},
  )
  pass1 = pass1.replace(/\n{3,}/g, '\n\n')

  // Pass-2 = grade block (single, if present).
  const gradeRef = recipe.blocks.find((b) => b.type === 'GRADE')
  let pass2: string | null = null
  if (gradeRef) {
    const blk = findBlock('GRADE', gradeRef.id)
    if (blk) {
      pass2 = renderBlock(blk, gradeRef.slots ?? {})
      perBlock.push({ type: blk.type, id: blk.id, rendered: pass2 })
    }
  }

  return { pass1, pass2, perBlock }
}
