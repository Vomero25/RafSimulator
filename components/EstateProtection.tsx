
import React from 'react';

const EstateProtection: React.FC = () => {
  const benefits = [
    {
      title: "Impignorabilità e Insequestrabilità",
      description: "Le somme dovute dalla compagnia non possono essere sottoposte ad azione esecutiva o cautelare, garantendo uno scudo patrimoniale per il contraente e i beneficiari (nei limiti previsti dalla legge).",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Esenzione Imposta di Successione",
      description: "Il capitale liquidato ai beneficiari in caso di decesso dell'assicurato è esente dall'imposta di successione, favorendo il passaggio generazionale del patrimonio.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Fuori dall'Asse Ereditario",
      description: "L'indennizzo assicurativo non rientra nella massa ereditaria; i beneficiari possono essere designati liberamente, anche al di fuori della cerchia degli eredi legittimi.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Ottimizzazione Fiscale (Tobin Tax & Bollo)",
      description: "Le polizze multiramo godono del differimento della tassazione sulle plusvalenze fino al momento del riscatto e l'esenzione dall'imposta di bollo sulla componente in Gestione Separata.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
      <div className="mb-10">
        <h3 className="text-[12px] font-black text-[#003399] uppercase tracking-[0.3em] mb-2">Vantaggi Esclusivi</h3>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tutela Patrimoniale e Successoria</h2>
        <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
          La struttura assicurativa di MultInvest Plus offre protezioni giuridiche e fiscali uniche che trasformano l'investimento in un sofisticato strumento di pianificazione patrimoniale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex gap-5 p-6 rounded-3xl hover:bg-slate-50 transition-colors group">
            <div className="shrink-0 w-12 h-12 bg-[#003399]/5 text-[#003399] rounded-2xl flex items-center justify-center group-hover:bg-[#003399] group-hover:text-white transition-all duration-500">
              {benefit.icon}
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">{benefit.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight opacity-80">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-slate-900 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <p className="relative z-10 text-[10px] font-black text-blue-200 uppercase tracking-widest">
          Strumento fondamentale per la protezione dei capitali e il passaggio generazionale
        </p>
      </div>
    </div>
  );
};

export default EstateProtection;
