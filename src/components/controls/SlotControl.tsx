import type { Slot } from '../../lib/types'
import { useEditor } from '../../store/editor'
import { loc } from '../../lib/i18n'

interface Props {
  slot: Slot
  value: unknown
  onChange: (value: unknown) => void
}

export function SlotControl({ slot, value, onChange }: Props) {
  const lang = useEditor((s) => s.lang)
  if (slot.type === 'hidden') return null

  const label = loc(slot, lang, 'label') || slot.id
  const help = loc(slot, lang, 'help')

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="field-label flex items-center gap-2" htmlFor={slot.id}>
          {label}
        </label>
        <ValueBadge slot={slot} value={value} />
      </div>

      {slot.type === 'enum' && (
        <select
          id={slot.id}
          className="select"
          value={String(value ?? slot.default)}
          onChange={(e) => onChange(e.target.value)}
        >
          {slot.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {loc(opt, lang, 'label')}
            </option>
          ))}
        </select>
      )}

      {slot.type === 'number_slider' && (
        <NumberSliderControl
          id={slot.id}
          min={slot.min}
          max={slot.max}
          step={slot.step}
          unit={slot.unit}
          value={Number(value ?? slot.default)}
          onChange={onChange}
        />
      )}

      {slot.type === 'number_input' && (
        <input
          id={slot.id}
          className="input"
          type="number"
          min={slot.min}
          max={slot.max}
          step={slot.step ?? 1}
          value={Number(value ?? slot.default)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}

      {slot.type === 'color_picker' && (
        <ColorPickerControl
          id={slot.id}
          value={String(value ?? slot.default)}
          onChange={onChange}
          presets={slot.presets}
          lang={lang}
        />
      )}

      {slot.type === 'aperture' && (
        <SnapStepsControl
          id={slot.id}
          options={slot.options}
          value={Number(value ?? slot.default)}
          onChange={(v) => onChange(v)}
          format={(v) => `f/${v}`}
        />
      )}

      {slot.type === 'focal_length' && (
        <SnapStepsControl
          id={slot.id}
          options={slot.options}
          value={Number(value ?? slot.default)}
          onChange={(v) => onChange(v)}
          format={(v) => `${v}${slot.unit ?? 'mm'}`}
        />
      )}

      {slot.type === 'angle_picker' && (
        <AnglePickerControl
          id={slot.id}
          min={slot.min}
          max={slot.max}
          step={slot.step}
          unit={slot.unit}
          value={Number(value ?? slot.default)}
          onChange={onChange}
        />
      )}

      {slot.type === 'toggle' && (
        <ToggleControl
          id={slot.id}
          value={Boolean(value ?? slot.default)}
          onChange={onChange}
        />
      )}

      {slot.type === 'text_short' && (
        <input
          id={slot.id}
          className="input"
          type="text"
          maxLength={slot.max_length ?? 200}
          value={String(value ?? slot.default)}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {slot.type === 'multiselect' && (
        <MultiselectControl
          options={slot.options}
          lang={lang}
          value={Array.isArray(value) ? (value as string[]) : (slot.default as string[])}
          onChange={(v) => onChange(v)}
        />
      )}

      {help && <p className="help-text">{help}</p>}
    </div>
  )
}

function ValueBadge({ slot, value }: { slot: Slot; value: unknown }) {
  if (slot.type === 'number_slider' || slot.type === 'angle_picker' || slot.type === 'number_input') {
    return (
      <span className="font-mono text-xs text-ink-300">
        {String(value ?? slot.default)}
        {('unit' in slot && slot.unit) || ''}
      </span>
    )
  }
  if (slot.type === 'aperture') {
    return <span className="font-mono text-xs text-ink-300">f/{String(value ?? slot.default)}</span>
  }
  if (slot.type === 'focal_length') {
    return (
      <span className="font-mono text-xs text-ink-300">
        {String(value ?? slot.default)}
        {slot.unit ?? 'mm'}
      </span>
    )
  }
  if (slot.type === 'color_picker') {
    return (
      <span className="font-mono text-xs text-ink-300">
        {String(value ?? slot.default).toUpperCase()}
      </span>
    )
  }
  return null
}

function NumberSliderControl(props: {
  id: string
  min: number
  max: number
  step: number
  unit?: string
  value: number
  onChange: (v: number) => void
}) {
  const { id, min, max, step, value, onChange } = props
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-ink-700 rounded appearance-none cursor-pointer accent-accent-500"
    />
  )
}

function SnapStepsControl<T extends number>(props: {
  id: string
  options: T[]
  value: T
  onChange: (v: T) => void
  format: (v: T) => string
}) {
  const { id, options, value, onChange, format } = props
  return (
    <div id={id} className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={
              'px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ' +
              (active
                ? 'bg-accent-500 border-accent-500 text-white'
                : 'bg-ink-700 border-ink-600 text-ink-200 hover:border-ink-500')
            }
          >
            {format(opt)}
          </button>
        )
      })}
    </div>
  )
}

