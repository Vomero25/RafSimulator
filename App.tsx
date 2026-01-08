
import React, { useState, useMemo, useEffect } from 'react';
import { 
  SimulationInputs, 
  CPPClass, 
  InvestmentLine,
  AnnuityType,
  YearProjection 
} from './types';
import { PRODUCT_RULES } from './constants';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<SimulationInputs>({
    initialPremium: 100000,
    horizonYears: 10,
    age: 50,
    cppClass: CPPClass.A,
    investmentLine: InvestmentLine.BILANCIATA,
    gsPercentage: 60,
    isCampaignPeriod: true,
    bonusSacrificeCF: false,
    estimatedGrowthGS: 0.0287,
    estimatedGrowthUnitLinked: 0.040,
    useVariableReturns: false,
    yearlyReturnsGS: Array(30).fill(0.0287),
    yearlyReturnsUL: Array(30).fill(0.040),
    annuityOption: AnnuityType.VITALIZIA
  });

  useEffect(() => {
    if (!inputs.useVariableReturns) {
      setInputs(prev => ({
        ...prev,
        yearlyReturnsGS: prev.yearlyReturnsGS.map(() => prev.estimatedGrowthGS),
        yearlyReturnsUL: prev.yearlyReturnsUL.map(() => prev.estimatedGrowthUnitLinked)
      }));
    }
  }, [inputs.estimatedGrowthGS, inputs.estimatedGrowthUnitLinked, inputs.useVariableReturns]);

  const projections = useMemo(() => {
    const results: YearProjection[] = [];
    
    let initialBonusRate = 0;
    if (inputs.isCampaignPeriod) {
      initialBonusRate += PRODUCT_RULES.CAMPAIGN_BONUS_2026.UPFRONT_ON_TOTAL;
    }
    
    // Bonus Sacrificio CF (Aggiuntivo +1% una tantum)
    if (inputs.bonusSacrificeCF) {
      initialBonusRate += 0.01;
    }

    const initialBonusAmount = inputs.initialPremium * initialBonusRate;
    const initialInvested = inputs.initialPremium + initialBonusAmount;
    
    let currentGS = initialInvested * (inputs.gsPercentage / 100);
    let currentUL = initialInvested * (1 - inputs.gsPercentage / 100);
    let totalBonusAccumulated = initialBonusAmount;

    const baseForRecurringGS = currentGS;

    for (let yr = 1; yr <= inputs.horizonYears; yr++) {
      const yrAge = inputs.age + yr;
      const idx = yr - 1;
      const yrReturnGS = inputs.useVariableReturns ? (inputs.yearlyReturnsGS[idx] ?? inputs.estimatedGrowthGS) : inputs.estimatedGrowthGS;
      const yrReturnUL = inputs.useVariableReturns ? (inputs.yearlyReturnsUL[idx] ?? inputs.estimatedGrowthUnitLinked) : inputs.estimatedGrowthUnitLinked;

      const ulFeeRate = yr <= 5 
        ? PRODUCT_RULES.ANNUAL_MANAGEMENT_FEE[inputs.cppClass].first5 
        : PRODUCT_RULES.ANNUAL_MANAGEMENT_FEE[inputs.cppClass].after5;
      const gsFeeRate = PRODUCT_RULES.GS_MANAGEMENT_FEE[inputs.cppClass];

      // LOGICA LINEARE: (1 + Rendimento - Costo)
      currentUL = currentUL * (1 + yrReturnUL - ulFeeRate);
      
      let yrRecurringBonus = 0;
      if (inputs.isCampaignPeriod) {
        if (yr === 1) yrRecurringBonus = baseForRecurringGS * PRODUCT_RULES.CAMPAIGN_BONUS_2026.GS_RECURRING_YR1;
        if (yr === 2) yrRecurringBonus = baseForRecurringGS * PRODUCT_RULES.CAMPAIGN_BONUS_2026.GS_RECURRING_YR2;
      }
      totalBonusAccumulated += yrRecurringBonus;

      currentGS = (currentGS * (1 + yrReturnGS - gsFeeRate)) + yrRecurringBonus;

      const totalValue = currentGS + currentUL;
      const penaltyTable = PRODUCT_RULES.SURRENDER_PENALTIES[inputs.cppClass];
      const penaltyRate = yr <= penaltyTable.length ? penaltyTable[yr - 1] : 0;
      
      const deathIncPerc = PRODUCT_RULES.DEATH_BENEFIT_PERCENTAGE(yrAge);
      const cappedIncrement = Math.min(totalValue * deathIncPerc, 200000);
      const standardDeathBenefit = totalValue + cappedIncrement;
      
      let finalDeathBenefit = standardDeathBenefit;
      if (yr <= 5 && yrAge <= 70) {
        finalDeathBenefit = Math.max(inputs.initialPremium, standardDeathBenefit);
      }

      results.push({
        year: yr,
        gsValue: Math.round(currentGS),
        unitLinkedValue: Math.round(currentUL),
        totalValue: Math.round(totalValue),
        surrenderValue: Math.round(totalValue * (1 - penaltyRate)),
        deathBenefit: Math.round(finalDeathBenefit),
        bonusAccumulated: Math.round(totalBonusAccumulated),
        appliedReturnGS: yrReturnGS,
        appliedReturnUL: yrReturnUL,
      });
    }
    return results;
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-[#003399] selection:text-white">
      <header className="bg-[#003399] text-white shadow-xl sticky top-0 z-[60] border-b border-white/10 backdrop-blur-md bg-[#003399]/95">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#003399] font-black text-lg shadow-lg">Z</div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black leading-none tracking-tight">Zurich MultInvest Plus</h1>
              <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-0.5 opacity-80">Edizione Blindata v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-tighter">SISTEMA CONGELATO</span>
             </div>
             <span className="text-[10px] font-black bg-white/10 px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
               Materiale per uso Intermediari
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
            <InputForm inputs={inputs} setInputs={setInputs} />
          </aside>
          
          <section className="flex-1 min-w-0 w-full space-y-8">
            <ResultsDashboard inputs={inputs} projections={projections} />
          </section>
        </div>
      </main>

      <footer className="max-w-[1440px] mx-auto px-8 py-12 border-t border-slate-200 text-center opacity-40">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">Zurich Bank - Wealth Management</p>
      </footer>
    </div>
  );
};

export default App;
