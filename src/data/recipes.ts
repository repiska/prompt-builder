import type { Recipe } from '../lib/types'

const cat = (id: string, pose: string, camera: string, grade?: string): Recipe => ({
  id,
  name: `Catalog: ${id}`,
  use_case: 'UC1',
  base: 'catalog_base',
  blocks: [
    { type: 'POSE', id: pose, slots: {} },
    { type: 'LOCATION', id: 'L0', slots: {} },
    { type: 'CAMERA', id: camera, slots: {} },
    ...(grade ? [{ type: 'GRADE' as const, id: grade, slots: {} }] : []),
  ],
})

const lif = (
  id: string,
  name: string,
  uc: Recipe['use_case'],
  pose: string,
  loc: string,
  cam: string,
  grade?: string,
): Recipe => ({
  id,
  name,
  use_case: uc,
  base: 'lifestyle_base',
  blocks: [
    { type: 'POSE', id: pose, slots: {} },
    { type: 'LOCATION', id: loc, slots: {} },
    { type: 'CAMERA', id: cam, slots: {} },
    ...(grade ? [{ type: 'GRADE' as const, id: grade, slots: {} }] : []),
  ],
})

const ugc = (id: string, name: string, uc: Recipe['use_case'], scenario: string, grade?: string): Recipe => ({
  id,
  name,
  use_case: uc,
  base: 'ugc_base',
  blocks: [
    { type: 'UGC_SCENARIO', id: scenario, slots: {} },
    ...(grade ? [{ type: 'GRADE' as const, id: grade, slots: {} }] : []),
  ],
})

export const BUILTIN_RECIPES: Recipe[] = [
  cat('CAT_R1', 'P1', 'C1', 'G_CAT'),
  cat('CAT_R2', 'P2', 'C1', 'G_CAT'),
  cat('CAT_R3', 'P3', 'C1', 'G_CAT'),
  cat('CAT_R4', 'P4', 'C1', 'G_CAT'),
  cat('CAT_R5', 'P1', 'C2', 'G_CAT'),
  cat('CAT_R6', 'P1', 'C3', 'G_CAT'),

  lif('LIF_EVE_RESTAURANT', 'Lifestyle: Evening Restaurant', 'UC1', 'P6', 'L1m', 'C5', 'G_LIF_D'),
  lif('LIF_EVE_ROOFTOP', 'Lifestyle: Evening Rooftop', 'UC1', 'P7', 'L2m', 'C4', 'G_LIF_A'),
  lif('LIF_EVE_HOTEL_LOBBY', 'Lifestyle: Evening Hotel Lobby', 'UC1', 'P2', 'L8m', 'C6', 'G_LIF_D'),
  lif('LIF_EVE_GARDEN_PARTY', 'Lifestyle: Evening Garden Party', 'UC1', 'P9', 'L12m', 'C6', 'G_LIF_B'),

  lif('LIF_OFF_MODERN', 'Lifestyle: Modern Office', 'UC2', 'P11', 'L3m', 'C5', 'G_LIF_B'),
  lif('LIF_OFF_CAFE', 'Lifestyle: Business Café', 'UC2', 'P6', 'L4m', 'C5', 'G_LIF_B'),
  lif('LIF_OFF_STREET', 'Lifestyle: City Street (office)', 'UC2', 'P5', 'L9m', 'C4', 'G_LIF_B'),

  lif('LIF_SUM_MEDITERRANEAN', 'Lifestyle: Mediterranean Street', 'UC3', 'P5', 'L5m', 'C4', 'G_LIF_C'),
  lif('LIF_SUM_POOL', 'Lifestyle: Hotel Pool', 'UC3', 'P7', 'L6m', 'C5', 'G_LIF_C'),
  lif('LIF_SUM_VINEYARD', 'Lifestyle: Vineyard', 'UC3', 'P9', 'L11m', 'C5', 'G_LIF_A'),

  lif('LIF_CAS_PARK', 'Lifestyle: Urban Park', 'UC4', 'P5', 'L7m', 'C5', 'G_LIF_B'),
  lif('LIF_CAS_STREET', 'Lifestyle: City Street (casual)', 'UC4', 'P5', 'L9m', 'C4', 'G_LIF_B'),
  lif('LIF_CAS_MARKET', "Lifestyle: Farmer's Market", 'UC4', 'P6', 'L10m', 'C5', 'G_LIF_A'),

  ugc('UGC_EVE_A', 'UGC: Elevator selfie (evening)', 'UC1', 'U7'),
  ugc('UGC_EVE_B', 'UGC: Restaurant date night', 'UC1', 'U8'),
  ugc('UGC_EVE_C', 'UGC: Twirl movement (evening)', 'UC1', 'U10'),

  ugc('UGC_OFF_A', 'UGC: Office desk', 'UC2', 'U13'),
  ugc('UGC_OFF_B', 'UGC: Elevator selfie (office)', 'UC2', 'U7'),
  ugc('UGC_OFF_C', 'UGC: Friend POV outdoor', 'UC2', 'U3'),

  ugc('UGC_SUM_A', 'UGC: Pool / beach club', 'UC3', 'U12'),
  ugc('UGC_SUM_B', 'UGC: Walking candid', 'UC3', 'U6'),
  ugc('UGC_SUM_C', 'UGC: Twirl movement (summer)', 'UC3', 'U10'),

  ugc('UGC_CAS_A', 'UGC: Mirror selfie home', 'UC4', 'U1'),
  ugc('UGC_CAS_B', 'UGC: Walking candid', 'UC4', 'U6'),
  ugc('UGC_CAS_C', 'UGC: OOTD home', 'UC4', 'U5'),

  ugc('UGC_DETAIL', 'UGC: Detail close-up', 'UC1', 'U9'),
]

export function recipesForBase(baseId: string): Recipe[] {
  return BUILTIN_RECIPES.filter((r) => r.base === baseId)
}

export function recipesForUseCase(baseId: string, uc?: string): Recipe[] {
  return BUILTIN_RECIPES.filter((r) => r.base === baseId && (!uc || r.use_case === uc))
}

export function findRecipe(id: string): Recipe | undefined {
  return BUILTIN_RECIPES.find((r) => r.id === id)
}
