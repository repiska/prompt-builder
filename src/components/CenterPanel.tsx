import { useEditor } from '../store/editor'
import { findBlock } from '../data/blocks'
import { BlockCard } from './BlockCard'
import type { BlockType } from '../lib/types'
import { t } from '../lib/i18n'

export function CenterPanel() {
  const lang = useEditor((s) => s.lang)
  const recipe = useEditor((s) => s.recipe)
  const generation = useEditor((s) => s.generation)
  const addBlock = useEditor((s) => s.addBlock)

  const baseBlock = findBlock('BASE', recipe.base)

  let order: BlockType[]
  if (generation === 'ugc') {
    order = ['UGC_SCENARIO', 'GRADE']
  } else {
    order = ['POSE', 'LOCATION', 'CAMERA', 'GRADE']
  }
  const required = new Set(((baseBlock?.tags.requires_blocks as BlockType[] | undefined) ?? []) as BlockType[])

  const hasGrade = recipe.blocks.some((b) => b.type === 'GRADE')

  return (
    <div className="space-y-4">
      <BaseCard />
      {order.map((t) => {
        const ref = recipe.blocks.find((b) => b.type === t)
        return <BlockCard key={t} type={t} ref={ref} required={required.has(t)} />
      })}
      {!hasGrade && (
        <button
          type="button"
          onClick={() => {
            const candidate =
              generation === 'catalog'
                ? 'G_CAT'
                : generation === 'lifestyle'
                ? 'G_LIF_B'
                : 'G_UGC_M'
            addBlock('GRADE', candidate)
          }}
          className="btn-secondary w-full text-xs"
        >
          {t(lang, 'block.addGrade')}
        </button>
      )}
    </div>
  )
}

function BaseCard() {
  const lang = useEditor((s) => s.lang)
  const recipe = useEditor((s) => s.recipe)
  const baseBlock = findBlock('BASE', recipe.base)
  const setSlotValue = useEditor((s) => s.setSlotValue)
  const baseRef = recipe.blocks.find((b) => b.type === 'BASE')
  const slotValues: Record<string, unknown> = baseRef?.slots ?? {}

  if (!baseBlock) return null
  const visibleSlots = baseBlock.slots.filter((s) => s.type !== 'hidden')
  if (visibleSlots.length === 0) return null
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="label">{t(lang, 'block.globalBase')}</div>
          <div className="font-medium text-ink-100">{baseBlock.name}</div>
        </div>
      </div>
      <details>
        <summary className="text-xs text-ink-300 cursor-pointer hover:text-ink-100">
          {t(lang, 'block.baseParams')} ({visibleSlots.length})
        </summary>
        <div className="space-y-3 pt-3 mt-2 border-t border-ink-700">
          {visibleSlots.map((slot) => {
            const value = slotValues[slot.id] ?? slot.default
            return (
              <BaseSlotRow
                key={slot.id}
                slot={slot}
                value={value}
                onChange={(v) => {
                  // Store base slot values directly on the recipe entry by ensuring a BASE ref exists.
                  ensureBaseRef()
                  setSlotValue('BASE', slot.id, v)
                }}
              />
            )
          })}
        </div>
      </details>
    </div>
  )
}

function ensureBaseRef() {
  // Inserts a BASE block ref if missing — needed because base slot values are stored under recipe.blocks[type=BASE].
  // Done lazily here so the rest of the app stays unaware.
  const state = useEditor.getState()
  if (state.recipe.blocks.some((b) => b.type === 'BASE')) return
  state.addBlock('BASE', state.recipe.base)
}

import { SlotControl } from './controls/SlotControl'
import type { Slot } from '../lib/types'
function BaseSlotRow({
  slot,
  value,
  onChange,
}: {
  slot: Slot
  value: unknown
  onChange: (v: unknown) => void
}) {
  return <SlotControl slot={slot} value={value} onChange={onChange} />
}
