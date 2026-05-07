// Core types for the visual editor — see architecture spec v3.0.

export type BlockType =
  | 'BASE'
  | 'POSE'
  | 'LOCATION'
  | 'CAMERA'
  | 'GRADE'
  | 'UGC_SCENARIO'

export type SlotType =
  | 'enum'
  | 'number_slider'
  | 'number_input'
  | 'color_picker'
  | 'aperture'
  | 'focal_length'
  | 'angle_picker'
  | 'toggle'
  | 'text_short'
  | 'multiselect'
  | 'hidden'

export interface EnumOption {
  value: string
  label: string
  label_ru?: string
}

export interface BaseSlot {
  id: string
  label?: string
  label_ru?: string
  help?: string
  help_ru?: string
  default: unknown
  /** When set, the slot writes a derived string into this template field instead of (or in addition to) its own id. */
  computed_field?: string
  /** Map of slot value → derived string for the computed_field. Keys are the value coerced to string. */
  computed_map?: Record<string, string>
}

export interface EnumSlot extends BaseSlot {
  type: 'enum'
  options: EnumOption[]
  default: string
}

export interface NumberSliderSlot extends BaseSlot {
  type: 'number_slider'
  min: number
  max: number
  step: number
  unit?: string
  default: number
}

export interface NumberInputSlot extends BaseSlot {
  type: 'number_input'
  min?: number
  max?: number
  step?: number
  unit?: string
  default: number
}

export interface ColorRangeConstraint {
  min_lightness?: number
  max_lightness?: number
  saturation_max?: number
  note?: string
}

export interface ColorPickerSlot extends BaseSlot {
  type: 'color_picker'
  default: string
  range_constraint?: ColorRangeConstraint
  presets?: { value: string; label: string; label_ru?: string }[]
}

export interface ApertureSlot extends BaseSlot {
  type: 'aperture'
  options: number[]
  default: number
}

export interface FocalLengthSlot extends BaseSlot {
  type: 'focal_length'
  options: number[]
  default: number
  unit?: string
}

export interface AnglePickerSlot extends BaseSlot {
  type: 'angle_picker'
  min: number
  max: number
  step: number
  unit?: string
  default: number
}

export interface ToggleSlot extends BaseSlot {
  type: 'toggle'
  default: boolean
}

export interface TextShortSlot extends BaseSlot {
  type: 'text_short'
  default: string
  max_length?: number
}

export interface MultiselectSlot extends BaseSlot {
  type: 'multiselect'
  options: EnumOption[]
  default: string[]
  /** Joiner used when assembling the rendered string. Default: " " */
  join?: string
}

export interface HiddenSlot extends BaseSlot {
  type: 'hidden'
  default: string
}

export type Slot =
  | EnumSlot
  | NumberSliderSlot
  | NumberInputSlot
  | ColorPickerSlot
  | ApertureSlot
  | FocalLengthSlot
  | AnglePickerSlot
  | ToggleSlot
  | TextShortSlot
  | MultiselectSlot
  | HiddenSlot

export interface BlockTags {
  compatible_with?: string[]
  incompatible_with?: string[]
  requires_blocks?: BlockType[]
  requires_camera?: string[]
  recommends_camera?: string[]
  recommends_grade?: string[]
  /** Free-form metadata. */
  [key: string]: unknown
}

export interface Block {
  type: BlockType
  id: string
  name: string
  name_ru?: string
  description?: string
  description_ru?: string
  /** Whether this block is run at pass-2 (for GRADE). */
  stage?: 'pass1' | 'pass2'
  template: string
  prose_template?: string
  prose_subject_intro?: string
  prose_aesthetic?: string
  prose_integration_rule?: string
  prose_reference_rule?: string
  slots: Slot[]
  tags: BlockTags
}

export type SlotValues = Record<string, unknown>

export interface RecipeBlockRef {
  type: BlockType
  id: string
  /** Per-slot overrides keyed by slot id. */
  slots?: SlotValues
}

export interface Recipe {
  id: string
  name: string
  name_ru?: string
  description?: string
  description_ru?: string
  use_case?: 'UC1' | 'UC2' | 'UC3' | 'UC4'
  base: string
  blocks: RecipeBlockRef[]
  global_params?: Record<string, string>
  custom?: boolean
}

export type GenerationType = 'catalog' | 'lifestyle' | 'ugc'