function AnglePickerControl(props: {
  id: string
  min: number
  max: number
  step: number
  unit?: string
  value: number
  onChange: (v: number) => void
}) {
  const { min, max, step, value, onChange } = props
  // Visualize as compass disc + slider.
  const radius = 28
  const angleRad = ((value - 90) * Math.PI) / 180
  const x = 32 + radius * Math.cos(angleRad)
  const y = 32 + radius * Math.sin(angleRad)
  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
        <circle cx="32" cy="32" r="30" fill="transparent" stroke="#3a4150" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="2" fill="#5b6372" />
        <line x1="32" y1="32" x2={x} y2={y} stroke="#7c8cff" strokeWidth="2" strokeLinecap="round" />
        <circle cx={x} cy={y} r="3" fill="#7c8cff" />
      </svg>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-ink-700 rounded appearance-none cursor-pointer accent-accent-500"
      />
    </div>
  )
}

function ToggleControl(props: { id: string; value: boolean; onChange: (v: boolean) => void }) {
  const { value, onChange } = props
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={
        'inline-flex items-center w-12 h-6 rounded-full transition-colors ' +
        (value ? 'bg-accent-500' : 'bg-ink-600')
      }
      aria-pressed={value}
    >
      <span
        className={
          'inline-block w-5 h-5 rounded-full bg-white transition-transform ' +
          (value ? 'translate-x-6' : 'translate-x-0.5')
        }
      />
    </button>
  )
}

function ColorPickerControl(props: {
  id: string
  value: string
  onChange: (v: string) => void
  presets?: { value: string; label: string; label_ru?: string }[]
  lang: 'en' | 'ru'
}) {
  const { id, value, onChange, presets, lang } = props
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 bg-transparent border border-ink-600 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input font-mono"
          maxLength={7}
        />
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {presets.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className={
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-colors ' +
                (value.toLowerCase() === p.value.toLowerCase()
                  ? 'bg-ink-700 border-accent-500 text-white'
                  : 'bg-ink-700 border-ink-600 text-ink-200 hover:border-ink-500')
              }
            >
              <span
                className="inline-block w-3 h-3 rounded border border-ink-500"
                style={{ background: p.value }}
              />
              {loc(p, lang, 'label')}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiselectControl(props: {
  options: { value: string; label: string; label_ru?: string }[]
  lang: 'en' | 'ru'
  value: string[]
  onChange: (v: string[]) => void
}) {
  const { options, value, onChange, lang } = props
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v))
    else onChange([...value, v])
  }
  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => {
        const active = value.includes(opt.value)
        return (
          <label
            key={opt.value}
            className={
              'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm ' +
              (active ? 'bg-accent-500/20 text-white' : 'text-ink-200 hover:bg-ink-700')
            }
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => toggle(opt.value)}
              className="accent-accent-500"
            />
            {loc(opt, lang, 'label')}
          </label>
        )
      })}
    </div>
  )
}
