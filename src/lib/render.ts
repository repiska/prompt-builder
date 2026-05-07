import type { Block, Slot, SlotValues } from './types'

export function defaultSlotValues(block: Block): SlotValues {
  const out: SlotValues = {}
  for (const slot of block.slots) {
    out[slot.id] = slot.default
  }
  return out
}

function lookupComputedString(slot: Slot, value: unknown): string {
  if (slot.computed_map) {
    const key = String(value)
    if (key in slot.computed_map) return slot.computed_map[key]
    if (slot.type === 'number_slider' || slot.type === 'aperture' || slot.type === 'focal_length' || slot.type === 'number_input') {
      const n = Number(value)
      const numericKeys = Object.keys(slot.computed_map)
        .map((k) => ({ k, n: Number(k) }))
        .filter((p) => Number.isFinite(p.n))
        .sort((a, b) => a.n - b.n)
      for (const { k, n: nk } of numericKeys) {
        if (n <= nk) return slot.computed_map[k]
      }
      if (numericKeys.length) return slot.computed_map[numericKeys[numericKeys.length - 1].k]
    }
  }
  return String(value)
}

function angleToText(angle: number): string {
  const a = ((angle % 360) + 360) % 360
  if (a >= 350 || a < 10) return 'directly in front'
  if (a < 60) return 'front-right'
  if (a < 80) return 'side-right'
  if (a < 100) return 'side-right'
  if (a < 170) return 'back-right (rim)'
  if (a < 190) return 'directly behind (rim)'
  if (a < 260) return 'back-left (rim)'
  if (a < 290) return 'side-left'
  if (a < 340) return 'front-left'
  return 'front-left'
}

function valueToString(slot: Slot, value: unknown): string {
  if (slot.type === 'multiselect') {
    const list = Array.isArray(value) ? value : []
    const join = slot.join ?? ' '
    return list.join(join)
  }
  if (slot.type === 'toggle') {
    return String(Boolean(value))
  }
  if (slot.type === 'angle_picker') {
    return String(value)
  }
  if (slot.type === 'aperture' || slot.type === 'focal_length' || slot.type === 'number_input' || slot.type === 'number_slider') {
    return String(value)
  }
  if (slot.type === 'color_picker' || slot.type === 'enum' || slot.type === 'hidden' || slot.type === 'text_short') {
    return String(value ?? '')
  }
  return String(value ?? '')
}

export function renderBlock(block: Block, overrides: SlotValues = {}): string {
  const merged: SlotValues = { ...defaultSlotValues(block), ...overrides }
  let out = block.template
  for (const slot of block.slots) {
    const raw = merged[slot.id]
    const directStr = valueToString(slot, raw)
    out = out.replaceAll(`{{${slot.id}}}`, directStr)
    if (slot.computed_field) {
      let derived: string
      if (slot.type === 'angle_picker' && !slot.computed_map) {
        derived = angleToText(Number(raw))
      } else {
        derived = lookupComputedString(slot, raw)
      }
      out = out.replaceAll(`{{${slot.computed_field}}}`, derived)
    }
  }
  // Tidy up: collapse stray double spaces and orphan placeholders.
  out = out.replace(/\{\{[a-zA-Z_]+\}\}/g, '').replace(/[ \t]{2,}/g, ' ')
  return out.trim()
}
