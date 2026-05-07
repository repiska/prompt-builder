import { create } from 'zustand'
import { ALL_BLOCKS, findBlock } from '../data/blocks'
import { BUILTIN_RECIPES, findRecipe } from '../data/recipes'
import {
  type BlockType,
  type GenerationType,
  type MediaType,
  type Recipe,
  type RecipeBlockRef,
  type SlotValues,
  type VideoProject,
  type VideoProjectClip,
  type ReferenceImageDeclaration,
  BASE_FOR_GEN,
  REQUIRED_BLOCKS_BY_GEN,
} from '../lib/types'
import type { Lang } from '../lib/i18n'

type Mode = 'recipe' | 'block' | 'expert'
type VideoMode = 'single_clip' | 'project'

const STORAGE_KEY_STATE = 'pb.state.v1'
const STORAGE_KEY_CUSTOM = 'pb.custom_recipes.v1'

/** Slot data for one uploaded reference image. Null means no image for that slot. */
export interface ReferenceImageData {
  index: number
  dataUrl: string
  mimeType: string
  sizeBytes: number
  fileName: string
}

function buildDefaultProject(): VideoProject {
  return {
    id: 'default-project',
    name: 'Untitled project',
    sharedReferences: [],
    sharedIdentityDescriptor: '',
    sharedSeed: undefined,
    continuityLock: {},
    audioStrategy: 'silent_for_voiceover_overlay',
    voiceoverScript: { lang: 'en', text: '', suggestedVoice: 'default' },
    clips: [
      { id: 'c1', recipeId: 'VR_PDP_LOOP', clipRole: 'hook' },
    ],
    defaultAspectRatio: '9:16',
    defaultResolution: '1080p',
    defaultTier: 'generate',
  }
}

const DEFAULT_REFERENCE_IMAGES: ReferenceImageData[] = []

interface PersistedState {
  generation: GenerationType
  useCase?: string
  recipeId?: string
  recipe: Recipe
  mode: Mode
  expertOpen: Record<string, boolean>
  lang: Lang
  mediaType: MediaType
  videoMode: VideoMode
  videoProject: VideoProject
  videoProjectReferenceImages: ReferenceImageData[]
}

interface EditorState extends PersistedState {
  customRecipes: Recipe[]
  setGeneration: (g: GenerationType) => void
  setUseCase: (u: string | undefined) => void
  setRecipeId: (id: string) => void
  setMode: (m: Mode) => void
  setLang: (l: Lang) => void
  setMediaType: (mt: MediaType) => void
  toggleExpert: (key: string) => void
  setBlockId: (type: BlockType, id: string) => void
  removeBlock: (type: BlockType) => void
  addBlock: (type: BlockType, id: string) => void
  setSlotValue: (type: BlockType, slotId: string, value: unknown) => void
  resetSlots: (type: BlockType) => void
  saveCurrentAsCustom: (name: string) => Recipe
  deleteCustom: (id: string) => void
  importRecipe: (raw: string) => Recipe | null
  exportRecipe: () => string
  reset: () => void
  // Video project actions
  setVideoMode: (mode: VideoMode) => void
  updateVideoProject: (patch: Partial<VideoProject>) => void
  addProjectClip: (recipeId: string) => void
  removeProjectClip: (clipId: string) => void
  updateProjectClip: (clipId: string, patch: Partial<VideoProjectClip>) => void
  addProjectReference: (ref: ReferenceImageDeclaration) => void
  removeProjectReference: (index: number) => void
  updateProjectReference: (index: number, patch: Partial<ReferenceImageDeclaration>) => void
  setProjectReferenceImage: (index: number, payload: Omit<ReferenceImageData, 'index'> | null) => void
}

function pickFirstAvailableForBase(type: BlockType, base: string): string | undefined {
  const candidates = (
    [
      ...findCandidates(type, base),
    ]
  )
  return candidates[0]?.id
}

function findCandidates(type: BlockType, base: string): { id: string }[] {
  return ALL_BLOCKS
    .filter((b) => b.type === type)
    .filter((b) => {
      const compat = b.tags.compatible_with as string[] | undefined
      if (compat && compat.length > 0 && !compat.includes(base)) return false
      const incompat = b.tags.incompatible_with as string[] | undefined
      if (incompat && incompat.includes(base)) return false
      return true
    })
}

