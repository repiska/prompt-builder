import { findBlock } from '../data/blocks'
import { renderBlock } from './render'
import type {
  Block,
  BlockType,
  Recipe,
  SlotValues,
  VideoBaseBlock,
  MotionBlock,
  CameraMoveBlock,
  GradeVideoBlock,
  AudioPresetBlock,
  ReferenceImageDeclaration,
  AudioDialogue,
  VeoDuration,
  VeoAspectRatio,
  VeoResolution,
  VeoTier,
} from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Video composer types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input to composeVideoPrompt. All output is English-only (Veo prefers English).
 * Re-introduce a `lang` field here when Russian preview support is needed.
 */
export interface ComposeVideoInput {
  base: VideoBaseBlock
  motion?: MotionBlock | null
  cameraMove?: CameraMoveBlock | null
  grade?: GradeVideoBlock | null
  audioPreset?: AudioPresetBlock | null
  duration: VeoDuration
  aspectRatio: VeoAspectRatio
  resolution: VeoResolution
  tier: VeoTier
  references: ReferenceImageDeclaration[]
  dialogue: AudioDialogue | null
  negativePrompt?: string
  slotValues: SlotValues
}

export interface ComposeVideoOutput {
  prompt: string
  negativePrompt: string
  apiParams: {
    durationSeconds: VeoDuration
    aspectRatio: VeoAspectRatio
    resolution: VeoResolution
    tier: VeoTier
    referenceImagesCount: number
  }
  warnings: string[]
}

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

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers shared by the video composer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple {{slot_id}} substitution for prose_template strings that don't need
 * type-aware rendering (no computed_field, no multiselect coercion).
 * Unknown placeholders are silently removed, matching renderBlock behaviour.
 */
function substituteSlots(template: string, slots: SlotValues): string {
  let out = template
  for (const [key, value] of Object.entries(slots)) {
    out = out.replaceAll(`{{${key}}}`, value == null ? '' : String(value))
  }
  // Remove any remaining unresolved placeholders
  out = out.replace(/\{\{[a-zA-Z_]+\}\}/g, '').replace(/[ \t]{2,}/g, ' ')
  return out.trim()
}

/** Ensure a sentence ends with exactly one period. */
function ensurePeriod(s: string): string {
  const t = s.trim()
  if (!t) return ''
  return t.endsWith('.') ? t : `${t}.`
}

/** Count words in a string. */
function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