export const BASE_FOR_GEN: Record<GenerationType, string> = {
  catalog: 'catalog_base',
  lifestyle: 'lifestyle_base',
  ugc: 'ugc_base',
}

export const REQUIRED_BLOCKS_BY_GEN: Record<GenerationType, BlockType[]> = {
  catalog: ['POSE', 'LOCATION', 'CAMERA'],
  lifestyle: ['POSE', 'LOCATION', 'CAMERA'],
  ugc: ['UGC_SCENARIO'],
}

export interface ValidationIssue {
  level: 'error' | 'warning' | 'info'
  message: string
  blockId?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO PIPELINE — Google Veo 3.1
// The photo pipeline above is unchanged. All video-specific types live below.
// ─────────────────────────────────────────────────────────────────────────────

/** Top-level discriminator used by the editor store and composer to switch pipelines. */
export type MediaType = 'photo' | 'video'

// ── Veo 3.1 hard parameters ──────────────────────────────────────────────────
// Exported as `as const` arrays so the UI can iterate them without duplicating
// the list. Derived literal types ensure exhaustiveness in switch statements.

export const VEO_DURATIONS = [4, 6, 8] as const
export type VeoDuration = typeof VEO_DURATIONS[number]

export const VEO_ASPECT_RATIOS = ['16:9', '9:16'] as const
export type VeoAspectRatio = typeof VEO_ASPECT_RATIOS[number]

/** Veo 3.1 output resolution tiers. '4K' is only available on generate tier. */
export const VEO_RESOLUTIONS = ['720p', '1080p', '4K'] as const
export type VeoResolution = typeof VEO_RESOLUTIONS[number]

/** Veo API tier — affects latency, quality, and cost. */
export const VEO_TIERS = ['generate', 'fast', 'lite'] as const
export type VeoTier = typeof VEO_TIERS[number]

export const VEO_CAMERA_MOVEMENTS = [
  'static', 'pan', 'tilt', 'dolly', 'truck', 'pedestal',
  'zoom', 'crane', 'aerial', 'handheld', 'whip', 'arc'
] as const
export type VeoCameraMovement = typeof VEO_CAMERA_MOVEMENTS[number]

// ── Reference images (Ingredients to Video) ──────────────────────────────────
// Veo 3.1 accepts up to 3 reference images; each must declare its role so the
// composer can emit the correct framing sentence for the model.

export type ReferenceRole = 'model' | 'garment' | 'location'

export interface ReferenceImageDeclaration {
  role: ReferenceRole
  /** Human-readable description of what the reference provides, e.g. "the woman in the reference image". */
  description: string
  description_ru?: string
}

// ── Audio sub-types ───────────────────────────────────────────────────────────
// Three sub-types matching Veo's prompt syntax: dialogue, SFX, ambient.

export interface AudioDialogue {
  /** Optional id — present when dialogue is preset/reusable; absent for one-off per-clip lines. */
  id?: string
  /** Who is speaking — "the model", "voiceover", "off-screen friend", etc. */
  speaker: string
  speaker_ru?: string
  /** Verbatim quoted line injected as spoken dialogue. Keep ≤ 20 words per Veo guidance. */
  line: string
  line_ru?: string
}

export interface AudioSFX {
  id: string                  // e.g. 'fabric_rustle', 'footsteps_wood'
  label: string
  label_ru?: string
  /** Text injected after the "SFX:" prefix in the composer output. */
  prose: string
}

export interface AudioAmbient {
  id: string
  label: string
  label_ru?: string
  /** Text injected after the "Ambient noise:" prefix in the composer output. */
  prose: string
}

// ── Video block interfaces ────────────────────────────────────────────────────
// Mirrors the photo Block discriminated union. Uses `kind` (not `type`) as the
// discriminant so there is zero structural collision with the photo Block union.

export interface VideoBaseBlock {
  kind: 'VIDEO_BASE'
  id: string
  name: string
  name_ru?: string
  description?: string
  description_ru?: string
  /** Maps to the three photo-pipeline generation modes for UX consistency. */
  variant: 'catalog' | 'lifestyle' | 'ugc'
  /** Preset Veo hard-parameter defaults — can be overridden per VideoRecipe. */
  defaultDuration: VeoDuration
  defaultAspectRatio: VeoAspectRatio
  defaultResolution: VeoResolution
  defaultTier: VeoTier
  /** User-fillable parameters, same Slot union as photo blocks. */
  slots: Slot[]
  prose_template?: string
  /** Instructs the composer how to frame the reference-image role declarations. */
  prose_reference_rule?: string
  /** Opening sentence describing the subject before motion/camera details are added. */
  prose_subject_intro?: string
  /** Optional scene-context sentence used in the deterministic prose path (5-section order, Context slot). */
  prose_context?: string
}

export interface MotionBlock {
  kind: 'MOTION'
  id: string                  // e.g. 'M1', 'M2'
  name: string
  name_ru?: string
  /** True if the clip is designed to loop seamlessly (e.g. for PDP tile autoplay). */
  loopable?: boolean
  prose_template?: string
  /** Optional tweakable params, e.g. a "speed" slider for slow-motion variants. */
  slots?: Slot[]
}

export interface CameraMoveBlock {
  kind: 'CAMERA_MOVE'
  id: string                  // e.g. 'CM1', 'CM2'
  /** Human-readable name, e.g. "Slow dolly in", "Handheld walk". */
  name: string
  name_ru?: string
  /** The exact Veo camera-movement keyword the composer emits. */
  veo_movement: VeoCameraMovement
  prose_template?: string
  slots?: Slot[]
}

export interface GradeVideoBlock {
  // Kept separate from the photo GRADE block so video grades can describe
  // motion-aware lighting evolution (e.g. "golden hour shifts to dusk over the clip").
  kind: 'GRADE_VIDEO'
  id: string
  name: string
  name_ru?: string
  prose_template?: string
  slots?: Slot[]
}

export interface AudioPresetBlock {
  kind: 'AUDIO_PRESET'
  id: string
  /** Preset name shown in the picker, e.g. "Café murmur + fabric rustle". */
  name: string
  name_ru?: string
  ambient?: AudioAmbient
  sfx: AudioSFX[]
  /** Hint shown in the UI when the user fills in per-clip dialogue. */
  dialogue_hint?: string
  dialogue_hint_ru?: string
}

/** Discriminated union of all video-pipeline block types. */
export type VideoBlock =
  | VideoBaseBlock
  | MotionBlock
  | CameraMoveBlock
  | GradeVideoBlock
  | AudioPresetBlock

// ── Video recipe ──────────────────────────────────────────────────────────────
// Mirrors the photo Recipe shape. Block references are flat id strings (not
// RecipeBlockRef objects) because video blocks don't share the photo tag/compat
// system — they use simpler direct selection.

export interface VideoRecipe {
  id: string
  name: string
  name_ru?: string
  description?: string
  description_ru?: string
  baseId: string              // VideoBaseBlock id
  motionId?: string           // MotionBlock id
  cameraMoveId?: string       // CameraMoveBlock id
  gradeId?: string            // GradeVideoBlock id
  audioPresetId?: string      // AudioPresetBlock id
  // Hard parameter overrides — fall back to VideoBaseBlock defaults if absent
  duration?: VeoDuration
  aspectRatio?: VeoAspectRatio
  resolution?: VeoResolution
  tier?: VeoTier
  /**
   * Absent = text-only generation. Present = "Ingredients to Video" mode
   * (Veo 3.1 supports up to 3 reference images, ≥1 required when in this mode).
   */
  references?: ReferenceImageDeclaration[]
  /** Reuse the existing SlotValues alias for per-recipe slot overrides. */
  slotValues?: SlotValues
  /** Per-recipe dialogue; not part of the audio preset because it's clip-specific. */
  dialogue?: AudioDialogue
  /** Unwanted elements expressed positively (Veo rejects "no X" phrasing). */
  negativePrompt?: string
}

// ── Video editor slice (type-only) ────────────────────────────────────────────
// Future Zustand slice shape. Defined here so the composer and store can import
// a single source of truth. Do NOT add this to the store yet — that is Task B.

export interface VideoEditorSlice {
  videoBaseId: string | null
  videoMotionId: string | null
  videoCameraMoveId: string | null
  videoGradeId: string | null
  videoAudioPresetId: string | null
  videoDuration: VeoDuration
  videoAspectRatio: VeoAspectRatio
  videoResolution: VeoResolution
  videoTier: VeoTier
  videoReferences: ReferenceImageDeclaration[]
  videoDialogue: AudioDialogue | null
  videoNegativePrompt: string
  videoSlotValues: SlotValues
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO PROJECT — multi-clip stitched social ad (Block 3)
// Each project composes multiple Veo 3.1 clips sharing identity, references,
// and a continuity lock so the output can be stitched into a 15–60s Reel/TikTok.
// ─────────────────────────────────────────────────────────────────────────────

/** Narrative beat role each clip plays inside the stitched output. */
export const PROJECT_CLIP_ROLES = ['hook', 'demo', 'reaction', 'cta', 'b_roll'] as const
export type ProjectClipRole = typeof PROJECT_CLIP_ROLES[number]

/** How audio is handled at the project level. */
export const PROJECT_AUDIO_STRATEGIES = ['native_per_clip', 'silent_for_voiceover_overlay'] as const
export type ProjectAudioStrategy = typeof PROJECT_AUDIO_STRATEGIES[number]

// ── ElevenLabs voiceover ──────────────────────────────────────────────────────

/** Known ElevenLabs Russian-language voice presets. */
export const ELEVENLABS_RU_VOICES = ['ivan', 'mariia', 'ekaterina', 'sergey', 'marina'] as const
export type ElevenLabsRuVoice = typeof ELEVENLABS_RU_VOICES[number]

export interface VoiceoverScript {
  /** ISO 639-1 language code; only 'en' / 'ru' are validated by the composer for now. */
  lang: 'en' | 'ru'
  /** The text the user will paste into ElevenLabs / equivalent TTS. */
  text: string
  /** Optional preset voice id; for RU this is a known ElevenLabs voice. */
  suggestedVoice?: ElevenLabsRuVoice | 'default'
}

// ── Continuity lock ───────────────────────────────────────────────────────────

/** Fields injected verbatim into every clip prompt to keep the stitched cut coherent. */
export interface ProjectContinuityLock {
  /** Wardrobe descriptor injected into every clip prompt verbatim. */
  wardrobe?: string
  wardrobe_ru?: string
  /** Lens / focal-length descriptor (e.g. "35mm equivalent"). */
  lens?: string
  lens_ru?: string
  /** Color-grade descriptor (e.g. "warm filmic, soft contrast"). */
  grade?: string
  grade_ru?: string
  /** Lighting descriptor (e.g. "soft window light, no studio fixtures"). */
  lighting?: string
  lighting_ru?: string
  /** Time-of-day (e.g. "late afternoon golden hour"). */
  timeOfDay?: string
  timeOfDay_ru?: string
}

// ── Project clip ──────────────────────────────────────────────────────────────

/** One clip slot inside a VideoProject — recipe reference + role + per-clip overrides. */
export interface VideoProjectClip {
  /** Stable id for the clip within the project (e.g. UUID or "c1", "c2"). */
  id: string
  /** Recipe id from VIDEO_RECIPES or UGC_RECIPES. */
  recipeId: string
  /** Beat role this clip plays in the stitched output. */
  clipRole: ProjectClipRole
  /** Override the recipe's duration (still subject to Block 1 hard rules). */
  durationOverride?: VeoDuration
  /** Override the recipe's dialogue (or null to suppress dialogue for this clip). */
  dialogueOverride?: AudioDialogue | null
  /** Optional one-off note for the user / future context. */
  note?: string
  note_ru?: string
}

// ── Project ───────────────────────────────────────────────────────────────────

export interface VideoProject {
  id: string
  name: string
  name_ru?: string
  description?: string
  description_ru?: string
  /** References inherited by every clip in this project (Veo Ingredients-to-Video).
   *  Up to 3 entries. Empty = text-only mode. */
  sharedReferences: ReferenceImageDeclaration[]
  /** Identity descriptor sentence repeated verbatim in every clip's prompt to anchor the subject.
   *  E.g. "The same female protagonist, early 30s, shoulder-length black hair, beige trench coat." */
  sharedIdentityDescriptor?: string
  sharedIdentityDescriptor_ru?: string
  /** Optional fixed seed shared across all clips (Veo accepts a seed param). */
  sharedSeed?: number
  /** Continuity-lock fields injected into every clip prompt. */
  continuityLock: ProjectContinuityLock
  /** How audio is handled across clips. */
  audioStrategy: ProjectAudioStrategy
  /** Optional voiceover script — used when audioStrategy is silent_for_voiceover_overlay. */
  voiceoverScript?: VoiceoverScript
  /** Ordered list of clips that make up the project. */
  clips: VideoProjectClip[]
  /** Hard parameter defaults for new clips added to this project. */
  defaultAspectRatio: VeoAspectRatio
  defaultResolution: VeoResolution
  defaultTier: VeoTier
}
