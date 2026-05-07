import { useRef, useState } from 'react'
import type { ReferenceRole, ReferenceImageDeclaration } from '../lib/types'
import { t } from '../lib/i18n'
import type { Lang } from '../lib/i18n'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ReferenceImagePayload {
  dataUrl: string
  mimeType: string
  sizeBytes: number
  fileName: string
}

export interface ReferenceUploaderProps {
  index: 0 | 1 | 2
  declaration: ReferenceImageDeclaration | undefined
  imageData: ReferenceImagePayload | null
  onDeclarationChange: (decl: ReferenceImageDeclaration | undefined) => void
  onImageChange: (data: ReferenceImagePayload | null) => void
  lang: Lang
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACCEPTED_MIME = ['image/jpeg', 'image/png']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ROLE_KEYS: ReferenceRole[] = ['model', 'garment', 'location']

function roleLabel(role: ReferenceRole, lang: Lang): string {
  const key =
    role === 'model'
      ? 'video.referenceRoleModel'
      : role === 'garment'
      ? 'video.referenceRoleGarment'
      : 'video.referenceRoleLocation'
  return t(lang, key)
}

function descriptionPlaceholder(role: ReferenceRole, lang: Lang): string {
  const key =
    role === 'model'
      ? 'video.referenceDescriptionPlaceholderModel'
      : role === 'garment'
      ? 'video.referenceDescriptionPlaceholderGarment'
      : 'video.referenceDescriptionPlaceholderLocation'
  return t(lang, key)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReferenceUploader({
  index,
  declaration,
  imageData,
  onDeclarationChange,
  onImageChange,
  lang,
}: ReferenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    setError(null)
    if (!ACCEPTED_MIME.includes(file.type)) {
      setError(t(lang, 'video.referenceFormatError'))
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(t(lang, 'video.referenceTooLargeError'))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onImageChange({ dataUrl, mimeType: file.type, sizeBytes: file.size, fileName: file.name })
      // Auto-fill a default declaration if none exists yet
      if (!declaration) {
        onDeclarationChange({ role: 'model', description: '' })
      }
    }
    reader.readAsDataURL(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected after removal
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleRemove() {
    setError(null)
    onImageChange(null)
    onDeclarationChange(undefined)
  }

  function handleRoleChange(role: ReferenceRole) {
    onDeclarationChange({ role, description: declaration?.description ?? '' })
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onDeclarationChange({ role: declaration?.role ?? 'model', description: e.target.value })
  }

  const slotLabel = `#${index + 1}`
  const currentRole: ReferenceRole = declaration?.role ?? 'model'

  return (
    <div className="card flex flex-col gap-3 min-w-0">
      {/* Slot header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-300 uppercase tracking-wider">
          {slotLabel}
        </span>
        {imageData && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-bad hover:text-bad/80 transition-colors"
          >
            {t(lang, 'video.referenceRemove')}
          </button>
        )}
      </div>

      {/* Thumbnail / drop zone */}
      {imageData ? (
        <div className="relative rounded overflow-hidden bg-ink-800 aspect-square">
          <img
            src={imageData.dataUrl}
            alt={imageData.fileName}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-ink-900/80 px-2 py-1 text-[10px] text-ink-300 truncate">
            {imageData.fileName} · {formatSize(imageData.sizeBytes)}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={
            'aspect-square rounded border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ' +
            (dragging
              ? 'border-accent-500 bg-accent-500/10'
              : 'border-ink-600 bg-ink-800 hover:border-accent-500/60 hover:bg-ink-700')
          }
        >
          <span className="text-2xl text-ink-500 select-none">+</span>
          <span className="text-[11px] text-ink-400 text-center px-2 leading-tight">
            {t(lang, 'video.referenceUpload')}
          </span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Error */}
      {error && (
        <p className="text-[11px] text-bad leading-tight">{error}</p>
      )}

      {/* Role picker — only shown when we have a declaration */}
      {declaration && (
        <>
          <div className="flex gap-1 flex-wrap">
            {ROLE_KEYS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={
                  'px-2 py-0.5 rounded text-xs font-medium transition-colors border ' +
                  (currentRole === role
                    ? 'bg-accent-500 border-accent-500 text-white'
                    : 'bg-ink-700 border-ink-600 text-ink-300 hover:border-accent-500/60 hover:text-white')
                }
              >
                {roleLabel(role, lang)}
              </button>
            ))}
          </div>

          {/* Description textarea */}
          <textarea
            rows={2}
            value={declaration.description}
            onChange={handleDescriptionChange}
            placeholder={descriptionPlaceholder(currentRole, lang)}
            className="w-full bg-ink-800 border border-ink-600 rounded px-2 py-1.5 text-xs text-ink-100 placeholder-ink-500 resize-none focus:outline-none focus:border-accent-500 transition-colors"
          />

          {/* TODO: add poseHint when types support it */}
        </>
      )}
    </div>
  )
}
