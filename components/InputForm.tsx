
import React from 'react';
import { SimulationInputs, CPPClass, InvestmentLine, AnnuityType } from '../types';

interface Props {
  inputs: SimulationInputs;
  setInputs: React.Dispatch<React.SetStateAction<SimulationInputs>>;
}

const InputForm: React.FC<Props> = ({ inputs, setInputs }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // FORZATURA NUMERICA: Evita che i valori degli slider vengano trattati come stringhe
    // causando concatenazioni errate (es. "100000" + 2000 = "1000002000")
    const isNumericField = type === 'number' || type === 'range' || name === 'initialPremium' || name === 'horizonYears' || name === 'age';
    
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               isNumericField ? parseFloat(value) : value
    }));
  };

  const handleYearlyReturnChange = (type: 'GS' | 'UL', index: number, value: string) => {
    const numValue = (parseFloat(value) || 0) / 100;
    setInputs(prev => {
      const newArray = type === 'GS' ? [...prev.yearlyReturnsGS] : [...prev.yearlyReturnsUL];
      newArray[index] = numValue;
      return {
        ...prev,
        [type === 'GS' ? 'yearlyReturnsGS' : 'yearlyReturnsUL']: newArray
      };
    });
  };

  const resetReturnsToFlat = () => {
    setInputs(prev => ({
      ...prev,
      yearlyReturnsGS: prev.yearlyReturnsGS.map(() => prev.estimatedGrowthGS),
      yearlyReturnsUL: prev.yearlyReturnsUL.map(() => prev.estimatedGrowthUnitLinked)
    }));
  };

  const maxGS = inputs.isCampaignPeriod ? 90 : 40;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col h-full lg:max-h-[calc(100vh-140px)]">
      <div className="p-6 border-b border-slate-100 shrink-0">
        <h3 className="text-[11px] font-black text-[#003399] uppercase tracking-[0.2em]">Configurazione Simulazione</h3>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
        {/* Parametri Principali */}
        <section className="space-y-6">
          <div>
            <label className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">
              Capitale da Investire
              <span className="text-slate-900 text-xs">€ {Number(inputs.initialPremium).toLocaleString()}</span>
            </label>
            <input 
              type="range" name="initialPremium" min="15000" max="1000000" step="5000"
              value={inputs.initialPremium} onChange={handleChange}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#003399]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Durata Anni</label>
                <input 
                  type="number" name="horizonYears" min="1" max="30"
                  value={inputs.horizonYears} onChange={handleChange}
                  className="w-full bg-transparent text-sm font-black text-[#003399] outline-none"
                />
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Età Cliente</label>
                <input type="number" name="age" value={inputs.age} onChange={handleChange} className="w-full bg-transparent text-sm font-black text-slate-700 outline-none" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Classe CPP</label>
              <select name="cppClass" value={inputs.cppClass} onChange={handleChange} className="w-full bg-transparent text-[11px] font-black text-slate-700 outline-none">
                {Object.values(CPPClass).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Asset Strategico</label>
              <select name="investmentLine" value={inputs.investmentLine} onChange={handleChange} className="w-full bg-transparent text-[11px] font-black text-slate-700 outline-none truncate">
                {Object.values(InvestmentLine).map(line => <option key={line} value={line}>{line}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Opzione Rendita */}
        <section className="pt-4 border-t border-slate-100 space-y-6">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Opzioni a Scadenza</h4>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Opzione Rendita</label>
            <select name="annuityOption" value={inputs.annuityOption} onChange={handleChange} className="w-full bg-transparent text-[11px] font-black text-slate-700 outline-none">
              {Object.values(AnnuityType).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </section>

        {/* Rendimenti Variabili */}
        <section className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-5">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Profiles</h4>
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-600 uppercase">Variable</span>
                <button 
                  onClick={() => setInputs(prev => ({ ...prev, useVariableReturns: !prev.useVariableReturns }))}
                  className={`w-10 h-5 rounded-full transition-all relative ${inputs.useVariableReturns ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${inputs.useVariableReturns ? 'translate-x-5' : ''}`}></div>
                </button>
             </div>
          </div>

          {!inputs.useVariableReturns ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <label className="flex justify-between text-[9px] font-black text-emerald-600 mb-2 uppercase">
                  Gestione Separata
                  <span className="text-xs">{(inputs.estimatedGrowthGS * 100).toFixed(2)}%</span>
                </label>
                <input 
                  type="range" min="-0.02" max="0.08" step="0.001"
                  value={inputs.estimatedGrowthGS}
                  onChange={(e) => setInputs(p => ({ ...p, estimatedGrowthGS: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <label className="flex justify-between text-[9px] font-black text-blue-600 mb-2 uppercase">
                  Unit Linked
                  <span className="text-xs">{(inputs.estimatedGrowthUnitLinked * 100).toFixed(1)}%</span>
                </label>
                <input 
                  type="range" min="-0.15" max="0.30" step="0.005"
                  value={inputs.estimatedGrowthUnitLinked}
                  onChange={(e) => setInputs(p => ({ ...p, estimatedGrowthUnitLinked: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1 mb-2">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Input % Yearly</p>
                <button onClick={resetReturnsToFlat} className="text-[8px] font-black text-blue-500 uppercase hover:text-blue-700 transition-colors">Reset to constant</button>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                {Array.from({ length: inputs.horizonYears }).map((_, i) => (
                  <div key={i} className="p-2 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col gap-1.5 hover:border-slate-300 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase text-center border-b border-slate-100 pb-1 mb-1">Anno {i+1}</span>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <input 
                          type="number" step="0.1"
                          value={(inputs.yearlyReturnsGS[i] * 100).toFixed(1)}
                          onChange={(e) => handleYearlyReturnChange('GS', i, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-1 py-1 text-[10px] font-black text-emerald-600 outline-none text-center shadow-sm focus:ring-1 focus:ring-emerald-400"
                        />
                        <span className="absolute -top-2 left-1 text-[6px] font-black text-emerald-500 bg-white px-0.5 uppercase tracking-tighter">GS</span>
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="number" step="0.1"
                          value={(inputs.yearlyReturnsUL[i] * 100).toFixed(1)}
                          onChange={(e) => handleYearlyReturnChange('UL', i, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-1 py-1 text-[10px] font-black text-blue-600 outline-none text-center shadow-sm focus:ring-1 focus:ring-blue-400"
                        />
                        <span className="absolute -top-2 left-1 text-[6px] font-black text-blue-500 bg-white px-0.5 uppercase tracking-tighter">UL</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Portfolio Balance & Special Bonuses */}
        <section className="pt-4 space-y-4 border-t border-slate-100">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Portfolio Rebalancing</h4>
            <div className="flex items-center justify-between text-[11px] font-black mb-3 px-1">
              <span className="text-emerald-600 uppercase">GS: {inputs.gsPercentage}%</span>
              <span className="text-blue-600 uppercase">UL: {100 - inputs.gsPercentage}%</span>
            </div>
            <input 
              type="range" min="10" max={maxGS} step="5"
              value={inputs.gsPercentage} 
              onChange={(e) => setInputs(p => ({...p, gsPercentage: parseInt(e.target.value)}))}
              className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <label className={`flex items-center justify-between cursor-pointer p-3.5 rounded-2xl border-2 transition-all ${inputs.isCampaignPeriod ? 'bg-amber-50 border-amber-200 ring-4 ring-amber-500/5' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-tight ${inputs.isCampaignPeriod ? 'text-amber-700' : 'text-slate-400'}`}>Promo Bonus Period</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Bonus Upfront & Ricorrenti</span>
              </div>
              <input 
                type="checkbox" name="isCampaignPeriod" checked={inputs.isCampaignPeriod} 
                onChange={handleChange} className="w-4 h-4 accent-amber-500"
              />
            </label>

            <div className="grid grid-cols-1 gap-3">
                <label className={`flex items-center justify-between cursor-pointer p-3.5 rounded-2xl border-2 transition-all ${inputs.bonusSacrificeCF ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-tight ${inputs.bonusSacrificeCF ? 'text-emerald-700' : 'text-slate-400'}`}>Bonus Sacrifice CF</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">+1% Unatantum (Sacrificio CF)</span>
                    </div>
                    <input 
                    type="checkbox" name="bonusSacrificeCF" checked={inputs.bonusSacrificeCF} 
                    onChange={handleChange} className="w-4 h-4 accent-emerald-600"
                    />
                </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InputForm;