function freshRecipeFor(generation: GenerationType, fromRecipeId?: string): Recipe {
  const baseId = BASE_FOR_GEN[generation]
  if (fromRecipeId) {
    const found = findRecipe(fromRecipeId)
    if (found && found.base === baseId) return cloneRecipe(found)
  }
  // First default recipe for this base.
  const defaultR = BUILTIN_RECIPES.find((r) => r.base === baseId)
  if (defaultR) return cloneRecipe(defaultR)
  // Fallback: build minimal.
  const required = REQUIRED_BLOCKS_BY_GEN[generation]
  const blocks: RecipeBlockRef[] = required.map((t) => ({
    type: t,
    id: pickFirstAvailableForBase(t, baseId) ?? 'unknown',
    slots: {},
  }))
  return {
    id: 'CUSTOM_NEW',
    name: 'Custom',
    base: baseId,
    blocks,
    custom: true,
  }
}

function cloneRecipe(r: Recipe): Recipe {
  return JSON.parse(JSON.stringify(r))
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedState
    if (!parsed.recipe || !parsed.generation) return null
    return parsed
  } catch {
    return null
  }
}

function loadCustomRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM)
    if (!raw) return []
    const arr = JSON.parse(raw) as Recipe[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function stripCustom(state: EditorState): PersistedState {
  const {
    generation, useCase, recipeId, recipe, mode, expertOpen, lang, mediaType,
    videoMode, videoProject, videoProjectReferenceImages,
  } = state
  return {
    generation, useCase, recipeId, recipe, mode, expertOpen, lang, mediaType,
    videoMode, videoProject, videoProjectReferenceImages,
  }
}

function persistState(s: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(s))
  } catch {
    // ignore quota issues
  }
}

function persistCustom(list: Recipe[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(list))
  } catch {
    // ignore
  }
}

const persisted = loadPersistedState()
const initialGeneration: GenerationType = persisted?.generation ?? 'lifestyle'
const initialRecipe = persisted?.recipe ?? freshRecipeFor(initialGeneration, 'LIF_EVE_RESTAURANT')

function detectInitialLang(): Lang {
  if (typeof navigator !== 'undefined') {
    const code = (navigator.language || 'en').toLowerCase()
    if (code.startsWith('ru') || code.startsWith('uk') || code.startsWith('be') || code.startsWith('kk')) return 'ru'
  }
  return 'en'
}

const initial: PersistedState = persisted ?? {
  generation: initialGeneration,
  useCase: 'UC1',
  recipeId: 'LIF_EVE_RESTAURANT',
  recipe: initialRecipe,
  mode: 'recipe',
  expertOpen: {},
  lang: detectInitialLang(),
  mediaType: 'photo',
  videoMode: 'single_clip',
  videoProject: buildDefaultProject(),
  videoProjectReferenceImages: DEFAULT_REFERENCE_IMAGES,
}
if (!persisted?.lang) {
  initial.lang = persisted?.lang ?? detectInitialLang()
}
if (!persisted?.mediaType) {
  initial.mediaType = 'photo'
}
// Migration: add videoMode / videoProject / videoProjectReferenceImages if missing from persisted state
if (!initial.videoMode) {
  initial.videoMode = 'single_clip'
}
if (!initial.videoProject) {
  initial.videoProject = buildDefaultProject()
}
if (!initial.videoProjectReferenceImages) {
  initial.videoProjectReferenceImages = DEFAULT_REFERENCE_IMAGES
} else {
  // Migration: old persisted state may have been a 3-slot nullable tuple — compact to dense array
  initial.videoProjectReferenceImages = (initial.videoProjectReferenceImages as (ReferenceImageData | null)[]).filter(
    (img): img is ReferenceImageData => img !== null
  )
}

