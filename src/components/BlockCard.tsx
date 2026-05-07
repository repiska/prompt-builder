import { useMemo } from 'react'
import { ALL_BLOCKS, blocksOfTypeForBase, findBlock } from '../data/blocks'
import { useEditor } from '../store/editor'
import { defaultSlotValues } from '../lib/render'
import type { Block, BlockType, RecipeBlockRef } from '../lib/types'
import { SlotControl } from './controls/SlotControl'

interface Props {
  type: BlockType
  ref: RecipeBlockRef | undefined
  required: boolean
}

const TYPE_LABEL: Record<BlockType, string> = {
  BASE: 'Base',
  POSE: 'Pose',
  LOCATION: 'Location & Lighting',
  CAMERA: 'Camera',
  GRADE: 'Grade (Pass 2)',
  UGC_SCENARIO: 'Scenario',
}

export function BlockCard({ type, ref: blockRef, required }: Props) {
  const recipe = useEditor((s) => s.recipe)
  const mode = useEditor((s) => s.mode)
  const expertOpen = useEditor((s) => s.expertOpen)
  const setBlockId = useEditor((s) => s.setBlockId)
  const setSlotValue = useEditor((s) => s.setSlotValue)
  const resetSlots = useEditor((s) => s.resetSlots)
  const removeBlock = useEditor((s) => s.removeBlock)
  const toggleExpert = useEditor((s) => s.toggleExpert)

  const candidates = useMemo(() => blocksOfTypeForBase(type, recipe.base), [type, recipe.base])

  const block: Block | undefined = blockRef ? findBlock(type, blockRef.id) : undefined
  const expertKey = type
  const expert = !!expertOpen[expertKey]

  if (!blockRef || !block) {
    if (!required) return null
    // Required but missing: show selector to add.
    return (
      <div className="card border-bad/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div className="label text-bad">Required · {TYPE_LABEL[type]}</div>
            <div className="font-medium text-ink-100">Pick a {TYPE_LABEL[type].toLowerCase()}</div>
          </div>
          <Indicator level="error" />
        </div>
        <select
          className="select"
          value=""
          onChange={(e) => setBlockId(type, e.target.value)}
        >
          <option value="" disabled>
            Choose…
          </option>
          {candidates.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const slotValues = { ...defaultSlotValues(block), ...(blockRef.slots ?? {}) }
  const showBlockSelector = mode === 'block' || mode === 'expert'
  const showSlots = mode === 'expert' || (mode === 'block' && expert)

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="label">{TYPE_LABEL[type]}</div>
          <div className="font-medium text-ink-100 truncate">{block.name}</div>
        </div>
        <div className="flex items-center gap-1">
          {!required && (
            <button
              type="button"
              onClick={() => removeBlock(type)}
              className="btn-ghost text-xs"
              title="Remove this block"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {showBlockSelector && (
        <select
          className="select mb-3"
          value={block.id}
          onChange={(e) => setBlockId(type, e.target.value)}
        >
          {candidates.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      )}

      {block.description && (
        <p className="help-text mb-3 -mt-1">{block.description}</p>
      )}

      {block.slots.filter((s) => s.type !== 'hidden').length > 0 && mode === 'block' && (
        <button
          type="button"
          onClick={() => toggleExpert(expertKey)}
          className="btn-ghost text-xs mb-2 -ml-2"
        >
          {expert ? '▾' : '▸'} Expert parameters
          <span className="text-ink-400 ml-1">
            ({block.slots.filter((s) => s.type !== 'hidden').length})
          </span>
        </button>
      )}

      {showSlots && (
        <div className="space-y-3 pt-2 border-t border-ink-700">
          {block.slots
            .filter((s) => s.type !== 'hidden')
            .map((slot) => (
              <SlotControl
                key={slot.id}
                slot={slot}
                value={slotValues[slot.id]}
                onChange={(v) => setSlotValue(type, slot.id, v)}
              />
            ))}
          <div className="flex justify-end pt-1">
            <button type="button" onClick={() => resetSlots(type)} className="btn-ghost text-xs">
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ALL_BLOCK_TYPES() {
  return Array.from(new Set(ALL_BLOCKS.map((b) => b.type)))
}

function Indicator({ level }: { level: 'error' | 'warning' | 'ok' }) {
  const cls =
    level === 'error'
      ? 'bg-bad/20 text-bad'
      : level === 'warning'
      ? 'bg-warn/20 text-warn'
      : 'bg-good/20 text-good'
  const label = level === 'error' ? 'required' : level === 'warning' ? 'check' : 'ok'
  return <span className={`chip ${cls}`}>{label}</span>
}
