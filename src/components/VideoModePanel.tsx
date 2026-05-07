import { useMemo, useState } from 'react'
import {
  VIDEO_RECIPES,
  VIDEO_BASE_BLOCKS,
  MOTION_BLOCKS,
  CAMERA_MOVE_BLOCKS,
  GRADE_VIDEO_BLOCKS,
  AUDIO_PRESET_BLOCKS,
} from '../data/video'
import { composeVideoPrompt, type ComposeVideoInput } from '../lib/composer'
import type { Lang } from '../lib/i18n'
import { t, loc } from '../lib/i18n'
import { useEditor } from '../store/editor'
import { VideoProjectPanel } from './VideoProjectPanel'

// ── resolver ──────────────────────────────────────────────────────────────────

function resolveRecipe(recipeId: string): ComposeVideoInput | null {
  const recipe = VIDEO_RECIPES.find((r) => r.id === recipeId)
  if (!recipe) return null
  const base = VIDEO_BASE_BLOCKS.find((b) => b.id === recipe.baseId)
  if (!base) return null
  const motion = recipe.motionId
    ? (MOTION_BLOCKS.find((m) => m.id === recipe.motionId) ?? null)
    : null
  const cameraMove = recipe.cameraMoveId
    ? (CAMERA_MOVE_BLOCKS.find((c) => c.id === recipe.cameraMoveId) ?? null)
    : null
  const grade = recipe.gradeId
    ? (GRADE_VIDEO_BLOCKS.find((g) => g.id === recipe.gradeId) ?? null)
    : null
  const audioPreset = recipe.audioPresetId
    ? (AUDIO_PRESET_BLOCKS.find((a) => a.id === recipe.audioPresetId) ?? null)
    : null
  return {
    base,
    motion,
    cameraMove,
    grade,
    audioPreset,
    duration: recipe.duration ?? base.defaultDuration,
    aspectRatio: recipe.aspectRatio ?? base.defaultAspectRatio,
    resolution: recipe.resolution ?? base.defaultResolution,
    tier: recipe.tier ?? base.defaultTier,
    references: recipe.references ?? [],
    dialogue: recipe.dialogue ?? null,
    negativePrompt: recipe.negativePrompt,
    slotValues: recipe.slotValues ?? {},
  }
}

// ── copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text, lang }: { text: string; lang: Lang }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        'text-xs px-2 py-0.5 rounded font-medium transition-colors ' +
        (copied
          ? 'bg-good/20 text-good'
          : 'bg-ink-700 text-ink-300 hover:bg-ink-600 hover:text-white')
      }
    >
      {copied ? t(lang, 'video.copied') : t(lang, 'video.copy')}
    </button>
  )
}

// ── main component ────────────────────────────────────────────────────────────

interface Props {
  lang: Lang
}

export function VideoModePanel({ lang }: Props) {
  const { videoMode, setVideoMode } = useEditor()
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    VIDEO_RECIPES[0]?.id ?? 'VR_PDP_LOOP'
  )

  const output = useMemo(() => {
    const input = resolveRecipe(selectedRecipeId)
    return input ? composeVideoPrompt(input) : null
  }, [selectedRecipeId])

  return (
    <div className="space-y-0">
      {/* Sub-tab toggle */}
      <div className="flex border-b border-ink-700 px-5 pt-4">
        {(
          [
            ['single_clip', 'video.subtabSingleClip'],
            ['project',     'video.subtabProject'],
          ] as const
        ).map(([mode, labelKey]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setVideoMode(mode)}
            className={
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ' +
              (videoMode === mode
                ? 'border-accent-500 text-accent-400'
                : 'border-transparent text-ink-400 hover:text-ink-200')
            }
          >
            {t(lang, labelKey)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {videoMode === 'project' ? (
        <VideoProjectPanel lang={lang} />
      ) : (
        <div className="max-w-3xl mx-auto px-5 py-6 space-y-5">
          {/* Header */}
          <div>
            <h2 className="text-sm font-semibold text-accent-400 uppercase tracking-wider">
              {t(lang, 'video.modeTitle')}
            </h2>
          </div>

          {/* Recipe pills */}
          <div className="flex flex-wrap gap-2">
            {VIDEO_RECIPES.map((recipe) => {
              const active = recipe.id === selectedRecipeId
              return (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ' +
                    (active
                      ? 'bg-accent-500 border-accent-500 text-white'
                      : 'bg-ink-800 border-ink-600 text-ink-300 hover:border-accent-500 hover:text-white')
                  }
                >
                  {loc(recipe, lang, 'name')}
                </button>
              )
            })}
          </div>

          {output ? (
            <div className="space-y-4">
              {/* Composed prompt */}
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="label">{t(lang, 'video.composedPrompt')}</div>
                  <CopyButton text={output.prompt} lang={lang} />
                </div>
                <pre className="text-xs font-mono text-ink-100 whitespace-pre-wrap break-words leading-relaxed bg-ink-900 rounded p-3">
                  {output.prompt}
                </pre>
              </div>

              {/* Negative prompt */}
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="label">{t(lang, 'video.negativePrompt')}</div>
                  {output.negativePrompt && (
                    <CopyButton text={output.negativePrompt} lang={lang} />
                  )}
                </div>
                <pre className="text-xs font-mono text-ink-300 whitespace-pre-wrap break-words leading-relaxed bg-ink-900 rounded p-3">
                  {output.negativePrompt || '—'}
                </pre>
              </div>

              {/* API parameters */}
              <div className="card">
                <div className="label mb-2">{t(lang, 'video.apiParams')}</div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <dt className="text-ink-400">{t(lang, 'video.recipeDuration')}</dt>
                  <dd className="text-ink-100 font-medium">{output.apiParams.durationSeconds}s</dd>

                  <dt className="text-ink-400">{t(lang, 'video.recipeAspect')}</dt>
                  <dd className="text-ink-100 font-medium">{output.apiParams.aspectRatio}</dd>

                  <dt className="text-ink-400">{t(lang, 'video.recipeResolution')}</dt>
                  <dd className="text-ink-100 font-medium">{output.apiParams.resolution}</dd>

                  <dt className="text-ink-400">{t(lang, 'video.recipeTier')}</dt>
                  <dd className="text-ink-100 font-medium">{output.apiParams.tier}</dd>

                  <dt className="text-ink-400">{t(lang, 'video.recipeRefCount')}</dt>
                  <dd className="text-ink-100 font-medium">{output.apiParams.referenceImagesCount}</dd>
                </dl>
              </div>

              {/* Warnings */}
              {output.warnings.length > 0 && (
                <div className="card border-warn/40 bg-warn/10">
                  <div className="label text-warn mb-2">{t(lang, 'video.warnings')}</div>
                  <ul className="space-y-1">
                    {output.warnings.map((w) => (
                      <li key={w} className="text-xs text-warn flex gap-2">
                        <span className="shrink-0">!</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-xs text-ink-400">{t(lang, 'video.recipeNotFound')}</div>
          )}
        </div>
      )}
    </div>
  )
}
