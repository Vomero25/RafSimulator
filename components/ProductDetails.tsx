
import React from 'react';
import { PRODUCT_RULES } from '../constants';
import { CPPClass } from '../types';

const ProductDetails: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      {/* BONUS CAMPAGNA - FOCUS ESTETICO */}
      <div className="bg-[#003399] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-400 rounded-xl shadow-lg shadow-amber-400/20">
              <svg className="w-4 h-4 text-[#003399]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em]">Bonus Campagna 25/26</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-6 mb-6">
            <div>
              <p className="text-[9px] font-black text-blue-200 uppercase mb-2">Gestione Separata</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">2,50%</span>
                <span className="text-[10px] font-bold opacity-60">TOT.</span>
              </div>
              <p className="text-[8px] mt-2 opacity-50 font-bold uppercase">1% UP + 0.5% + 1%</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-blue-200 uppercase mb-2">Unit-Linked</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">1,00%</span>
                <span className="text-[10px] font-bold opacity-60">TOT.</span>
              </div>
              <p className="text-[8px] mt-2 opacity-50 font-bold uppercase">Bonus Upfront</p>
            </div>
          </div>
          
          <p className="text-[8px] font-bold uppercase text-blue-200/60 leading-relaxed">
            * Bonus riconosciuto sulla quota GS detenuta a 12 e 24 mesi, in assenza di riscatti.
          </p>
        </div>
      </div>

      {/* GRIGLIA COSTI (PAG 5) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Griglia Costi Gestione (Pag. 5)</h3>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Valori % Annui</span>
        </div>
        <div className="p-4">
          <table className="w-full text-[10px]">
            <thead className="text-slate-400 font-black uppercase">
              <tr className="border-b border-slate-50">
                <th className="px-4 py-3 text-left">Classe</th>
                <th className="px-4 py-3 text-center">Unit-Linked</th>
                <th className="px-4 py-3 text-center">GS Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-slate-600">
              {Object.values(CPPClass).map((cls) => (
                <tr key={cls} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-[#003399] font-black">{cls}</td>
                  <td className="px-4 py-3 text-center">
                    {(PRODUCT_RULES.ANNUAL_MANAGEMENT_FEE[cls].first5 * 100).toFixed(2)}%
                    {cls === CPPClass.A && <span className="block text-[7px] text-slate-400">(Rid. a 2.15% dopo 5 anni)</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {(PRODUCT_RULES.GS_MANAGEMENT_FEE[cls] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRIGLIA PENALI (PAG 3) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Penalità Riscatto (Pag. 3)</h3>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Applicate al capitale</span>
        </div>
        <div className="p-4">
          <table className="w-full text-[10px]">
            <thead className="text-slate-400 font-black uppercase">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left">Periodo</th>
                <th className="px-3 py-3 text-center bg-slate-50/50">Cl. A</th>
                <th className="px-3 py-3 text-center">Cl. B</th>
                <th className="px-3 py-3 text-center bg-slate-50/50">Cl. C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-slate-600">
              {[0, 1, 2, 3, 4].map((idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5">{idx + 1}° Anno</td>
                  <td className="px-3 py-2.5 text-center text-red-500 bg-slate-50/30">
                    {(PRODUCT_RULES.SURRENDER_PENALTIES[CPPClass.A][idx] * 100).toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {(PRODUCT_RULES.SURRENDER_PENALTIES[CPPClass.B][idx] * 100).toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5 text-center bg-slate-50/30">
                    {(PRODUCT_RULES.SURRENDER_PENALTIES[CPPClass.C][idx] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-50 text-emerald-700">
                <td className="px-4 py-3 font-black uppercase">Dal 6° Anno</td>
                <td className="text-center font-black" colSpan={3}>AZZERATE (0,00%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDITE (PAG 5) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#003399]/10 px-8 py-4 border-b border-[#003399]/10">
          <h3 className="text-[10px] font-black text-[#003399] uppercase tracking-[0.2em]">Opzioni Rendita (Pag. 5)</h3>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { t: 'Vitalizia', d: 'Finché l\'assicurato è in vita' },
            { t: 'Controassicurata', d: 'Restituzione residuo a eredi' },
            { t: 'Certa 5/10', d: 'Garantita per i primi anni' },
            { t: 'Reversibile', d: 'Continua su un beneficiario' }
          ].map((r, i) => (
            <div key={i} className="flex flex-col gap-1">
              <h4 className="text-[9px] font-black text-slate-800 uppercase leading-none">{r.t}</h4>
              <p className="text-[8px] text-slate-400 font-bold uppercase leading-tight">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
