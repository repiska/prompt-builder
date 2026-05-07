import { useMemo, useRef, useState } from 'react'
import { useEditor } from '../store/editor'
import { recipesForUseCase } from '../data/recipes'
import type { GenerationType, ValidationIssue } from '../lib/types'
import { t, loc } from '../lib/i18n'

const GEN_OPTIONS: { value: GenerationType; labelKey: string; descKey: string }[] = [
  { value: 'catalog', labelKey: 'gen.catalog', descKey: 'gen.catalog.desc' },
  { value: 'lifestyle', labelKey: 'gen.lifestyle', descKey: 'gen.lifestyle.desc' },
  { value: 'ugc', labelKey: 'gen.ugc', descKey: 'gen.ugc.desc' },
]

const UC_OPTIONS = [
  { value: 'UC1', key: 'uc.UC1' },
  { value: 'UC2', key: 'uc.UC2' },
  { value: 'UC3', key: 'uc.UC3' },
  { value: 'UC4', key: 'uc.UC4' },
]

interface Props {
  issues: ValidationIssue[]
}

export function LeftPanel({ issues }: Props) {
  const lang = useEditor((s) => s.lang)
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
      <Section label={t(lang, 'gen.label')}>
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
                <div className="text-sm font-medium text-ink-100">{t(lang, opt.labelKey)}</div>
                <div className="text-xs text-ink-300">{t(lang, opt.descKey)}</div>
              </button>
            )
          })}
        </div>
      </Section>

      {generation !== 'catalog' && (
        <Section label={t(lang, 'uc.label')}>
          <select
            className="select"
            value={useCase ?? ''}
            onChange={(e) => setUseCase(e.target.value || undefined)}
          >
            <option value="">{t(lang, 'uc.all')}</option>
            {UC_OPTIONS.map((uc) => (
              <option key={uc.value} value={uc.value}>
                {t(lang, uc.key)}
              </option>
            ))}
          </select>
        </Section>
      )}

      <Section
        label={t(lang, 'recipe.label')}
        hint={recipe.custom ? t(lang, 'recipe.modified') : undefined}
      >
        <select
          className="select"
          value={recipeId ?? ''}
          onChange={(e) => setRecipeId(e.target.value)}
        >
          <optgroup label={t(lang, 'recipe.builtin')}>
            {(useCase ? recipes : allBaseRecipes).map((r) => (
              <option key={r.id} value={r.id}>
                {loc(r, lang, 'name')}
              </option>
            ))}
          </optgroup>
          {customForBase.length > 0 && (
            <optgroup label={t(lang, 'recipe.custom')}>
              {customForBase.map((r) => (
                <option key={r.id} value={r.id}>
                  {loc(r, lang, 'name')}
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
            {t(lang, 'recipe.saveAs')}
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
            {t(lang, 'recipe.export')}
          </button>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            {t(lang, 'recipe.import')}
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
              if (!ok) alert(t(lang, 'recipe.importFailed'))
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
              placeholder={t(lang, 'recipe.saveName')}
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
                {t(lang, 'recipe.save')}
              </button>
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={() => {
                  setSaveOpen(false)
                  setSaveName('')
                }}
              >
                {t(lang, 'recipe.cancel')}
              </button>
            </div>
          </div>
        )}

        {customForBase.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-ink-300 cursor-pointer hover:text-ink-100">
              {t(lang, 'recipe.manageCustom')} ({customForBase.length})
            </summary>
            <ul className="mt-2 space-y-1">
              {customForBase.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 text-xs bg-ink-700 rounded px-2 py-1"
                >
                  <span className="truncate">{loc(r, lang, 'name')}</span>
                  <button
                    type="button"
                    className="text-ink-400 hover:text-bad"
                    onClick={() => {
                      if (confirm(t(lang, 'recipe.confirmDelete', { name: loc(r, lang, 'name') }))) deleteCustom(r.id)
                    }}
                  >
                    {t(lang, 'recipe.delete')}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </Section>

      <Section label={t(lang, 'mode.label')}>
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
              {t(lang, `mode.${m}`)}
            </button>
          ))}
        </div>
        <p className="help-text mt-2">{t(lang, `mode.${mode}.help`)}</p>
      </Section>

      <Section label={t(lang, 'val.label')}>
        {issues.length === 0 ? (
          <div className="chip bg-good/20 text-good">{t(lang, 'val.allPassed')}</div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              {errorCount > 0 && (
                <span className="chip bg-bad/20 text-bad">
                  {errorCount} {t(lang, 'val.error')}
                </span>
              )}
              {warnCount > 0 && (
                <span className="chip bg-warn/20 text-warn">
                  {warnCount} {t(lang, 'val.warning')}
                </span>
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
        {t(lang, 'recipe.resetAll')}
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