export const useEditor = create<EditorState>((set, get) => ({
  ...initial,
  customRecipes: loadCustomRecipes(),

  setGeneration: (g) => {
    const recipe = freshRecipeFor(g)
    const next = {
      ...get(),
      generation: g,
      useCase: undefined,
      recipeId: recipe.id,
      recipe,
      mode: 'recipe' as Mode,
      expertOpen: {},
    }
    set(next)
    persistState(next)
  },

  setUseCase: (u) => {
    set({ useCase: u })
    persistState(stripCustom(get()))
  },

  setLang: (l) => {
    set({ lang: l })
    persistState(stripCustom(get()))
  },

  setMediaType: (mt) => {
    set({ mediaType: mt })
    persistState(stripCustom(get()))
  },

  setRecipeId: (id) => {
    const r =
      findRecipe(id) ?? get().customRecipes.find((c) => c.id === id)
    if (!r) return
    const recipe = cloneRecipe(r)
    const next = {
      ...get(),
      recipeId: id,
      recipe,
      generation:
        (Object.entries(BASE_FOR_GEN).find(([, base]) => base === recipe.base)?.[0] as GenerationType) ?? get().generation,
    }
    set(next)
    persistState({ ...next })
  },

  setMode: (m) => {
    set({ mode: m })
    persistState({ ...get() })
  },

  toggleExpert: (key) => {
    const next = { ...get().expertOpen, [key]: !get().expertOpen[key] }
    set({ expertOpen: next })
    persistState({ ...get(), expertOpen: next })
  },

  setBlockId: (type, id) => {
    const recipe = cloneRecipe(get().recipe)
    let entry = recipe.blocks.find((b) => b.type === type)
    if (!entry) {
      entry = { type, id, slots: {} }
      recipe.blocks.push(entry)
    } else {
      entry.id = id
      entry.slots = {}
    }
    recipe.id = recipe.custom ? recipe.id : recipe.id + ' (modified)'
    recipe.custom = true
    set({ recipe })
    persistState({ ...get(), recipe })
  },

  removeBlock: (type) => {
    const recipe = cloneRecipe(get().recipe)
    recipe.blocks = recipe.blocks.filter((b) => b.type !== type)
    recipe.custom = true
    set({ recipe })
    persistState({ ...get(), recipe })
  },

  addBlock: (type, id) => {
    const recipe = cloneRecipe(get().recipe)
    if (!recipe.blocks.some((b) => b.type === type)) {
      recipe.blocks.push({ type, id, slots: {} })
      recipe.custom = true
      set({ recipe })
      persistState({ ...get(), recipe })
    }
  },

  setSlotValue: (type, slotId, value) => {
    const recipe = cloneRecipe(get().recipe)
    const entry = recipe.blocks.find((b) => b.type === type)
    if (!entry) return
    const block = findBlock(type, entry.id)
    if (!block) return
    const slot = block.slots.find((s) => s.id === slotId)
    if (!slot) return
    const slots: SlotValues = { ...(entry.slots ?? {}) }
    slots[slotId] = value
    entry.slots = slots
    recipe.custom = true
    set({ recipe })
    persistState({ ...get(), recipe })
  },

  resetSlots: (type) => {
    const recipe = cloneRecipe(get().recipe)
    const entry = recipe.blocks.find((b) => b.type === type)
    if (!entry) return
    entry.slots = {}
    set({ recipe })
    persistState({ ...get(), recipe })
  },

  saveCurrentAsCustom: (name) => {
    const recipe = cloneRecipe(get().recipe)
    recipe.id = 'CUSTOM_' + Date.now().toString(36).toUpperCase()
    recipe.name = name
    recipe.custom = true
    const next = [...get().customRecipes, recipe]
    set({ customRecipes: next, recipeId: recipe.id, recipe })
    persistCustom(next)
    persistState({ ...stripCustom(get()), recipeId: recipe.id, recipe })
    return recipe
  },

  deleteCustom: (id) => {
    const next = get().customRecipes.filter((r) => r.id !== id)
    set({ customRecipes: next })
    persistCustom(next)
  },

  importRecipe: (raw) => {
    try {
      const parsed = JSON.parse(raw) as Recipe
      if (!parsed.base || !Array.isArray(parsed.blocks)) return null
      parsed.custom = true
      if (!parsed.id) parsed.id = 'IMPORTED_' + Date.now().toString(36).toUpperCase()
      const next = [...get().customRecipes, parsed]
      set({ customRecipes: next, recipeId: parsed.id, recipe: parsed })
      persistCustom(next)
      persistState({ ...stripCustom(get()), recipeId: parsed.id, recipe: parsed })
      return parsed
    } catch {
      return null
    }
  },

  exportRecipe: () => JSON.stringify(get().recipe, null, 2),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY_STATE)
    const recipe = freshRecipeFor('lifestyle', 'LIF_EVE_RESTAURANT')
    const next: PersistedState = {
      generation: 'lifestyle',
      useCase: 'UC1',
      recipeId: 'LIF_EVE_RESTAURANT',
      recipe,
      mode: 'recipe',
      expertOpen: {},
      lang: get().lang,
      mediaType: 'photo',
      videoMode: 'single_clip',
      videoProject: buildDefaultProject(),
      videoProjectReferenceImages: DEFAULT_REFERENCE_IMAGES,
    }
    set({ ...next })
    persistState(next)
  },

  // ── Video project actions ──────────────────────────────────────────────────

  setVideoMode: (mode) => {
    set({ videoMode: mode })
    persistState(stripCustom(get()))
  },

  updateVideoProject: (patch) => {
    const next = { ...get().videoProject, ...patch }
    set({ videoProject: next })
    persistState(stripCustom({ ...get(), videoProject: next }))
  },

  addProjectClip: (recipeId) => {
    const clips = get().videoProject.clips
    // Generate next id: find max numeric suffix and increment
    const maxN = clips.reduce((max, c) => {
      const m = c.id.match(/^c(\d+)$/)
      return m ? Math.max(max, parseInt(m[1], 10)) : max
    }, 0)
    const newClip: VideoProjectClip = {
      id: `c${maxN + 1}`,
      recipeId,
      clipRole: 'demo',
    }
    const next: VideoProject = { ...get().videoProject, clips: [...clips, newClip] }
    set({ videoProject: next })
    persistState(stripCustom({ ...get(), videoProject: next }))
  },

  removeProjectClip: (clipId) => {
    const next: VideoProject = {
      ...get().videoProject,
      clips: get().videoProject.clips.filter((c) => c.id !== clipId),
    }
    set({ videoProject: next })
    persistState(stripCustom({ ...get(), videoProject: next }))
  },

  updateProjectClip: (clipId, patch) => {
    const next: VideoProject = {
      ...get().videoProject,
      clips: get().videoProject.clips.map((c) =>
        c.id === clipId ? { ...c, ...patch } : c
      ),
    }
    set({ videoProject: next })
    persistState(stripCustom({ ...get(), videoProject: next }))
  },

  addProjectReference: (ref) => {
    const refs = get().videoProject.sharedReferences
    if (refs.length >= 3) return
    const next: VideoProject = {
      ...get().videoProject,
      sharedReferences: [...refs, ref],
    }
    set({ videoProject: next })
    persistState(stripCustom({ ...get(), videoProject: next }))
  },

  removeProjectReference: (index) => {
    const refs = [...get().videoProject.sharedReferences]
    refs.splice(index, 1)
    const next: VideoProject = { ...get().videoProject, sharedReferences: refs }
    // Keep images array dense and aligned: splice out the same index
    const imgs = [...get().videoProjectReferenceImages]
    imgs.splice(index, 1)
    set({ videoProject: next, videoProjectReferenceImages: imgs })
    persistState(stripCustom({ ...get(), videoProject: next, videoProjectReferenceImages: imgs }))
  },

  updateProjectReference: (index, patch) => {
    const refs = [...get().videoProject.sharedReferences]
    if (index < 0 || index >= refs.length) return
    refs[index] = { ...refs[index], ...patch }
    const next: VideoProject = { ...get().videoProject, sharedReferences: refs }
    set({ videoProject: next })
    persistState(stripCustom({ ...get(), videoProject: next }))
  },

  setProjectReferenceImage: (index, payload) => {
    const imgs = [...get().videoProjectReferenceImages]

    if (payload !== null) {
      // Storage limit guard: check total encoded size across all images
      const newEntry: ReferenceImageData = { index, ...payload }
      const testImgs = [...imgs]
      testImgs[index] = newEntry
      const totalEncodedBytes = testImgs.reduce((sum, img) => sum + img.dataUrl.length, 0)
      if (totalEncodedBytes > 4_500_000) {
        console.warn(
          `[editor] setProjectReferenceImage: Reference image total exceeds localStorage budget (encoded ${totalEncodedBytes} bytes > 4.5MB).`
        )
        return
      }
      imgs[index] = newEntry
    } else {
      // null payload: remove image and keep declaration in place (caller may follow with removeProjectReference)
      imgs.splice(index, 1)
    }

    set({ videoProjectReferenceImages: imgs })
    persistState(stripCustom({ ...get(), videoProjectReferenceImages: imgs }))
  },
}))
