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
  VideoProject,
  ProjectClipRole,
  VoiceoverScript,
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
  /**
   * Present only when the dialogue contains Cyrillic characters.
   * Signals that the clip should be generated silent and the line
   * overlaid via ElevenLabs voiceover (Veo 3.1 does not reliably
   * produce Russian lip-sync).
   */
  voiceoverHint?: VoiceoverScript
}

/** Returns true if any character in the string is in the Cyrillic Unicode range. */
export function hasCyrillic(s: string | undefined | null): boolean {
  if (!s) return false
  return /[Ѐ-ӿ]/.test(s)
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

const VALID_ASPECT_RATIOS: readonly VeoAspectRatio[] = ['16:9', '9:16']

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
    aspectRatio: inputAspectRatio,
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

  // ── Rule 6 — Aspect-ratio enum guard ──────────────────────────────────────
  let aspectRatio: VeoAspectRatio
  if (VALID_ASPECT_RATIOS.includes(inputAspectRatio)) {
    aspectRatio = inputAspectRatio as VeoAspectRatio
  } else {
    aspectRatio = '9:16'
    warnings.push('Unsupported aspect ratio coerced to 9:16.')
  }

  // ── Rule 2 — Coerce tier: disable Lite when references are present ─────────
  let effectiveTier: VeoTier = tier
  if (tier === 'lite' && effectiveRefs.length > 0) {
    effectiveTier = 'fast'
    warnings.push('Tier auto-upgraded to Fast — Veo 3.1 Lite does not support reference images.')
  }

  // ── Rule 3 — Coerce resolution: disable 4K when not on generate tier ──────
  let effectiveResolution: VeoResolution = resolution
  if (resolution === '4K' && effectiveTier !== 'generate') {
    effectiveResolution = '1080p'
    warnings.push('Resolution auto-downgraded to 1080p — 4K requires Generate tier.')
  }

  // ── Rule 1 — Coerce duration: force 8s when references are present ────────
  let effectiveDuration: VeoDuration = duration
  let durationCoercedByRule1 = false
  if (effectiveRefs.length > 0 && duration !== 8) {
    effectiveDuration = 8
    durationCoercedByRule1 = true
    warnings.push('Duration auto-set to 8s — Veo 3.1 reference images require 8s output.')
  }

  // ── Rule 4 — Coerce duration: force 8s for 1080p/4K (if not already set) ──
  if (effectiveResolution !== '720p' && effectiveDuration !== 8 && !durationCoercedByRule1) {
    effectiveDuration = 8
    warnings.push('Duration auto-set to 8s — 1080p/4K require 8s on Veo 3.1.')
  }

  // ── Rule 5 — Validate reference descriptions ──────────────────────────────
  for (let i = 0; i < effectiveRefs.length; i++) {
    const ref = effectiveRefs[i]
    if (!ref.description || !ref.description.trim()) {
      warnings.push(
        `Reference image #${i + 1} (role: ${ref.role}) has no description — Veo will infer the subject which reduces consistency.`,
      )
    }
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
  // Only include refs that have non-empty descriptions in the prose framing sentence.
  if (effectiveRefs.length > 0) {
    const descList = effectiveRefs
      .filter((r) => r.description && r.description.trim())
      .map((r) => r.description)
    if (descList.length > 0) {
      const roleList = descList.join(', ')
      sentences.push(
        ensurePeriod(
          `Use the provided reference images: ${roleList}. Preserve their identity and appearance throughout the clip`,
        ),
      )
    } else {
      // All refs had empty descriptions — still mention that references are present
      sentences.push(
        ensurePeriod(
          'Use the provided reference images. Preserve their identity and appearance throughout the clip',
        ),
      )
    }
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
  const prompt = sentences
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

  // ── Cyrillic dialogue detection → voiceover hint ──────────────────────────
  let voiceoverHint: VoiceoverScript | undefined
  if (dialogue && hasCyrillic(dialogue.line)) {
    warnings.push(
      "Dialogue contains Cyrillic characters — Veo 3.1 may not produce reliable Russian lip-sync. Consider 'silent + ElevenLabs voiceover' workflow.",
    )
    voiceoverHint = {
      lang: 'ru',
      text: dialogue.line,
      suggestedVoice: 'ivan',
    }
  }

  return {
    prompt,
    negativePrompt: finalNegative,
    apiParams: {
      durationSeconds: effectiveDuration,
      aspectRatio,
      resolution: effectiveResolution,
      tier: effectiveTier,
      referenceImagesCount: effectiveRefs.length,
    },
    warnings,
    voiceoverHint,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// composeVideoProject
// ─────────────────────────────────────────────────────────────────────────────

export interface ComposeProjectInput {
  project: VideoProject
  /** Resolved blocks per clip — caller does the lookup and passes them in.
   *  The map key is the clip id; value is everything composeVideoPrompt would normally need
   *  for that clip, MINUS the project-shared bits (references, identity, continuity, dialogue when silent). */
  resolvedClips: Record<string, {
    base: VideoBaseBlock
    motion?: MotionBlock | null
    cameraMove?: CameraMoveBlock | null
    grade?: GradeVideoBlock | null
    audioPreset?: AudioPresetBlock | null
    duration: VeoDuration
    aspectRatio: VeoAspectRatio
    resolution: VeoResolution
    tier: VeoTier
    slotValues: SlotValues
    negativePrompt?: string
    /** Recipe's baseline dialogue. Used when audioStrategy is 'native_per_clip' and the clip has no dialogueOverride. */
    dialogue?: AudioDialogue | null
  }>
}

export interface ComposeProjectOutput {
  /** One entry per clip, in order. */
  clipPrompts: Array<{
    clipId: string
    clipRole: ProjectClipRole
    prompt: string
    negativePrompt: string
    apiParams: ComposeVideoOutput['apiParams']
    warnings: string[]
    /** Only set when this clip's dialogue had Cyrillic AND audioStrategy === 'native_per_clip'. */
    voiceoverHint?: VoiceoverScript
  }>
  /** Continuity checklist — what the user should verify before stitching. */
  continuityChecklist: string[]
  /** Voiceover script if project.audioStrategy === 'silent_for_voiceover_overlay'; else undefined. */
  voiceoverScript?: VoiceoverScript
  /** Top-level project warnings (not specific to a clip). */
  projectWarnings: string[]
}

/** Build a continuity sentence from the lock fields. Returns empty string if all fields are empty. */
function buildContinuitySentence(lock: VideoProject['continuityLock']): string {
  const parts: string[] = []
  if (lock.wardrobe) parts.push(`wardrobe — ${lock.wardrobe}`)
  if (lock.lens) parts.push(`lens — ${lock.lens}`)
  if (lock.grade) parts.push(`grade — ${lock.grade}`)
  if (lock.lighting) parts.push(`lighting — ${lock.lighting}`)
  if (lock.timeOfDay) parts.push(`time of day — ${lock.timeOfDay}`)
  if (parts.length === 0) return ''
  return `Continuity: ${parts.join('; ')}.`
}

export function composeVideoProject(input: ComposeProjectInput): ComposeProjectOutput {
  const { project, resolvedClips } = input
  const projectWarnings: string[] = []

  // ── Project-level warnings ─────────────────────────────────────────────────
  if (project.clips.length === 0) {
    projectWarnings.push('Project has no clips.')
  }
  if (project.clips.length > 8) {
    projectWarnings.push(
      'Project has more than 8 clips — consider splitting into separate projects to avoid review fatigue.',
    )
  }
  if (project.audioStrategy === 'native_per_clip' && project.clips.length > 1) {
    projectWarnings.push(
      "Native audio across multiple clips may produce jarring transitions per Veo 3.1 docs — consider 'silent_for_voiceover_overlay'.",
    )
  }
  if (project.audioStrategy === 'silent_for_voiceover_overlay' && !project.voiceoverScript) {
    projectWarnings.push(
      'Voiceover-overlay strategy selected but no voiceoverScript provided.',
    )
  }
  if (project.sharedReferences.length > 3) {
    projectWarnings.push(
      'Veo 3.1 accepts at most 3 reference images; only the first 3 will be used by every clip.',
    )
  }

  // Detect duplicate clipRole values
  const roleCount = new Map<string, number>()
  for (const clip of project.clips) {
    roleCount.set(clip.clipRole, (roleCount.get(clip.clipRole) ?? 0) + 1)
  }
  const warnedRoles = new Set<string>()
  for (const clip of project.clips) {
    const count = roleCount.get(clip.clipRole) ?? 0
    if (count > 1 && !warnedRoles.has(clip.clipRole)) {
      projectWarnings.push(
        `Two or more clips share the role '${clip.clipRole}' — verify this is intentional.`,
      )
      warnedRoles.add(clip.clipRole)
    }
  }

  // ── Pre-build continuity sentence (shared across all clips) ───────────────
  const continuitySentence = buildContinuitySentence(project.continuityLock)

  // ── Per-clip composition ──────────────────────────────────────────────────
  const clipPrompts: ComposeProjectOutput['clipPrompts'] = []

  for (const clip of project.clips) {
    const resolvedClip = resolvedClips[clip.id]
    if (!resolvedClip) {
      // If caller omitted this clip's resolved data, emit an error entry and continue
      clipPrompts.push({
        clipId: clip.id,
        clipRole: clip.clipRole,
        prompt: `[ERROR] No resolved data for clip id "${clip.id}".`,
        negativePrompt: '',
        apiParams: {
          durationSeconds: 8,
          aspectRatio: project.defaultAspectRatio,
          resolution: project.defaultResolution,
          tier: project.defaultTier,
          referenceImagesCount: 0,
        },
        warnings: [`Resolved data missing for clip "${clip.id}".`],
      })
      continue
    }

    // 1. Enrich base with identity descriptor.
    // Mutually exclusive: inject into prose_template when it is set (spine path),
    // otherwise inject into prose_subject_intro (deterministic 5-section path).
    const enrichedBase: VideoBaseBlock = {
      ...resolvedClip.base,
      prose_subject_intro: !resolvedClip.base.prose_template && project.sharedIdentityDescriptor
        ? `${project.sharedIdentityDescriptor} ${resolvedClip.base.prose_subject_intro ?? ''}`.trim()
        : resolvedClip.base.prose_subject_intro,
      prose_template: resolvedClip.base.prose_template && project.sharedIdentityDescriptor
        ? `${project.sharedIdentityDescriptor} ${resolvedClip.base.prose_template}`
        : resolvedClip.base.prose_template,
    }

    // 2. Inject continuity sentence.
    // Deterministic path: append to prose_context.
    // Spine path: append to prose_template so it survives the prose_template branch.
    let enrichedProseContext: string | undefined = enrichedBase.prose_context
    if (continuitySentence) {
      enrichedProseContext = enrichedBase.prose_context
        ? `${enrichedBase.prose_context} ${continuitySentence}`
        : continuitySentence
    }
    const enrichedProseTemplate =
      continuitySentence && enrichedBase.prose_template
        ? `${enrichedBase.prose_template} ${continuitySentence}`
        : enrichedBase.prose_template
    const baseWithContinuity: VideoBaseBlock = {
      ...enrichedBase,
      prose_context: enrichedProseContext,
      prose_template: enrichedProseTemplate,
    }

    // 3. Resolve dialogue for this clip
    let effectiveDialogue: AudioDialogue | null
    if (project.audioStrategy === 'silent_for_voiceover_overlay') {
      effectiveDialogue = null
    } else if (clip.dialogueOverride !== undefined) {
      effectiveDialogue = clip.dialogueOverride ?? null
    } else {
      effectiveDialogue = resolvedClip.dialogue ?? null
    }

    // 4. Resolve duration
    const effectiveDuration: VeoDuration = clip.durationOverride ?? resolvedClip.duration

    // 5. Call composeVideoPrompt
    const result = composeVideoPrompt({
      base: baseWithContinuity,
      motion: resolvedClip.motion ?? null,
      cameraMove: resolvedClip.cameraMove ?? null,
      grade: resolvedClip.grade ?? null,
      audioPreset: resolvedClip.audioPreset ?? null,
      duration: effectiveDuration,
      aspectRatio: resolvedClip.aspectRatio,
      resolution: resolvedClip.resolution,
      tier: resolvedClip.tier,
      references: project.sharedReferences,
      dialogue: effectiveDialogue,
      negativePrompt: resolvedClip.negativePrompt,
      slotValues: resolvedClip.slotValues,
    })

    // Propagate voiceover hint only for native_per_clip — in silent mode the
    // project-level voiceoverScript already covers the overlay workflow.
    const clipVoiceoverHint =
      project.audioStrategy === 'native_per_clip' ? result.voiceoverHint : undefined

    clipPrompts.push({
      clipId: clip.id,
      clipRole: clip.clipRole,
      prompt: result.prompt,
      negativePrompt: result.negativePrompt,
      apiParams: result.apiParams,
      warnings: result.warnings,
      voiceoverHint: clipVoiceoverHint,
    })
  }

  // ── Continuity checklist ───────────────────────────────────────────────────
  const continuityChecklist: string[] = []
  continuityChecklist.push('Subject identity matches across all clips.')
  if (project.sharedReferences.length > 0) {
    continuityChecklist.push(
      `All clips referenced the same ${project.sharedReferences.length} images.`,
    )
  }
  if (project.sharedSeed !== undefined) {
    continuityChecklist.push(`Seed ${project.sharedSeed} used for all generations.`)
  }
  const lock = project.continuityLock
  if (lock.wardrobe) continuityChecklist.push(`Wardrobe consistent: ${lock.wardrobe}`)
  if (lock.lens) continuityChecklist.push(`Lens consistent: ${lock.lens}`)
  if (lock.grade) continuityChecklist.push(`Grade consistent: ${lock.grade}`)
  if (lock.lighting) continuityChecklist.push(`Lighting consistent: ${lock.lighting}`)
  if (lock.timeOfDay) continuityChecklist.push(`Time of day consistent: ${lock.timeOfDay}`)
  if (project.audioStrategy === 'silent_for_voiceover_overlay') {
    continuityChecklist.push('Voiceover overlaid in CapCut/ElevenLabs after generation.')
  }

  // ── Voiceover script ───────────────────────────────────────────────────────
  const voiceoverScript =
    project.audioStrategy === 'silent_for_voiceover_overlay'
      ? project.voiceoverScript
      : undefined

  return {
    clipPrompts,
    continuityChecklist,
    voiceoverScript,
    projectWarnings,
  }
}
