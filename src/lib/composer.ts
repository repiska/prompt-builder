import { findBlock } from '../data/blocks'
import { renderBlock } from './render'
import type { Block, BlockType, Recipe } from './types'

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

function resolveSubject(recipe: Recipe, baseBlock: Block): { subject: string; subjectPronoun: string } {
  const baseRef = recipe.blocks.find((b) => b.type === 'BASE')
  const overrides = baseRef?.slots ?? {}
  const slotDef = baseBlock.slots.find((s) => s.id === 'subject_name')
  const baseDefault = (slotDef?.default as string | undefined) ?? ''
  const raw = overrides.subject_name ?? baseDefault
  const value = (raw ?? '').toString().trim()
  if (value) return { subject: value, subjectPronoun: 'she' }
  return { subject: 'the model', subjectPronoun: 'she' }
}

function applySubject(text: string, subject: string, pronoun: string): string {
  return text.replaceAll('{{subject}}', subject).replaceAll('{{subject_pronoun}}', pronoun)
}

function buildCapturePhrase(phoneModel: string, postedContext: string): string {
  if (!phoneModel) return ''
  if (postedContext) return `, captured on ${phoneModel} as ${postedContext}`
  return `, captured on ${phoneModel}`
}

function buildImperfectionConstraint(level: string): string {
  switch (level) {
    case 'clean':
      return 'Phone-photo character — found ambient light only, candid framing, natural skin texture; no professional polish.'
    case 'subtle':
      return 'Genuine phone-photo character throughout — found ambient light only, slightly off-center framing, a hint of motion blur where natural, natural skin texture with visible pores and faint asymmetry; no professional polish, no symmetric beauty-app retouch.'
    case 'candid messy':
      return 'Embrace authentic phone-snapshot imperfections: mildly off-center framing, slight motion blur in hands or hair, a stray hair on the shoulder, a faint screen glow on the hand if a phone is in frame, natural skin texture with visible pores, faint asymmetry, slightly uneven tone; the photo should look snapped without thinking, not curated.'
    default:
      return ''
  }
}

export function canComposeProse(recipe: Recipe): boolean {
  const baseBlock = findBlock('BASE', recipe.base)
  if (!baseBlock) return false
  if (!baseBlock.prose_aesthetic || !baseBlock.prose_reference_rule) return false
  for (const ref of recipe.blocks) {
    if (ref.type === 'BASE') continue
    const blk = findBlock(ref.type, ref.id)
    if (!blk) return false
    if (!blk.prose_template) return false
  }
  return true
}

export function composeAuto(recipe: Recipe): ComposedPrompt {
  return canComposeProse(recipe) ? composeProsePrompt(recipe) : composePrompt(recipe)
}

export function composeProsePrompt(recipe: Recipe): ComposedPrompt {
  const baseBlock = findBlock('BASE', recipe.base)
  if (!baseBlock) {
    return { pass1: `[ERROR] base "${recipe.base}" not found`, pass2: null, perBlock: [] }
  }

  const { subject, subjectPronoun } = resolveSubject(recipe, baseBlock)

  const perBlock: ComposedPrompt['perBlock'] = []
  const renderedByType: Partial<Record<BlockType, string>> = {}

  for (const ref of recipe.blocks) {
    if (ref.type === 'BASE') continue
    const blk = findBlock(ref.type, ref.id)
    if (!blk) continue
    const proseSrc = blk.prose_template
    if (!proseSrc) continue
    const rendered = applySubject(
      renderBlock({ ...blk, template: proseSrc }, ref.slots ?? {}),
      subject,
      subjectPronoun,
    )
    renderedByType[blk.type] = rendered
    perBlock.push({ type: blk.type, id: blk.id, rendered })
  }

  const baseRef = recipe.blocks.find((b) => b.type === 'BASE')
  const baseOverrides = baseRef?.slots ?? {}
  const baseSlotValue = (slotId: string): string => {
    if (slotId in baseOverrides) return String(baseOverrides[slotId] ?? '')
    const slot = baseBlock.slots.find((s) => s.id === slotId)
    return String(slot?.default ?? '')
  }

  const aspect = baseSlotValue('aspect_ratio')
  const renderingAnchor = baseSlotValue('rendering_anchor')
  const phoneModel = baseSlotValue('phone_model')
  const postedContext = baseSlotValue('posted_context')
  const imperfectionLevel = baseSlotValue('imperfection_level')
  const extraProps = baseSlotValue('extra_props').trim()
  const placeOverride = baseSlotValue('place_override').trim()

  const subjectIntro = applySubject(baseBlock.prose_subject_intro ?? '', subject, subjectPronoun)
  const aesthetic = baseBlock.prose_aesthetic ?? ''
  const integrationRule = applySubject(baseBlock.prose_integration_rule ?? '', subject, subjectPronoun)
  const referenceRule = applySubject(baseBlock.prose_reference_rule ?? '', subject, subjectPronoun)
  const capturePhrase = buildCapturePhrase(phoneModel, postedContext)
  const imperfectionConstraint = buildImperfectionConstraint(imperfectionLevel)

  const opening = aesthetic
    ? `Using the attached reference photographs of ${subject} wearing this outfit, generate one new ${renderingAnchor ? `${renderingAnchor}-style ` : ''}${aesthetic}${subjectIntro ? ` — ${subjectIntro}` : ''}${capturePhrase}. Preserve identity, garment, fabric and accessories exactly from the references; replace backgrounds and lighting with the scene described below.`
    : ''

  const sceneParagraph = [renderedByType.LOCATION, renderedByType.POSE, renderedByType.UGC_SCENARIO]
    .filter(Boolean)
    .join(' ')
  const sceneAdditions = [
    extraProps ? `Additional details visible in the scene: ${extraProps}.` : '',
    placeOverride ? `Relocate this scene to ${placeOverride}, keeping the pose, framing and energy as described above.` : '',
  ]
    .filter(Boolean)
    .join(' ')
  const cameraParagraph = renderedByType.CAMERA ?? ''
  const gradeParagraph = renderedByType.GRADE ?? ''

  const constraints = [integrationRule, referenceRule, imperfectionConstraint, aspect ? `Aspect ratio ${aspect}.` : '']
    .filter(Boolean)
    .join(' ')

  const pass1 = [opening, sceneParagraph, sceneAdditions, cameraParagraph, gradeParagraph, constraints]
    .filter(Boolean)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { pass1, pass2: null, perBlock }
}
