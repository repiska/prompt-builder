import { useState } from 'react'
import { useEditor } from '../store/editor'
import type { ComposedPrompt } from '../lib/composer'
import type { ValidationIssue } from '../lib/types'
import { t } from '../lib/i18n'

interface Props {
  composed: ComposedPrompt
  issues: ValidationIssue[]
}

export function RightPanel({ composed, issues }: Props) {
  const lang = useEditor((s) => s.lang)
  const recipe = useEditor((s) => s.recipe)
  const [pass, setPass] = useState<'pass1' | 'pass2'>('pass1')
  const [copied, setCopied] = useState<string | null>(null)

  const hasErrors = issues.some((i) => i.level === 'error')
  const text = pass === 'pass2' ? composed.pass2 ?? '' : composed.pass1
  const charCount = text.length
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 1200)
    } catch {
      // ignore
    }
  }

  const passLabel = (p: 'pass1' | 'pass2') => t(lang, `prompt.${p}`)

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="label">{t(lang, 'prompt.title')}</div>
          <div className="text-sm text-ink-200 truncate">
            {recipe.name}
            {recipe.custom && <span className="ml-2 text-xs text-warn">{t(lang, 'recipe.modified')}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {composed.pass2 && (
            <div className="flex items-center gap-1 p-0.5 bg-ink-700 rounded">
              <button
                type="button"
                onClick={() => setPass('pass1')}
                className={
                  'px-2 py-1 rounded text-xs ' +
                  (pass === 'pass1' ? 'bg-accent-500 text-white' : 'text-ink-300')
                }
              >
                {t(lang, 'prompt.pass1')}
              </button>
              <button
                type="button"
                onClick={() => setPass('pass2')}
                className={
                  'px-2 py-1 rounded text-xs ' +
                  (pass === 'pass2' ? 'bg-accent-500 text-white' : 'text-ink-300')
                }
              >
                {t(lang, 'prompt.pass2')}
              </button>
            </div>
          )}
        </div>
      </div>

      {hasErrors && (
        <div className="mb-3 p-2.5 rounded-md bg-bad/10 border border-bad/40 text-bad text-xs">
          {t(lang, 'val.resolveErrors')}
        </div>
      )}

      <div className="panel flex-1 min-h-0 flex flex-col">
        <pre className="flex-1 min-h-0 overflow-auto p-4 text-xs leading-relaxed font-mono text-ink-100 whitespace-pre-wrap break-words">
{text || (pass === 'pass2' ? t(lang, 'prompt.noPass2') : '')}
        </pre>
        <div className="border-t border-ink-700 p-2.5 flex items-center justify-between gap-2">
          <div className="text-[10px] text-ink-400 font-mono">
            {wordCount} {t(lang, 'prompt.words')} · {charCount} {t(lang, 'prompt.chars')}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={!text || hasErrors}
              onClick={() => copy('current', text)}
              className="btn-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied === 'current' ? t(lang, 'prompt.copied') : t(lang, 'prompt.copy', { pass: passLabel(pass) })}
            </button>
            {composed.pass2 && (
              <button
                type="button"
                disabled={hasErrors}
                onClick={() => copy('both', `=== PASS 1 ===\n\n${composed.pass1}\n\n=== PASS 2 ===\n\n${composed.pass2}`)}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                {copied === 'both' ? t(lang, 'prompt.copied') : t(lang, 'prompt.copyBoth')}
              </button>
            )}
          </div>
        </div>
      </div>

      <details className="mt-3">
        <summary className="text-xs text-ink-300 cursor-pointer hover:text-ink-100">
          {t(lang, 'prompt.perBlock')} ({composed.perBlock.length})
        </summary>
        <div className="mt-2 space-y-2">
          {composed.perBlock.map((b, idx) => (
            <div key={idx} className="panel p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">
                  {b.type} · <span className="text-ink-200 font-mono">{b.id}</span>
                </div>
                <button
                  type="button"
                  className="text-[10px] text-ink-300 hover:text-white"
                  onClick={() => copy(`b-${idx}`, b.rendered)}
                >
                  {copied === `b-${idx}` ? t(lang, 'prompt.smallCopied') : t(lang, 'prompt.smallCopy')}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-ink-200 whitespace-pre-wrap break-words leading-relaxed">
                {b.rendered}
              </pre>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
