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