/** Resolve a video block's display text: prose_template substituted with slot values, or fallback to name. */
function resolveBlockText(block: { prose_template?: string; name: string }, slotValues: SlotValues): string {
  return block.prose_template
    ? substituteSlots(block.prose_template, slotValues)
    : block.name
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline default negative prompt fragments (descriptive, never "no X")
// ─────────────────────────────────────────────────────────────────────────────

const VEO_DEFAULT_NEGATIVE =
  'morphing face, melting eyes, extra fingers, double heads, disjointed limbs, color bleeding, warped text, drifting camera, motion blur artifacts, oversaturated, plastic skin'

const REFERENCE_ORDINALS = ['first', 'second', 'third'] as const

// ─────────────────────────────────────────────────────────────────────────────
// composeVideoPrompt
// ─────────────────────────────────────────────────────────────────────────────

export function composeVideoPrompt(input: ComposeVideoInput): ComposeVideoOutput {
  const {
    base,
    motion,
    cameraMove,
    grade,
    audioPreset,
    duration,
    aspectRatio,
    resolution,
    tier,
    references,
    dialogue,
    negativePrompt,
    slotValues,
  } = input

  const warnings: string[] = []

  // ── Reference image cap ────────────────────────────────────────────────────
  const effectiveRefs = references.length > 3 ? references.slice(0, 3) : references
  if (references.length > 3) {
    warnings.push(
      'Veo 3.1 accepts at most 3 reference images; only the first 3 will be used.',
    )
  }

  // ── Tier compatibility checks ──────────────────────────────────────────────
  if (tier === 'lite' && effectiveRefs.length > 0) {
    warnings.push(
      "Veo 3.1 Lite does not support reference images; use 'generate' or 'fast' for Ingredients-to-Video.",
    )
  }
  if (resolution === '4K' && tier !== 'generate') {
    warnings.push("4K is only available on the 'generate' tier.")
  }
  if (resolution !== '720p' && duration !== 8) {
    warnings.push('1080p and 4K require duration of 8 seconds on Veo 3.1.')
  }
  if (effectiveRefs.length > 0 && duration !== 8) {
    warnings.push('Reference images require duration of 8 seconds on Veo 3.1.')
  }

  // ── Dialogue word count guard ──────────────────────────────────────────────
  if (dialogue && wordCount(dialogue.line) > 20) {
    warnings.push(
      "Dialogue line exceeds Veo's recommended ≤20 words for an 8s clip; delivery may be sped up.",
    )
  }

  // ── Sentence assembly ─────────────────────────────────────────────────────
  const sentences: string[] = []

  // 0. Reference role declarations (prepended before the 5-section prose)
  if (effectiveRefs.length > 0) {
    const roleList = effectiveRefs
      .map((r, i) => r.description || `the subject from the ${REFERENCE_ORDINALS[i]} reference image`)
      .join(', ')
    sentences.push(
      ensurePeriod(
        `Use the provided reference images: ${roleList}. Preserve their identity and appearance throughout the clip`,
      ),
    )
  }

  // ── Determine prose body strategy ─────────────────────────────────────────
  // If base has a prose_template, use it as the spine (slot-substituted),
  // then layer cinematography and audio on top.
  // Otherwise build deterministically from individual block templates.

  if (base.prose_template) {
    // Spine-based path
    const spine = ensurePeriod(substituteSlots(base.prose_template, slotValues))
    if (spine) sentences.push(spine)

    // Cinematography overlay: camera movement + any camera prose
    const movementLabel = cameraMove ? resolveBlockText(cameraMove, slotValues) : 'Static shot'
    if (movementLabel) sentences.push(ensurePeriod(movementLabel))

    // Grade / style ambiance overlay
    const gradeText = grade ? resolveBlockText(grade, slotValues) : 'Natural lighting'
    if (gradeText) sentences.push(ensurePeriod(gradeText))

    // Append motion block prose if provided.
    if (motion) {
      const motionText = resolveBlockText(motion, slotValues)
      if (motionText) sentences.push(ensurePeriod(motionText))
    }
  } else {
    // Deterministic build path — 5-section ordering:
    // 1 Cinematography, 2 Subject, 3 Action, 4 Context, 5 Style & Ambiance

    // 1. Cinematography — camera angle + movement + shot type
    const movementLabel = cameraMove ? resolveBlockText(cameraMove, slotValues) : 'Static shot'
    sentences.push(ensurePeriod(movementLabel))

    // 2. Subject — from base subject intro or base name
    const subjectText = base.prose_subject_intro
      ? substituteSlots(base.prose_subject_intro, slotValues)
      : base.name
    if (subjectText) sentences.push(ensurePeriod(subjectText))

    // 3. Action — verb-led, from motion block
    if (motion) {
      const motionText = resolveBlockText(motion, slotValues)
      if (motionText) sentences.push(ensurePeriod(motionText))
    }
    // (If no motion block, action sentence is omitted per spec)

    // 4. Context — environment/time of day; sourced from prose_context when present.
    // If absent, this section is omitted entirely (the 5-section formula is a guideline).
    if (base.prose_context) {
      const contextText = substituteSlots(base.prose_context, slotValues)
      if (contextText) sentences.push(ensurePeriod(contextText))
    }

    // 5. Style & Ambiance — grade block
    const gradeText = grade ? resolveBlockText(grade, slotValues) : 'Natural lighting'
    if (gradeText) sentences.push(ensurePeriod(gradeText))
  }

  // ── Audio section ─────────────────────────────────────────────────────────
  // Order: Dialogue → SFX → Ambient
  // If no audio at all, append default ambient.

  if (dialogue) {
    const speaker =
      dialogue.speaker.charAt(0).toUpperCase() + dialogue.speaker.slice(1)
    sentences.push(`${speaker} says, "${dialogue.line}".`)
  }

  if (audioPreset) {
    for (const sfx of audioPreset.sfx) {
      sentences.push(ensurePeriod(`SFX: ${sfx.prose}`))
    }
    if (audioPreset.ambient) {
      sentences.push(ensurePeriod(`Ambient noise: ${audioPreset.ambient.prose}`))
    }
  }

  if (audioPreset == null && dialogue == null) {
    sentences.push('Ambient noise: subtle room tone.')
  }

  // ── Assemble final prompt ──────────────────────────────────────────────────
  // Join with single spaces, strip duplicate periods (e.g. "sentence.. Next")
  let prompt = sentences
    .filter(Boolean)
    .join(' ')
    .replace(/\.\.+/g, '.')
    .replace(/\. \./g, '.')
    .trim()

  // Soft cap: ~4 chars/token, warn if > 4000 chars (~1000 tokens)
  if (prompt.length > 4000) {
    warnings.push(
      `Prompt exceeds ~1000 tokens (${prompt.length} chars); consider trimming for best Veo results.`,
    )
  }

  // ── Negative prompt ────────────────────────────────────────────────────────
  const negParts = [negativePrompt?.trim(), VEO_DEFAULT_NEGATIVE].filter(Boolean)
  const finalNegative = negParts.join(', ')

  return {
    prompt,
    negativePrompt: finalNegative,
    apiParams: {
      durationSeconds: duration,
      aspectRatio,
      resolution,
      tier,
      referenceImagesCount: effectiveRefs.length,
    },
    warnings,
  }
}
