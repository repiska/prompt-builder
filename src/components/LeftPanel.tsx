import { useMemo, useRef, useState } from 'react'
import { useEditor } from '../store/editor'
import { recipesForUseCase } from '../data/recipes'
import type { GenerationType, ValidationIssue } from '../lib/types'

const GEN_OPTIONS: { value: GenerationType; label: string; description: string }[] = [
  { value: 'catalog', label: 'Catalog', description: 'Studio backdrop, controlled lighting' },
  { value: 'lifestyle', label: 'Lifestyle', description: 'Real-world location, integrated lighting' },
  { value: 'ugc', label: 'UGC', description: 'Authentic smartphone photo' },
]

const UC_OPTIONS = [
  { value: 'UC1', label: 'Evening / cocktail' },
  { value: 'UC2', label: 'Office / business' },
  { value: 'UC3', label: 'Summer / resort' },
  { value: 'UC4', label: 'Casual / dress' },
]

interface Props {
  issues: ValidationIssue[]
}

export function LeftPanel({ issues }: Props) {
  const generation = useEditor((s) => s.generation)
  const setGeneration = useEditor((s) => s.setGeneration)
  const useCase = useEditor((s) => s.useCase)
  const setUseCase = useEditor((s) => s.setUseCase)
  const recipeId = useEditor((s) => s.recipeId)
  const setRecipeId = useEditor((s) => s.setRecipeId)
  const customRecipes = useEditor((s) => s.customRecipes)
  const recipe = useEditor((s) => s.recipe)
  const saveCurrentAsCustom = useEditor((s) => s.saveCurrentAsCustom)
  const deleteCustom = useEditor((s) => s.deleteCustom)
  const exportRecipe = useEditor((s) => s.exportRecipe)
  const importRecipe = useEditor((s) => s.importRecipe)
  const reset = useEditor((s) => s.reset)
  const mode = useEditor((s) => s.mode)
  const setMode = useEditor((s) => s.setMode)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saveOpen, setSaveOpen] = useState(false)
  const [saveName, setSaveName] = useState('')

  const baseId = `${generation === 'catalog' ? 'catalog' : generation === 'lifestyle' ? 'lifestyle' : 'ugc'}_base`
  const recipes = useMemo(() => recipesForUseCase(baseId, useCase), [baseId, useCase])
  const allBaseRecipes = useMemo(() => recipesForUseCase(baseId), [baseId])
  const customForBase = customRecipes.filter((r) => r.base === baseId)

  const errorCount = issues.filter((i) => i.level === 'error').length
  const warnCount = issues.filter((i) => i.level === 'warning').length

  return (
    <div className="space-y-5">
      <Section label="Generation type">
        <div className="grid grid-cols-1 gap-1.5">
          {GEN_OPTIONS.map((opt) => {
            const active = generation === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGeneration(opt.value)}
                className={
                  'text-left p-3 rounded-md border transition-colors ' +
                  (active
                    ? 'bg-accent-500/10 border-accent-500'
                    : 'bg-ink-800 border-ink-700 hover:border-ink-500')
                }
              >
                <div className="text-sm font-medium text-ink-100">{opt.label}</div>
                <div className="text-xs text-ink-300">{opt.description}</div>
              </button>
            )
          })}
        </div>
      </Section>

      {generation !== 'catalog' && (
        <Section label="Use case (optional filter)">
          <select
            className="select"
            value={useCase ?? ''}
            onChange={(e) => setUseCase(e.target.value || undefined)}
          >
            <option value="">All use cases</option>
            {UC_OPTIONS.map((uc) => (
              <option key={uc.value} value={uc.value}>
                {uc.label}
              </option>
            ))}
          </select>
        </Section>
      )}

      <Section label="Recipe" hint={recipe.custom ? 'modified' : undefined}>
        <select
          className="select"
          value={recipeId ?? ''}
          onChange={(e) => setRecipeId(e.target.value)}
        >
          <optgroup label="Built-in">
            {(useCase ? recipes : allBaseRecipes).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </optgroup>
          {customForBase.length > 0 && (
            <optgroup label="Custom">
              {customForBase.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => setSaveOpen(true)}
          >
            Save as recipe
          </button>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => {
              const blob = new Blob([exportRecipe()], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${recipe.id}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              const text = await f.text()
              const ok = importRecipe(text)
              if (!ok) alert('Import failed: invalid recipe JSON')
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          />
        </div>

        {saveOpen && (
          <div className="mt-2 p-2 bg-ink-700 rounded-md">
            <input
              autoFocus
              type="text"
              className="input mb-2"
              placeholder="Recipe name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <div className="flex gap-1">
              <button
                type="button"
                className="btn-primary text-xs"
                disabled={!saveName.trim()}
                onClick={() => {
                  saveCurrentAsCustom(saveName.trim())
                  setSaveName('')
                  setSaveOpen(false)
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={() => {
                  setSaveOpen(false)
                  setSaveName('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {customForBase.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-ink-300 cursor-pointer hover:text-ink-100">
              Manage custom recipes ({customForBase.length})
            </summary>
            <ul className="mt-2 space-y-1">
              {customForBase.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 text-xs bg-ink-700 rounded px-2 py-1"
                >
                  <span className="truncate">{r.name}</span>
                  <button
                    type="button"
                    className="text-ink-400 hover:text-bad"
                    onClick={() => {
                      if (confirm(`Delete "${r.name}"?`)) deleteCustom(r.id)
                    }}
                  >
                    delete
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </Section>

      <Section label="Editing mode">
        <div className="grid grid-cols-3 gap-1 p-1 bg-ink-700 rounded-md">
          {(['recipe', 'block', 'expert'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                'py-1.5 rounded text-xs font-medium capitalize transition-colors ' +
                (mode === m ? 'bg-accent-500 text-white' : 'text-ink-200 hover:text-white')
              }
            >
              {m}
            </button>
          ))}
        </div>
        <p className="help-text mt-2">
          {mode === 'recipe' && 'Pick a built-in recipe and copy. Fastest path.'}
          {mode === 'block' && 'Swap blocks. Expert parameters hidden under each card.'}
          {mode === 'expert' && 'Every parameter visible — slidable, swappable, savable.'}
        </p>
      </Section>

      <Section label="Validation">
        {issues.length === 0 ? (
          <div className="chip bg-good/20 text-good">All checks passed</div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              {errorCount > 0 && (
                <span className="chip bg-bad/20 text-bad">{errorCount} error</span>
              )}
              {warnCount > 0 && (
                <span className="chip bg-warn/20 text-warn">{warnCount} warning</span>
              )}
            </div>
            <ul className="space-y-1">
              {issues.map((i, idx) => (
                <li
                  key={idx}
                  className={
                    'text-xs leading-snug pl-2 border-l-2 ' +
                    (i.level === 'error'
                      ? 'border-bad text-ink-200'
                      : i.level === 'warning'
                      ? 'border-warn text-ink-200'
                      : 'border-accent-500 text-ink-200')
                  }
                >
                  {i.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <button type="button" onClick={reset} className="btn-ghost text-xs w-full justify-start">
        Reset to defaults
      </button>
    </div>
  )
}

function Section(props: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="label">{props.label}</div>
        {props.hint && <span className="text-[10px] uppercase text-warn">{props.hint}</span>}
      </div>
      {props.children}
    </div>
  )
}
