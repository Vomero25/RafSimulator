
import { CPPClass, AnnuityType } from './types';

export const ZURICH_COLORS = {
  primary: '#003399',
  accent: '#a5d1ff',
  gs: '#22c55e',
  unitLinked: '#3b82f6',
};

export const PRODUCT_RULES = {
  MIN_PREMIUMS: {
    [CPPClass.A]: { initial: 15000, additional: 1200 },
    [CPPClass.B]: { initial: 15000, additional: 1200 },
    [CPPClass.C]: { initial: 250000, additional: 48000 },
  },
  GS_MAX_PERCENTAGE: {
    standard: 40,
    campaign: 90 // Pag. 6: fino al 90% in Zurich Trend
  },
  GS_MAX_TOTAL: 1000000,
  
  // MECCANISMO BONUS CAMPAGNA (Pag. 7)
  CAMPAIGN_BONUS_2026: {
    UPFRONT_ON_TOTAL: 0.01,    // 1% sull'intero premio investito
    GS_RECURRING_YR1: 0.005,   // 0.5% sulla quota GS al termine del 1° anno
    GS_RECURRING_YR2: 0.010,   // 1.0% sulla quota GS al termine del 2° anno
  },

  // Commissioni di Gestione Annua Unit-Linked (Pag. 5)
  ANNUAL_MANAGEMENT_FEE: {
    [CPPClass.A]: { first5: 0.0295, after5: 0.0215 },
    [CPPClass.B]: { first5: 0.0215, after5: 0.0215 },
    [CPPClass.C]: { first5: 0.0170, after5: 0.0170 },
  },
  // Spesa gestione Gestione Separata Zurich Trend (Pag. 5)
  GS_MANAGEMENT_FEE: {
    [CPPClass.A]: 0.0150,
    [CPPClass.B]: 0.0110,
    [CPPClass.C]: 0.0090,
  },
  // Penalità di riscatto (Pag. 3) - Allineate alle classi A, B, C
  SURRENDER_PENALTIES: {
    [CPPClass.A]: [0.0400, 0.0350, 0.0275, 0.0150, 0.0100, 0],
    [CPPClass.B]: [0.0250, 0.0200, 0.0150, 0.0100, 0.0050, 0],
    [CPPClass.C]: [0.0200, 0.0150, 0.0100, 0.0070, 0.0050, 0],
  },
  // Incrementi per Caso Morte (Pag. 2)
  DEATH_BENEFIT_PERCENTAGE: (ageAtDeath: number) => {
    if (ageAtDeath <= 65) return 0.10;
    if (ageAtDeath <= 70) return 0.05;
    return 0.01;
  },
  ANNUITY_FACTORS: {
    [AnnuityType.VITALIZIA]: 0.040,
    [AnnuityType.REVERSIBILE]: 0.034,
    [AnnuityType.CERTA_5_10]: 0.038,
    [AnnuityType.CONTROASSICURATA]: 0.036,
    [AnnuityType.CERTO_PERIODO]: 0.035,
  }
};
