
export enum CPPClass {
  A = 'CPP A',
  B = 'CPP B',
  C = 'CPP C'
}

export enum InvestmentLine {
  PRUDENTE = 'Prudente (Morgan Stanley)',
  MODERATA = 'Moderata (DWS)',
  BILANCIATA = 'Bilanciata ESG (Vontobel)',
  DINAMICA = 'Dinamica (Pictet)',
  CEDOLA = 'Obiettivo Cedola',
  LIBERA = 'Linea Libera'
}

export enum AnnuityType {
  VITALIZIA = 'Rendita annua vitalizia rivalutabile',
  CONTROASSICURATA = 'Vitalizia con controassicurazione',
  CERTA_5_10 = 'Vitalizia certa (5 o 10 anni)',
  REVERSIBILE = 'Vitalizia reversibile',
  CERTO_PERIODO = 'Rendita immediata periodo certo'
}

export interface SimulationInputs {
  initialPremium: number;
  horizonYears: number;
  age: number;
  cppClass: CPPClass;
  investmentLine: InvestmentLine;
  gsPercentage: number;
  isCampaignPeriod: boolean;
  bonusSacrificeCF: boolean;
  estimatedGrowthGS: number;
  estimatedGrowthUnitLinked: number;
  useVariableReturns: boolean;
  yearlyReturnsGS: number[];
  yearlyReturnsUL: number[];
  annuityOption: AnnuityType;
}

export interface YearProjection {
  year: number;
  gsValue: number;
  unitLinkedValue: number;
  totalValue: number;
  surrenderValue: number;
  deathBenefit: number;
  bonusAccumulated: number;
  appliedReturnGS: number;
  appliedReturnUL: number;
}
