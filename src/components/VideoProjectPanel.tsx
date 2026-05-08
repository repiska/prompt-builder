import { useMemo, useState } from 'react'
import {
  ALL_VIDEO_RECIPES,
  VIDEO_BASE_BLOCKS,
  MOTION_BLOCKS,
  CAMERA_MOVE_BLOCKS,
  GRADE_VIDEO_BLOCKS,
  AUDIO_PRESET_BLOCKS,
  UGC_VIDEO_BASE_BLOCKS,
  UGC_MOTION_BLOCKS,
  UGC_CAMERA_MOVE_BLOCKS,
  UGC_AUDIO_PRESET_BLOCKS,
} from '../data/video'
import {
  composeVideoProject,
  type ComposeProjectInput,
} from '../lib/composer'
import type {
  VideoProjectClip,
  ProjectClipRole,
  ProjectAudioStrategy,
  VoiceoverScript,
  ProjectContinuityLock,
  ReferenceImageDeclaration,
  VideoBaseBlock,
  MotionBlock,
  CameraMoveBlock,
  GradeVideoBlock,
  AudioPresetBlock,
  VeoDuration,
  VeoAspectRatio,
  VeoResolution,
  VeoTier,
  ElevenLabsRuVoice,
  MotionSpeed,
} from '../lib/types'
import { PROJECT_CLIP_ROLES } from '../lib/types'
import { t, loc } from '../lib/i18n'
import type { Lang } from '../lib/i18n'
import { useEditor } from '../store/editor'
import type { ReferenceImagePayload } from './ReferenceUploader'
import { ReferenceUploader } from './ReferenceUploader'

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveRecipeBlocks(recipeId: string): {
  base: VideoBaseBlock
  motion?: MotionBlock | null
  cameraMove?: CameraMoveBlock | null
  grade?: GradeVideoBlock | null
  audioPreset?: AudioPresetBlock | null
  duration: VeoDuration
  aspectRatio: VeoAspectRatio
  resolution: VeoResolution
  tier: VeoTier
  slotValues: Record<string, unknown>
  negativePrompt?: string
  motionSpeed?: MotionSpeed
  materialHint?: string
} | null {
  const recipe = ALL_VIDEO_RECIPES.find((r) => r.id === recipeId)
  if (!recipe) return null

  const allBases = [...VIDEO_BASE_BLOCKS, ...UGC_VIDEO_BASE_BLOCKS]
  const allMotions = [...MOTION_BLOCKS, ...UGC_MOTION_BLOCKS]
  const allCameras = [...CAMERA_MOVE_BLOCKS, ...UGC_CAMERA_MOVE_BLOCKS]
  const allAudios = [...AUDIO_PRESET_BLOCKS, ...UGC_AUDIO_PRESET_BLOCKS]

  const base = allBases.find((b) => b.id === recipe.baseId)
  if (!base) return null

  const motion = recipe.motionId
    ? (allMotions.find((m) => m.id === recipe.motionId) ?? null)
    : null
  const cameraMove = recipe.cameraMoveId
    ? (allCameras.find((c) => c.id === recipe.cameraMoveId) ?? null)
    : null
  const grade = recipe.gradeId
    ? (GRADE_VIDEO_BLOCKS.find((g) => g.id === recipe.gradeId) ?? null)
    : null
  const audioPreset = recipe.audioPresetId
    ? (allAudios.find((a) => a.id === recipe.audioPresetId) ?? null)
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
    slotValues: recipe.slotValues ?? {},
    negativePrompt: recipe.negativePrompt,
    motionSpeed: recipe.motionSpeed,
    materialHint: recipe.materialHint,
  }
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text, label, lang }: { text: string; label?: string; lang: Lang }) {
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
      {copied ? t(lang, 'video.copied') : (label ?? t(lang, 'video.copy'))}
    </button>
  )
}

// ── Clip role chip ────────────────────────────────────────────────────────────

