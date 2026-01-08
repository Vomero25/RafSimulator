
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Shield, Lock, Info, TrendingUp, Wallet, CheckCircle2 } from 'lucide-react';
import { YearProjection, SimulationInputs } from '../types';
import { PRODUCT_RULES } from '../constants';
import ProductDetails from './ProductDetails';
import EstateProtection from './EstateProtection';

interface Props {
  projections: YearProjection[];
  inputs: SimulationInputs;
}

const ResultsDashboard: React.FC<Props> = ({ projections, inputs }) => {
  const [activeAuditYear, setActiveAuditYear] = useState<1 | 2>(1);
  
  // Reset dell'audit se la durata viene ridotta a 1 anno
  useEffect(() => {
    if (projections.length < 2 && activeAuditYear === 2) {
      setActiveAuditYear(1);
    }
  }, [projections.length, activeAuditYear]);

  const last = projections[projections.length - 1];
  const initial = Number(inputs.initialPremium);
  
  const totalValueAtEnd = last.totalValue;
  const growth = totalValueAtEnd - initial;
  const perc = (growth / initial) * 100;

  const annuityFactor = PRODUCT_RULES.ANNUITY_FACTORS[inputs.annuityOption];
  const estimatedAnnualAnnuity = totalValueAtEnd * annuityFactor;
  
  const formatEuro = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const formatEuroPrecise = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(val);

  // LOGICA DI AUDIT CERTIFICATA - ESTRATTA DIRETTAMENTE DAL MOTORE DI CALCOLO
  const auditData = (() => {
    const upfrontRate = inputs.isCampaignPeriod ? 0.01 : 0;
    const sacrificeRate = inputs.bonusSacrificeCF ? 0.01 : 0;
    const upfrontBonus = initial * upfrontRate;
    const sacrificeCF = initial * sacrificeRate;
    const totalInvested = initial + upfrontBonus + sacrificeCF;
    
    const gsPartStart = totalInvested * (inputs.gsPercentage / 100);
    const ulPartStart = totalInvested * (1 - (inputs.gsPercentage / 100));

    const yr1 = projections[0];
    const gsNetRate = inputs.estimatedGrowthGS - PRODUCT_RULES.GS_MANAGEMENT_FEE[inputs.cppClass];
    const ulNetRate = inputs.estimatedGrowthUnitLinked - PRODUCT_RULES.ANNUAL_MANAGEMENT_FEE[inputs.cppClass].first5;

    const yr2 = projections[1] || yr1;

    return {
      1: {
        opening: totalInvested,
        gsOpening: gsPartStart,
        ulOpening: ulPartStart,
        gsNetRate,
        ulNetRate,
        bonusRate: inputs.isCampaignPeriod ? 0.005 : 0,
        bonusAmount: inputs.isCampaignPeriod ? gsPartStart * 0.005 : 0,
        gsClosing: yr1.gsValue,
        ulClosing: yr1.unitLinkedValue,
        totalGross: yr1.totalValue,
        penaltyRate: PRODUCT_RULES.SURRENDER_PENALTIES[inputs.cppClass][0],
        penaltyAmount: yr1.totalValue - yr1.surrenderValue,
        surrenderValue: yr1.surrenderValue
      },
      2: {
        opening: yr1.totalValue,
        gsOpening: yr1.gsValue,
        ulOpening: yr1.unitLinkedValue,
        gsNetRate,
        ulNetRate, 
        bonusRate: inputs.isCampaignPeriod ? 0.010 : 0,
        bonusAmount: inputs.isCampaignPeriod ? gsPartStart * 0.010 : 0,
        gsClosing: yr2.gsValue,
        ulClosing: yr2.unitLinkedValue,
        totalGross: yr2.totalValue,
        penaltyRate: PRODUCT_RULES.SURRENDER_PENALTIES[inputs.cppClass][1],
        penaltyAmount: yr2.totalValue - yr2.surrenderValue,
        surrenderValue: yr2.surrenderValue
      }
    };
  })();

  const currentAudit = auditData[activeAuditYear];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capitale Finale</p>
          <p className="text-3xl font-black text-[#003399] tracking-tighter">{formatEuro(last.totalValue)}</p>
          <div className="mt-2 flex items-center gap-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">Proiettato</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance Netta</p>
          <p className="text-3xl font-black text-emerald-600 tracking-tighter">+{formatEuro(growth)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[9px] font-black text-emerald-500">+{perc.toFixed(1)}% ROI</span>
          </div>
        </div>
        
        <div className={`p-6 rounded-[2rem] border transition-all ${inputs.isCampaignPeriod ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-200/20' : 'bg-white border-slate-200 opacity-60'}`}>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Valore Bonus</p>
          <p className={`text-3xl font-black tracking-tighter ${inputs.isCampaignPeriod ? 'text-amber-700' : 'text-slate-400'}`}>
            {formatEuro(last.bonusAccumulated)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Info size={12} className="text-amber-600/60" />
            <span className="text-[9px] font-black text-amber-600/60 uppercase tracking-tighter">Bonus Certificati</span>
          </div>
        </div>

        <div className="bg-[#003399] p-6 rounded-[2rem] border border-blue-900 shadow-xl shadow-blue-900/10">
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Rendita Stimata</p>
          <p className="text-3xl font-black text-white tracking-tighter">{formatEuro(estimatedAnnualAnnuity)}</p>
          <div className="mt-2 flex items-center gap-2">
            <Wallet size={12} className="text-blue-200/50" />
            <span className="text-[9px] font-black text-blue-200/50 uppercase tracking-tighter">Quota annua lorda</span>
          </div>
        </div>
      </div>

      {/* DIMOSTRAZIONE ESPLICITA AUDIT - BLINDATA */}
      <div className="bg-white border-4 border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
               <Shield size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Certificazione Motore</h3>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mt-1">Audit Analitico Formule - Step by Step</p>
            </div>
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveAuditYear(1)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAuditYear === 1 ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Anno 1
            </button>
            <button 
              disabled={projections.length < 2}
              onClick={() => setActiveAuditYear(2)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAuditYear === 2 ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed'}`}
            >
              Anno 2
            </button>
          </div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-900 shadow-inner">{activeAuditYear === 1 ? '1' : '3'}</span>
                <h4 className="text-xs font-black uppercase tracking-widest">
                  {activeAuditYear === 1 ? 'Capitale Iniziale & Bonus' : 'Capitale di Partenza Anno 2'}
                </h4>
              </div>
              <div className="space-y-3 font-medium text-[11px] text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2 italic text-slate-400">
                  <span>{activeAuditYear === 1 ? 'Capitale Lordo Versato' : 'Valore Totale fine Anno 1'}</span>
                  <span>{formatEuroPrecise(activeAuditYear === 1 ? initial : projections[0].totalValue)}</span>
                </div>
                {activeAuditYear === 1 && (
                  <>
                    {inputs.isCampaignPeriod && (
                      <div className="flex justify-between border-b border-slate-100 pb-2 text-emerald-600">
                        <span>+ Bonus Upfront (1%)</span>
                        <span className="font-black">+{formatEuroPrecise(initial * 0.01)}</span>
                      </div>
                    )}
                    {inputs.bonusSacrificeCF && (
                      <div className="flex justify-between border-b border-slate-100 pb-2 text-emerald-600">
                        <span>+ Bonus Sacrificio CF (1%)</span>
                        <span className="font-black">+{formatEuroPrecise(initial * 0.01)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between pt-2">
                  <span className="font-black uppercase text-slate-400">{activeAuditYear === 1 ? 'Totale Investito Netto' : 'Base di Calcolo Anno 2'}</span>
                  <span className="text-base font-black text-slate-900">{formatEuroPrecise(currentAudit.opening)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm">
                  <span className="text-[9px] font-black text-emerald-600 uppercase">Allocato GS ({inputs.gsPercentage}%)</span>
                  <p className="text-lg font-black text-emerald-700">{formatEuro(currentAudit.gsOpening)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-3xl border border-blue-100 shadow-sm">
                  <span className="text-[9px] font-black text-blue-600 uppercase">Allocato UL ({100-inputs.gsPercentage}%)</span>
                  <p className="text-lg font-black text-blue-700">{formatEuro(currentAudit.ulOpening)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-4 mb-2">
                <span className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-900 shadow-inner">{activeAuditYear === 1 ? '2' : '4'}</span>
                <h4 className="text-xs font-black uppercase tracking-widest">Performance & Bonus Ricorrenti</h4>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Gestione Separata (Trend)</p>
                    {activeAuditYear === 2 && <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase">Bonus raddoppiato</span>}
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 font-mono text-[10px] space-y-1 shadow-sm">
                    <div className="flex justify-between">
                      <span>Rendimento Netto (i - c)</span>
                      <span className="text-slate-900">{(currentAudit.gsNetRate*100).toFixed(2)}%</span>
                    </div>
                    {inputs.isCampaignPeriod && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>+ Bonus Ricorrente Anno {activeAuditYear}</span>
                        <span>+{(currentAudit.bonusRate*100).toFixed(1)}%</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-100 my-1"></div>
                    <div className="flex justify-between text-slate-900 font-black italic">
                      <span>Valore GS Finale Anno {activeAuditYear}</span>
                      <span>{formatEuro(currentAudit.gsClosing)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Unit-Linked (Linee)</p>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 font-mono text-[10px] space-y-1 shadow-sm">
                    <div className="flex justify-between">
                      <span>Rendimento Netto (i - c)</span>
                      <span className="text-slate-900">{(currentAudit.ulNetRate*100).toFixed(2)}%</span>
                    </div>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <div className="flex justify-between text-slate-900 font-black italic">
                      <span>Valore UL Finale Anno {activeAuditYear}</span>
                      <span>{formatEuro(currentAudit.ulClosing)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-10 text-white relative shadow-2xl overflow-hidden">
             <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 pointer-events-none"></div>
             <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                <div className="text-center md:text-left">
                  <span className="text-blue-300 font-black text-[10px] uppercase tracking-[0.4em]">Montante Lordo Anno {activeAuditYear}</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-black tracking-tighter">{formatEuro(currentAudit.totalGross)}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold tracking-tight">Capitale certificato post-costi e bonus</p>
                </div>
                <div className="flex-1 max-w-xs space-y-3">
                   <div className="flex justify-between text-[11px] font-bold border-b border-white/10 pb-1">
                      <span className="text-slate-400">Penale Riscatto</span>
                      <span className="text-red-400">{(currentAudit.penaltyRate * 100).toFixed(1)}%</span>
                   </div>
                   <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Importo Penale</span>
                      <span className="text-red-400">-{formatEuro(currentAudit.penaltyAmount)}</span>
                   </div>
                </div>
                <div className="text-center md:text-right border-l-0 md:border-l border-white/10 pl-0 md:pl-10">
                  <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.4em]">Valore di Riscatto Netto</span>
                  <p className="text-6xl font-black text-amber-400 tracking-tighter mt-2 drop-shadow-xl">
                    {formatEuro(currentAudit.surrenderValue)}
                  </p>
                </div>
             </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
             <Info size={14} />
             <p className="text-[9px] font-bold uppercase tracking-widest leading-none">
               {activeAuditYear === 1 
                 ? "L'anno 1 include i bonus upfront e il bonus ricorrente GS dello 0,5%."
                 : "L'anno 2 evidenzia il bonus ricorrente GS raddoppiato all'1,0% (Pag. 7 del fascicolo)."}
             </p>
          </div>
        </div>
      </div>

      {/* Evolution Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-[#003399] h-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Evoluzione del Patrimonio</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Andamento proiettato GS vs UL</p>
          </div>
          <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase">Valori Certificati</span>
             </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientGS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientUL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} tickFormatter={(val) => `€${Math.round(val/1000)}k`} />
              <Tooltip 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 0' }}
                labelStyle={{ fontSize: '12px', fontWeight: '900', color: '#1e293b', marginBottom: '8px', textTransform: 'uppercase' }}
                formatter={(val: number) => formatEuro(val)}
              />
              <Area type="monotone" dataKey="gsValue" name="Gestione Separata" stroke="#10b981" strokeWidth={3} fill="url(#gradientGS)" stackId="1" />
              <Area type="monotone" dataKey="unitLinkedValue" name="Unit-Linked" stroke="#3b82f6" strokeWidth={3} fill="url(#gradientUL)" stackId="1" />
              <ReferenceLine x={inputs.horizonYears} stroke="#94a3b8" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <EstateProtection />

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm relative">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Analisi Analitica Dettagliata</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-black text-slate-400 uppercase">Anno</th>
                <th className="px-4 py-4 font-black text-emerald-600 uppercase text-right">Lordo GS</th>
                <th className="px-4 py-4 font-black text-blue-600 uppercase text-right">Lordo UL</th>
                <th className="px-4 py-4 font-black text-slate-800 uppercase text-right">Tot. Lordo</th>
                <th className="px-4 py-4 font-black text-red-400 uppercase text-right">Penale %</th>
                <th className="px-6 py-4 font-black text-red-600 uppercase text-right bg-red-50/30">Val. Riscatto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-600">
              {projections.map((p) => {
                const penaltyRate = p.year <= PRODUCT_RULES.SURRENDER_PENALTIES[inputs.cppClass].length 
                  ? PRODUCT_RULES.SURRENDER_PENALTIES[inputs.cppClass][p.year-1] 
                  : 0;
                return (
                  <tr key={p.year} className={`hover:bg-slate-50 transition-all ${p.year === inputs.horizonYears ? 'bg-[#003399]/5' : ''}`}>
                    <td className="px-6 py-3 text-slate-400 uppercase font-black">ANNO {p.year}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatEuro(p.gsValue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatEuro(p.unitLinkedValue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-900">{formatEuro(p.totalValue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-red-400">{(penaltyRate * 100).toFixed(2)}%</td>
                    <td className="px-6 py-3 text-right tabular-nums text-red-600 font-black bg-red-50/20">{formatEuro(p.surrenderValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ProductDetails />
    </div>
  );
};

export default ResultsDashboard;