function ClipRoleChip({ role, lang }: { role: ProjectClipRole; lang: Lang }) {
  const colors: Record<ProjectClipRole, string> = {
    hook:     'bg-accent-500/20 text-accent-400',
    demo:     'bg-good/20 text-good',
    reaction: 'bg-warn/20 text-warn',
    cta:      'bg-bad/20 text-bad',
    b_roll:   'bg-ink-600 text-ink-300',
  }
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${colors[role]}`}>
      {t(lang, `video.clipRole.${role}`)}
    </span>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-2">
      {children}
    </h3>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  lang: Lang
}

export function VideoProjectPanel({ lang }: Props) {
  const {
    videoProject,
    videoProjectReferenceImages,
    updateVideoProject,
    addProjectClip,
    removeProjectClip,
    updateProjectClip,
    addProjectReference,
    removeProjectReference,
    updateProjectReference,
    setProjectReferenceImage,
  } = useEditor()

  // ── Compose output via useMemo ─────────────────────────────────────────────

  const composeInput = useMemo((): ComposeProjectInput | null => {
    const resolvedClips: ComposeProjectInput['resolvedClips'] = {}
    for (const clip of videoProject.clips) {
      const resolved = resolveRecipeBlocks(clip.recipeId)
      if (!resolved) {
        console.warn(`[VideoProjectPanel] Recipe not found for clip ${clip.id}: "${clip.recipeId}"`)
        continue
      }
      resolvedClips[clip.id] = resolved
    }
    return { project: videoProject, resolvedClips }
  }, [videoProject])

  const output = useMemo(() => {
    if (!composeInput) return null
    return composeVideoProject(composeInput)
  }, [composeInput])

  // ── Reference slot handlers ────────────────────────────────────────────────

  function handleDeclarationChange(slotIndex: number, decl: ReferenceImageDeclaration | undefined) {
    const refs = videoProject.sharedReferences
    if (decl === undefined) {
      removeProjectReference(slotIndex)
    } else if (slotIndex < refs.length) {
      updateProjectReference(slotIndex, decl)
    } else {
      addProjectReference(decl)
    }
  }

  function handleImageChange(slotIndex: number, data: ReferenceImagePayload | null) {
    if (data === null) {
      // Remove image and declaration together to keep arrays aligned
      removeProjectReference(slotIndex)
    } else {
      setProjectReferenceImage(slotIndex, data)
      if (slotIndex >= videoProject.sharedReferences.length) {
        addProjectReference({ role: 'model', description: '' })
      }
    }
  }

  // ── Continuity lock field handler ──────────────────────────────────────────

  function handleLockChange(field: keyof ProjectContinuityLock, value: string) {
    updateVideoProject({
      continuityLock: { ...videoProject.continuityLock, [field]: value || undefined },
    })
  }

  // ── Audio strategy handler ─────────────────────────────────────────────────

  function handleAudioStrategyChange(strategy: ProjectAudioStrategy) {
    updateVideoProject({ audioStrategy: strategy })
  }

  // ── Voiceover script handler ───────────────────────────────────────────────

  function handleVoiceoverChange(patch: Partial<VoiceoverScript>) {
    const current = videoProject.voiceoverScript ?? { lang: 'en', text: '', suggestedVoice: 'default' as const }
    updateVideoProject({ voiceoverScript: { ...current, ...patch } })
  }

  const isSilent = videoProject.audioStrategy === 'silent_for_voiceover_overlay'

  // ── Copy all prompts helper ────────────────────────────────────────────────

  const allPromptsText = useMemo(() => {
    if (!output) return ''
    return output.clipPrompts
      .map((cp, i) => `--- Clip ${i + 1} (${cp.clipRole}) ---\n${cp.prompt}`)
      .join('\n\n')
  }, [output])

  return (
    <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">

      {/* ── A. Project meta ── */}
      <div className="card">
        <SectionHeading>{t(lang, 'video.projectName')}</SectionHeading>
        <input
          type="text"
          value={videoProject.name}
          onChange={(e) => updateVideoProject({ name: e.target.value })}
          placeholder={t(lang, 'video.projectNamePlaceholder')}
          className="w-full bg-ink-800 border border-ink-600 rounded px-3 py-1.5 text-sm text-ink-100 placeholder-ink-500 focus:outline-none focus:border-accent-500 transition-colors"
        />
      </div>

      {/* ── B. Shared references ── */}
      <div>
        <SectionHeading>{t(lang, 'video.sharedReferences')}</SectionHeading>
        <p className="text-xs text-ink-400 mb-3 leading-relaxed">
          {t(lang, 'video.sharedReferencesHelp')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([0, 1, 2] as const).map((i) => (
            <ReferenceUploader
              key={i}
              index={i}
              declaration={videoProject.sharedReferences[i] ?? undefined}
              imageData={videoProjectReferenceImages[i] ?? null}
              onDeclarationChange={(decl) => handleDeclarationChange(i, decl)}
              onImageChange={(data) => handleImageChange(i, data)}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* ── C. Shared identity descriptor ── */}
      <div className="card">
        <SectionHeading>{t(lang, 'video.sharedIdentity')}</SectionHeading>
        <textarea
          rows={2}
          value={videoProject.sharedIdentityDescriptor ?? ''}
          onChange={(e) => updateVideoProject({ sharedIdentityDescriptor: e.target.value })}
          placeholder={t(lang, 'video.sharedIdentityPlaceholder')}
          className="w-full bg-ink-800 border border-ink-600 rounded px-3 py-1.5 text-sm text-ink-100 placeholder-ink-500 resize-none focus:outline-none focus:border-accent-500 transition-colors"
        />
        <p className="text-[11px] text-ink-500 mt-1.5 leading-relaxed">
          {t(lang, 'video.sharedIdentityHelp')}
        </p>
      </div>

      {/* ── D. Continuity lock ── */}
      <div className="card">
        <SectionHeading>{t(lang, 'video.continuityLock')}</SectionHeading>
        <p className="text-[11px] text-ink-500 mb-3 leading-relaxed">
          {t(lang, 'video.continuityHelp')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              ['wardrobe', 'video.continuityWardrobe', 'video.continuityWardrobePlaceholder'],
              ['lens',     'video.continuityLens',     'video.continuityLensPlaceholder'],
              ['grade',    'video.continuityGrade',    'video.continuityGradePlaceholder'],
              ['lighting', 'video.continuityLighting', 'video.continuityLightingPlaceholder'],
              ['timeOfDay','video.continuityTimeOfDay','video.continuityTimeOfDayPlaceholder'],
            ] as [keyof ProjectContinuityLock, string, string][]
          ).map(([field, labelKey, placeholderKey]) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-[11px] text-ink-400">{t(lang, labelKey)}</label>
              <input
                type="text"
                value={videoProject.continuityLock[field] ?? ''}
                onChange={(e) => handleLockChange(field, e.target.value)}
                placeholder={t(lang, placeholderKey)}
                className="bg-ink-800 border border-ink-600 rounded px-2 py-1.5 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── E. Seed ── */}
      <div className="card">
        <SectionHeading>{t(lang, 'video.seed')}</SectionHeading>
        <input
          type="number"
          value={videoProject.sharedSeed ?? ''}
          onChange={(e) => {
            const v = e.target.value.trim()
            updateVideoProject({ sharedSeed: v === '' ? undefined : parseInt(v, 10) })
          }}
          placeholder={t(lang, 'video.seedPlaceholder')}
          className="w-full sm:w-48 bg-ink-800 border border-ink-600 rounded px-2 py-1.5 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:border-accent-500 transition-colors"
        />
        <p className="text-[11px] text-ink-500 mt-1.5 leading-relaxed">
          {t(lang, 'video.seedHelp')}
        </p>
      </div>

      {/* ── F. Audio strategy ── */}
      <div className="card">
        <SectionHeading>{t(lang, 'video.audioStrategy')}</SectionHeading>
        <div className="space-y-2">
          {(
            [
              ['silent_for_voiceover_overlay', 'video.audioStrategySilent',   'video.audioStrategySilentHelp'],
              ['native_per_clip',              'video.audioStrategyNative',    'video.audioStrategyNativeHelp'],
            ] as [ProjectAudioStrategy, string, string][]
          ).map(([value, labelKey, helpKey]) => (
            <label key={value} className="flex gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="audioStrategy"
                value={value}
                checked={videoProject.audioStrategy === value}
                onChange={() => handleAudioStrategyChange(value)}
                className="mt-0.5 accent-accent-500"
              />
              <div>
                <span className={`text-xs font-medium ${videoProject.audioStrategy === value ? 'text-ink-100' : 'text-ink-300'}`}>
                  {t(lang, labelKey)}
                </span>
                <p className="text-[11px] text-ink-500 mt-0.5 leading-relaxed">
                  {t(lang, helpKey)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ── G. Voiceover script (only when silent strategy) ── */}
      {isSilent && (
        <div className="card">
          <SectionHeading>{t(lang, 'video.voiceoverScript')}</SectionHeading>

          {/* Language radio */}
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="voiceoverLang"
                value="en"
                checked={(videoProject.voiceoverScript?.lang ?? 'en') === 'en'}
                onChange={() => handleVoiceoverChange({ lang: 'en', suggestedVoice: 'default' })}
                className="accent-accent-500"
              />
              <span className="text-xs text-ink-300">EN</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="voiceoverLang"
                value="ru"
                checked={(videoProject.voiceoverScript?.lang ?? 'en') === 'ru'}
                onChange={() => handleVoiceoverChange({ lang: 'ru', suggestedVoice: 'ivan' })}
                className="accent-accent-500"
              />
              <span className="text-xs text-ink-300">RU</span>
            </label>
          </div>

          {/* Voice preset dropdown */}
          <div className="mb-3">
            <label className="text-[11px] text-ink-400 block mb-1">
              {t(lang, 'video.voiceoverVoice')}
            </label>
            {(videoProject.voiceoverScript?.lang ?? 'en') === 'ru' ? (
              <select
                value={videoProject.voiceoverScript?.suggestedVoice ?? 'ivan'}
                onChange={(e) => handleVoiceoverChange({ suggestedVoice: e.target.value as ElevenLabsRuVoice })}
                className="bg-ink-800 border border-ink-600 rounded px-2 py-1.5 text-xs text-ink-100 focus:outline-none focus:border-accent-500 transition-colors"
              >
                {(['ivan', 'mariia', 'ekaterina', 'sergey', 'marina'] as const).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-ink-400 italic">default</span>
            )}
          </div>

          {/* Script text */}
          <label className="text-[11px] text-ink-400 block mb-1">
            {t(lang, 'video.voiceoverText')}
          </label>
          <textarea
            rows={4}
            value={videoProject.voiceoverScript?.text ?? ''}
            onChange={(e) => handleVoiceoverChange({ text: e.target.value })}
            placeholder={
              (videoProject.voiceoverScript?.lang ?? 'en') === 'ru'
                ? t(lang, 'video.voiceoverScriptPlaceholderRu')
                : t(lang, 'video.voiceoverScriptPlaceholderEn')
            }
            className="w-full bg-ink-800 border border-ink-600 rounded px-3 py-1.5 text-xs text-ink-100 placeholder-ink-500 resize-none focus:outline-none focus:border-accent-500 transition-colors"
          />
          <p className="text-[11px] text-ink-500 mt-1.5 leading-relaxed">
            {t(lang, 'video.voiceoverHelp')}
          </p>
        </div>
      )}

      {/* ── H. Clips list ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionHeading>{t(lang, 'video.clips')}</SectionHeading>
          <button
            type="button"
            onClick={() => addProjectClip(ALL_VIDEO_RECIPES[0]?.id ?? 'VR_PDP_LOOP')}
            className="px-3 py-1 rounded text-xs font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors"
          >
            + {t(lang, 'video.addClip')}
          </button>
        </div>

        {videoProject.clips.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-xs text-ink-400">{t(lang, 'video.noClipsYet')}</p>
            <button
              type="button"
              onClick={() => addProjectClip(ALL_VIDEO_RECIPES[0]?.id ?? 'VR_PDP_LOOP')}
              className="px-4 py-1.5 rounded text-xs font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors"
            >
              {t(lang, 'video.addFirstClip')}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {videoProject.clips.map((clip, clipIndex) => (
              <ClipRow
                key={clip.id}
                clip={clip}
                clipIndex={clipIndex}
                lang={lang}
                onUpdate={(patch) => updateProjectClip(clip.id, patch)}
                onRemove={() => removeProjectClip(clip.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── I. Compose output ── */}
      {output && (
        <div className="space-y-4">
          {/* Project warnings */}
          {output.projectWarnings.length > 0 && (
            <div className="card border-warn/40 bg-warn/10">
              <div className="label text-warn mb-2">{t(lang, 'video.projectWarnings')}</div>
              <ul className="space-y-1">
                {output.projectWarnings.map((w) => (
                  <li key={w} className="text-xs text-warn flex gap-2">
                    <span className="shrink-0">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clip prompts header */}
          <div className="flex items-center justify-between">
            <div className="label">{t(lang, 'video.composedClipPrompts')}</div>
            {output.clipPrompts.length > 0 && (
              <CopyButton
                text={allPromptsText}
                label={t(lang, 'video.copyAll')}
                lang={lang}
              />
            )}
          </div>

          {/* Per-clip cards */}
          {output.clipPrompts.map((cp, i) => {
            const clipDef = videoProject.clips.find((c) => c.id === cp.clipId)
            const recipe = ALL_VIDEO_RECIPES.find((r) => r.id === clipDef?.recipeId)
            return (
              <div key={cp.clipId} className="card space-y-3">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-ink-400 font-medium">
                    {t(lang, 'video.clipN', { n: String(i + 1) })}
                  </span>
                  <ClipRoleChip role={cp.clipRole} lang={lang} />
                  {recipe && (
                    <span className="text-xs text-ink-400 italic">
                      {loc(recipe, lang, 'name')}
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-ink-400">{t(lang, 'video.composedPrompt')}</span>
                    <CopyButton text={cp.prompt} lang={lang} />
                  </div>
                  <pre className="text-xs font-mono text-ink-100 whitespace-pre-wrap break-words leading-relaxed bg-ink-900 rounded p-3">
                    {cp.prompt}
                  </pre>
                </div>

                {/* Negative prompt */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-ink-400">{t(lang, 'video.negativePrompt')}</span>
                    {cp.negativePrompt && <CopyButton text={cp.negativePrompt} lang={lang} />}
                  </div>
                  <pre className="text-[11px] font-mono text-ink-400 whitespace-pre-wrap break-words leading-relaxed bg-ink-900 rounded p-2">
                    {cp.negativePrompt || '—'}
                  </pre>
                </div>

                {/* API params summary */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs">
                  <dt className="text-ink-400">{t(lang, 'video.recipeDuration')}</dt>
                  <dd className="text-ink-100 font-medium">{cp.apiParams.durationSeconds}s</dd>
                  <dt className="text-ink-400">{t(lang, 'video.recipeAspect')}</dt>
                  <dd className="text-ink-100 font-medium">{cp.apiParams.aspectRatio}</dd>
                  <dt className="text-ink-400">{t(lang, 'video.recipeResolution')}</dt>
                  <dd className="text-ink-100 font-medium">{cp.apiParams.resolution}</dd>
                  <dt className="text-ink-400">{t(lang, 'video.recipeTier')}</dt>
                  <dd className="text-ink-100 font-medium">{cp.apiParams.tier}</dd>
                </dl>

                {/* Per-clip warnings */}
                {cp.warnings.length > 0 && (
                  <ul className="space-y-0.5">
                    {cp.warnings.map((w) => (
                      <li key={w} className="text-[11px] text-warn flex gap-1.5">
                        <span className="shrink-0">!</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Per-clip voiceover hint — only in native_per_clip mode */}
                {cp.voiceoverHint && videoProject.audioStrategy === 'native_per_clip' && (
                  <div className="border border-warn/40 bg-warn/10 rounded p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-warn">
                        {t(lang, 'video.voiceoverHint')}
                      </span>
                      <CopyButton text={cp.voiceoverHint.text} lang={lang} />
                    </div>
                    <pre className="text-[11px] font-mono text-ink-200 whitespace-pre-wrap break-words leading-relaxed bg-ink-900 rounded p-2">
                      {cp.voiceoverHint.text}
                    </pre>
                    {cp.voiceoverHint.suggestedVoice && (
                      <p className="text-[11px] text-ink-400">
                        {t(lang, 'video.voiceoverHintSuggestedVoice')}:{' '}
                        <span className="text-ink-200 font-medium">{cp.voiceoverHint.suggestedVoice}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Continuity checklist */}
          {output.continuityChecklist.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="label">{t(lang, 'video.continuityChecklist')}</div>
                <CopyButton
                  text={output.continuityChecklist.map((s) => `- ${s}`).join('\n')}
                  lang={lang}
                />
              </div>
              <ul className="space-y-1">
                {output.continuityChecklist.map((item) => (
                  <li key={item} className="text-xs text-ink-300 flex gap-2">
                    <span className="text-good shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Voiceover script output */}
          {output.voiceoverScript && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="label">{t(lang, 'video.voiceoverScript')}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-400 italic">
                    {output.voiceoverScript.suggestedVoice ?? 'default'}
                  </span>
                  <CopyButton text={output.voiceoverScript.text} lang={lang} />
                </div>
              </div>
              <pre className="text-xs font-mono text-ink-100 whitespace-pre-wrap break-words leading-relaxed bg-ink-900 rounded p-3">
                {output.voiceoverScript.text || '—'}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── ClipRow sub-component ─────────────────────────────────────────────────────

interface ClipRowProps {
  clip: VideoProjectClip
  clipIndex: number
  lang: Lang
  onUpdate: (patch: Partial<VideoProjectClip>) => void
  onRemove: () => void
}

function ClipRow({ clip, clipIndex, lang, onUpdate, onRemove }: ClipRowProps) {
  return (
    <div className="card flex flex-col sm:flex-row sm:items-start gap-3">
      {/* Drag handle (visual only for v1) */}
      <span className="text-ink-600 select-none cursor-grab text-lg leading-none mt-1 hidden sm:block" title="Drag to reorder (coming soon)">
        ≡
      </span>

      {/* Clip number */}
      <span className="text-xs text-ink-500 font-medium w-6 shrink-0 mt-0.5">
        {clipIndex + 1}.
      </span>

      {/* Recipe picker */}
      <div className="flex-1 min-w-0">
        <label className="text-[11px] text-ink-400 block mb-1">
          {t(lang, 'video.recipe')}
        </label>
        <select
          value={clip.recipeId}
          onChange={(e) => onUpdate({ recipeId: e.target.value })}
          className="w-full bg-ink-800 border border-ink-600 rounded px-2 py-1.5 text-xs text-ink-100 focus:outline-none focus:border-accent-500 transition-colors"
        >
          {ALL_VIDEO_RECIPES.map((r) => (
            <option key={r.id} value={r.id}>
              {loc(r, lang, 'name')}
            </option>
          ))}
        </select>
      </div>

      {/* Role picker */}
      <div className="sm:w-44">
        <label className="text-[11px] text-ink-400 block mb-1">
          {t(lang, 'video.clipRoleLabel')}
        </label>
        <div className="flex flex-wrap gap-1">
          {PROJECT_CLIP_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onUpdate({ clipRole: role })}
              className={
                'px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors border ' +
                (clip.clipRole === role
                  ? 'bg-accent-500 border-accent-500 text-white'
                  : 'bg-ink-700 border-ink-600 text-ink-400 hover:border-accent-500/60 hover:text-white')
              }
            >
              {t(lang, `video.clipRole.${role}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        title={t(lang, 'video.removeClip')}
        className="text-xs text-bad hover:text-bad/80 transition-colors mt-0.5 shrink-0"
      >
        ✕
      </button>
    </div>
  )
}
