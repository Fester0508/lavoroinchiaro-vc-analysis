/* ============================================================
   DESIGN: Dark Intelligence Dashboard — Business Model Analysis
   Tutti i modelli di business in una pagina unica interattiva
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Cell, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter
} from "recharts";

// ─── Business Models Data ────────────────────────────────────────────────────

const businessModels = [
  {
    id: "model-1",
    name: "Freemium Puro",
    subtitle: "Analisi base gratuita illimitata, upsell a singola analisi premium",
    color: "#3B82F6",
    pricing: {
      free: "Illimitato (analisi base)",
      paid: "€4,99 per analisi completa",
      annual: "—"
    },
    ltv: 18.50,
    cac: 9,
    ratio: 2.06,
    breakeven_months: 18,
    year3_revenue: 524450,
    year3_users: 87500,
    churn_monthly: 0.08,
    conversion_free_to_paid: 0.15,
    retention_paid: 0.92,
    pros: ["Bassa barriera all'ingresso", "Massima acquisizione", "Semplice da capire"],
    cons: ["LTV basso", "Alto costo infra per free users", "Dipendente da conversion rate"],
    timeline: { mvp: 3, launch: 6, breakeven: 18 },
    notes: "Modello classico SaaS. Funziona se conversion free→paid ≥ 15%"
  },
  {
    id: "model-2",
    name: "Pay-Per-Error",
    subtitle: "Analisi base gratuita, paghi solo quando trovi anomalie (€3,99 per anomalia)",
    color: "#818CF8",
    pricing: {
      free: "Analisi base (senza anomalie)",
      paid: "€3,99 per ogni anomalia rilevata",
      annual: "—"
    },
    ltv: 24.75,
    cac: 9,
    ratio: 2.75,
    breakeven_months: 14,
    year3_revenue: 687500,
    year3_users: 125000,
    churn_monthly: 0.06,
    conversion_free_to_paid: 0.35,
    retention_paid: 0.88,
    pros: ["Razionale di pricing trasparente", "Conversion rate più alta", "Utente paga solo se valore reale"],
    cons: ["Revenue volatile (dipende da anomalie trovate)", "Difficile da prevedere", "Basso LTV"],
    timeline: { mvp: 4, launch: 7, breakeven: 14 },
    notes: "Modello 'pay-for-value'. Richiede algoritmo di rilevamento anomalie molto accurato"
  },
  {
    id: "model-3",
    name: "Abbonamento Ultra-Low (€0,99/mese)",
    subtitle: "€0,99/mese per accesso illimitato a tutte le analisi, senza limiti",
    color: "#10B981",
    pricing: {
      free: "—",
      paid: "€0,99/mese (€11,88/anno)",
      annual: "€9,99/anno (sconto 16%)"
    },
    ltv: 95.04,
    cac: 9,
    ratio: 10.56,
    breakeven_months: 3,
    year3_revenue: 1687500,
    year3_users: 250000,
    churn_monthly: 0.04,
    conversion_free_to_paid: 0.45,
    retention_paid: 0.96,
    pros: ["LTV altissimo", "Break-even rapidissimo (3 mesi)", "Massima retention", "Pricing psicologicamente irresistibile"],
    cons: ["Margine lordo molto basso (AI cost ~€0,50/utente)", "Richiede scala massiva", "Difficile da monetizzare ulteriormente"],
    timeline: { mvp: 3, launch: 5, breakeven: 3 },
    notes: "Modello volume-based. Funziona solo con CAC molto basso (SEO organico) e margine lordo ≥ 50%"
  },
  {
    id: "model-4",
    name: "Freemium + Abbonamento Annuale",
    subtitle: "Analisi base gratuita, abbonamento €29,99/anno con alert automatici e storico",
    color: "#F59E0B",
    pricing: {
      free: "1 analisi/mese (base)",
      paid: "€29,99/anno (12 analisi + alert)",
      annual: "€29,99/anno"
    },
    ltv: 29.99,
    cac: 9,
    ratio: 3.33,
    breakeven_months: 12,
    year3_revenue: 749850,
    year3_users: 62500,
    churn_monthly: 0.05,
    conversion_free_to_paid: 0.25,
    retention_paid: 0.95,
    pros: ["LTV moderato ma stabile", "Retention alta", "Prevedibilità revenue", "Modello SaaS classico"],
    cons: ["Meno utenti totali", "Conversion rate bassa (25%)", "Richiede valore aggiunto (alert)"],
    timeline: { mvp: 4, launch: 6, breakeven: 12 },
    notes: "Modello SaaS tradizionale. Equilibrio tra acquisizione e monetizzazione"
  },
  {
    id: "model-5",
    name: "Pro con Chatbot (€9,99/mese)",
    subtitle: "Versione Pro: analisi illimitata + chatbot diritto del lavoro 24/7 + report PDF",
    color: "#EC4899",
    pricing: {
      free: "Analisi base (1/mese)",
      paid: "€9,99/mese (€99,99/anno) Pro con chatbot",
      annual: "€99,99/anno (sconto 17%)"
    },
    ltv: 119.88,
    cac: 15,
    ratio: 7.99,
    breakeven_months: 6,
    year3_revenue: 1349550,
    year3_users: 37500,
    churn_monthly: 0.03,
    conversion_free_to_paid: 0.12,
    retention_paid: 0.97,
    pros: ["LTV altissimo", "Differenziazione forte (chatbot)", "Retention massima", "Upsell naturale"],
    cons: ["CAC più alto (chatbot richiede marketing)", "Conversion rate bassa", "Costo AI chatbot elevato (~€1,50/utente/mese)"],
    timeline: { mvp: 8, launch: 12, breakeven: 6 },
    notes: "Modello premium. Richiede chatbot specializzato in diritto del lavoro (costo ~€50K sviluppo)"
  },
  {
    id: "model-6",
    name: "Ibrido: Freemium + Pay-Per + Pro",
    subtitle: "Tre tier: Free (base), Pay-Per-Error (€3,99), Pro con chatbot (€9,99/mese)",
    color: "#06B6D4",
    pricing: {
      free: "Analisi base illimitata",
      paid: "€3,99 per anomalia + €9,99/mese Pro",
      annual: "€99,99/anno Pro"
    },
    ltv: 67.50,
    cac: 10,
    ratio: 6.75,
    breakeven_months: 8,
    year3_revenue: 1124700,
    year3_users: 156250,
    churn_monthly: 0.05,
    conversion_free_to_paid: 0.28,
    retention_paid: 0.94,
    pros: ["Massima flessibilità", "Cattura tutti i segmenti", "LTV medio-alto", "Opzioni di upgrade"],
    cons: ["Complesso da gestire", "Confusione pricing", "Richiede analytics sofisticato"],
    timeline: { mvp: 6, launch: 9, breakeven: 8 },
    notes: "Modello complesso ma potente. Richiede UX molto chiara per non confondere utenti"
  },
  {
    id: "model-7",
    name: "B2B2C: Partnership CAF/Sindacati",
    subtitle: "Integrazione con CAF e sindacati, loro lo vendono ai lavoratori con margine",
    color: "#8B5CF6",
    pricing: {
      free: "—",
      paid: "€5,99 al lavoratore (CAF/sindacato prende €2, Lavoroinchiaro €3,99)",
      annual: "—"
    },
    ltv: 39.90,
    cac: 0.50,
    ratio: 79.8,
    breakeven_months: 1,
    year3_revenue: 2249400,
    year3_users: 375000,
    churn_monthly: 0.02,
    conversion_free_to_paid: 1.0,
    retention_paid: 0.98,
    pros: ["CAC quasi zero", "LTV massimo", "Distribuzione garantita", "Scalabilità rapida"],
    cons: ["Richiede partnership con CAF/sindacati", "Margine ridotto", "Dipendenza da partner", "Contrattazione difficile"],
    timeline: { mvp: 5, launch: 10, breakeven: 1 },
    notes: "Modello B2B2C. Richiede 3-6 mesi di negoziazione con CAF/sindacati"
  }
];

const sections = [
  { id: "hero", label: "Overview" },
  { id: "models-comparison", label: "1. Comparazione Modelli" },
  { id: "unit-economics", label: "2. Unit Economics" },
  { id: "timeline", label: "3. Timeline di Lancio" },
  { id: "retention", label: "4. Strategie di Retention" },
  { id: "chatbot", label: "5. Chatbot Diritto del Lavoro" },
  { id: "pricing-simulator", label: "6. Simulatore di Pricing" },
  { id: "recommendation", label: "7. Raccomandazione Finale" },
];

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1500 }: {
  value: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ type, children }: { type: "danger" | "warning" | "positive" | "neutral" | "info" | "correction" | "premium"; children: React.ReactNode }) {
  const styles = {
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    neutral: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    info: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
    correction: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
    premium: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium font-mono ${styles[type]}`}>
      {children}
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ number, title, subtitle, verdict }: {
  number: string; title: string; subtitle?: string;
  verdict?: { label: string; type: "danger" | "warning" | "positive" | "neutral" | "info" | "correction" | "premium" };
}) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-mono text-slate-500 mb-1 tracking-widest uppercase">{number}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h2>
          {subtitle && <p className="text-slate-400 mt-2 text-sm max-w-2xl">{subtitle}</p>}
        </div>
        {verdict && <Badge type={verdict.type}>{verdict.label}</Badge>}
      </div>
      <hr className="section-divider mt-6" />
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2 font-mono">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {prefix}{Number(p.value).toLocaleString("it-IT")}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedModels, setSelectedModels] = useState<string[]>(businessModels.map(m => m.id));
  const [navOpen, setNavOpen] = useState(false);
  const [simulatorInputs, setSimulatorInputs] = useState({
    cac: 9,
    conversion: 0.15,
    churn: 0.08,
    price: 4.99
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.15, rootMargin: "-80px 0px -60% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const selectedModelsData = businessModels.filter(m => selectedModels.includes(m.id));

  // Calcola metriche simulate
  const simulatedMetrics = {
    ltv: simulatorInputs.price * 12 / (1 - Math.pow(1 - simulatorInputs.churn, 12)),
    cac: simulatorInputs.cac,
    ratio: (simulatorInputs.price * 12 / (1 - Math.pow(1 - simulatorInputs.churn, 12))) / simulatorInputs.cac,
    breakeven: Math.ceil(simulatorInputs.cac / (simulatorInputs.price * simulatorInputs.conversion * (1 - simulatorInputs.churn)))
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* ── Sticky Top Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>BM</span>
            </div>
            <span className="font-semibold text-sm text-white hidden sm:block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lavoroinchiaro — Business Model Analysis
            </span>
            <span className="font-semibold text-sm text-white sm:hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lavoroinchiaro BM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge type="premium">7 Modelli</Badge>
            <Badge type="info">Completo</Badge>
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden bg-slate-800 border-t border-white/5 px-4 py-3 max-h-80 overflow-y-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`block w-full text-left py-2 px-3 rounded text-sm transition-colors ${
                  activeSection === s.id ? "text-blue-400 bg-blue-500/10" : "text-slate-400 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="flex pt-14">

        {/* ── Sidebar Nav (desktop) ── */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-white/5 bg-slate-900/50 py-6 px-3">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-left px-3 py-2 rounded text-xs transition-all mb-0.5 ${
                activeSection === s.id
                  ? "text-blue-400 bg-blue-500/10 font-medium"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {s.label}
            </button>
          ))}
          <div className="mt-auto pt-6 px-3">
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="text-slate-500">7 Modelli di Business</span><br />
              <span className="text-slate-600">Unit Economics Completi</span><br />
              <span className="font-mono text-slate-600">Febbraio 2026</span>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">

          {/* ═══════════════════════════════════════════════════════════
              HERO
          ═══════════════════════════════════════════════════════════ */}
          <section id="hero" className="relative overflow-hidden px-6 md:px-10 pt-16 pb-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl">
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Badge type="premium">7 Modelli di Business</Badge>
                <Badge type="info">Analisi Completa</Badge>
                <Badge type="positive">Tutti gli Scenari</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Lavoroinchiaro.it<br />
                <span className="gradient-text">Business Model Analysis</span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Analisi completa di 7 modelli di business alternativi con unit economics dettagliati,
                timeline di lancio, strategie di retention, e chatbot specializzato in diritto del lavoro.
                Scopri quale modello funziona meglio per scalare.
              </p>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Modelli Analizzati", value: "7", color: "blue" },
                  { label: "LTV Range", value: "€18-120", color: "emerald" },
                  { label: "Break-even Minimo", value: "1 mese", color: "amber" },
                  { label: "LTV/CAC Max", value: "79,8x", color: "pink" },
                ].map((kpi, i) => (
                  <div key={i} className={`bg-slate-800/80 border rounded-xl p-4 ${
                    kpi.color === "emerald" ? "border-emerald-500/30 glow-green" :
                    kpi.color === "amber" ? "border-amber-500/30" :
                    kpi.color === "pink" ? "border-pink-500/30" :
                    "border-blue-500/30 glow-blue"
                  }`}>
                    <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wide leading-tight">{kpi.label}</div>
                    <div className={`text-2xl font-bold font-mono ${
                      kpi.color === "emerald" ? "text-emerald-400" :
                      kpi.color === "amber" ? "text-amber-400" :
                      kpi.color === "pink" ? "text-pink-400" : "text-blue-400"
                    }`}>
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 max-w-3xl">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Analisi Completa</div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Questa analisi testa 7 modelli di business alternativi per Lavoroinchiaro.it,
                  dal freemium puro al pay-per-error, dall'abbonamento ultra-low-cost (€0,99/mese) al modello Pro con chatbot AI specializzato
                  in diritto del lavoro. Per ogni modello: unit economics completi (LTV, CAC, ratio, break-even),
                  timeline di lancio (MVP, launch, break-even), strategie di retention, e metriche di scalabilità.
                  L'obiettivo è identificare il modello più sostenibile che combina acquisizione rapida, retention alta, e LTV robusto.
                </p>
              </div>
            </div>
          </section>

          <div className="px-6 md:px-10 space-y-20 pb-20">

            {/* ═══════════════════════════════════════════════════════════
                1. COMPARAZIONE MODELLI
            ═══════════════════════════════════════════════════════════ */}
            <section id="models-comparison">
              <SectionHeader
                number="Sezione 01"
                title="Comparazione dei 7 Modelli"
                subtitle="Seleziona i modelli da confrontare. Ogni modello ha pricing, LTV, CAC, e timeline diversi."
                verdict={{ label: "Tutti gli Scenari", type: "positive" }}
              />

              {/* Model selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {businessModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedModels.includes(model.id)
                        ? "border-current bg-opacity-10"
                        : "border-white/10 bg-slate-800/40 opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: selectedModels.includes(model.id) ? model.color : "currentColor",
                      backgroundColor: selectedModels.includes(model.id) ? `${model.color}15` : "transparent"
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm" style={{ color: model.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {model.name}
                      </h3>
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(model.id)}
                        onChange={() => toggleModel(model.id)}
                        className="w-4 h-4 rounded"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{model.subtitle}</p>
                    <div className="text-xs font-mono" style={{ color: model.color }}>
                      LTV: €{model.ltv.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>

              {/* Comparison table */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Modello</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Pricing</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">LTV</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">CAC</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Ratio</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Break-even</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedModelsData.map((model, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-5 py-3 font-medium text-xs" style={{ color: model.color }}>
                            {model.name}
                          </td>
                          <td className="px-5 py-3 text-slate-400 text-xs text-center font-mono">
                            {model.pricing.paid}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-center" style={{ color: model.color }}>
                            €{model.ltv.toFixed(2)}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-center text-slate-400">
                            €{model.cac.toFixed(2)}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-center" style={{ color: model.ratio > 3 ? "#10B981" : model.ratio > 2 ? "#F59E0B" : "#EF4444" }}>
                            {model.ratio.toFixed(2)}x
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-center text-slate-400">
                            {model.breakeven_months} mesi
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Radar comparison */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Profilo dei Modelli Selezionati
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedModelsData.slice(0, 2).map((model) => (
                    <div key={model.id} className="bg-slate-700/40 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-3" style={{ color: model.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {model.name}
                      </h4>
                      <div className="space-y-2">
                        {[
                          { label: "LTV/CAC Ratio", value: model.ratio.toFixed(2) + "x", ok: model.ratio > 3 },
                          { label: "Break-even", value: model.breakeven_months + " mesi", ok: model.breakeven_months < 6 },
                          { label: "Churn Mensile", value: (model.churn_monthly * 100).toFixed(1) + "%", ok: model.churn_monthly < 0.08 },
                          { label: "Retention Paganti", value: (model.retention_paid * 100).toFixed(0) + "%", ok: model.retention_paid > 0.90 },
                          { label: "Year 3 Revenue", value: "€" + (model.year3_revenue / 1000).toFixed(0) + "K", ok: model.year3_revenue > 500000 },
                        ].map((metric, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">{metric.label}</span>
                            <span className={`font-mono font-bold ${metric.ok ? "text-emerald-400" : "text-amber-400"}`}>
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. UNIT ECONOMICS DETTAGLIATI
            ═══════════════════════════════════════════════════════════ */}
            <section id="unit-economics">
              <SectionHeader
                number="Sezione 02"
                title="Unit Economics Dettagliati"
                subtitle="LTV, CAC, ratio, break-even, churn, retention per ogni modello"
                verdict={{ label: "Analisi Completa", type: "neutral" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {selectedModelsData.slice(0, 2).map((model) => (
                  <div key={model.id} className="bg-slate-800/60 border border-white/10 rounded-xl p-6" style={{ borderTopColor: model.color, borderTopWidth: 2 }}>
                    <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: model.color }}>
                      {model.name}
                    </h3>

                    <div className="space-y-4">
                      {[
                        { label: "Prezzo Medio", value: model.pricing.paid, color: model.color },
                        { label: "LTV (Lifetime Value)", value: "€" + model.ltv.toFixed(2), color: model.color, note: "Valore totale generato da un cliente" },
                        { label: "CAC (Customer Acquisition Cost)", value: "€" + model.cac.toFixed(2), color: "slate", note: "Costo medio per acquisire un cliente" },
                        { label: "LTV/CAC Ratio", value: model.ratio.toFixed(2) + "x", color: model.ratio > 3 ? "emerald" : model.ratio > 2 ? "amber" : "red", note: "Soglia sostenibilità: 3x" },
                        { label: "Break-even Mesi", value: model.breakeven_months + " mesi", color: model.breakeven_months < 6 ? "emerald" : "amber", note: "Quando il cliente ripaga il CAC" },
                        { label: "Churn Mensile", value: (model.churn_monthly * 100).toFixed(1) + "%", color: "slate", note: "% clienti che cancellano ogni mese" },
                        { label: "Retention Paganti", value: (model.retention_paid * 100).toFixed(0) + "%", color: "slate", note: "% clienti che rimangono" },
                        { label: "Conv. Free→Paid", value: (model.conversion_free_to_paid * 100).toFixed(0) + "%", color: "slate", note: "Conversion rate dal free al paid" },
                      ].map((metric, i) => (
                        <div key={i} className="border-t border-white/5 pt-3 first:border-0 first:pt-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-slate-500">{metric.label}</span>
                            <span className="font-mono font-bold text-sm" style={{ color: metric.color === "slate" ? "#94A3B8" : metric.color === "emerald" ? "#10B981" : metric.color === "amber" ? "#F59E0B" : metric.color === "red" ? "#EF4444" : metric.color }}>
                              {metric.value}
                            </span>
                          </div>
                          {metric.note && <p className="text-xs text-slate-600">{metric.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Year 3 Revenue Comparison */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Revenue Proiettato — Anno 3
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedModelsData.map(m => ({
                      name: m.name,
                      revenue: m.year3_revenue,
                      color: m.color
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip prefix="€" suffix="" />} />
                      <Bar dataKey="revenue" radius={[3, 3, 0, 0]}>
                        {selectedModelsData.map((m, i) => (
                          <Cell key={i} fill={m.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. TIMELINE DI LANCIO
            ═══════════════════════════════════════════════════════════ */}
            <section id="timeline">
              <SectionHeader
                number="Sezione 03"
                title="Timeline di Lancio"
                subtitle="MVP → Launch → Break-even per ogni modello"
                verdict={{ label: "Tempi Realistici", type: "info" }}
              />

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {selectedModelsData.slice(0, 2).map((model) => (
                  <div key={model.id} className="bg-slate-800/60 border border-white/10 rounded-xl p-5" style={{ borderLeftColor: model.color, borderLeftWidth: 3 }}>
                    <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {model.name}
                    </h3>

                    <div className="space-y-3">
                      {[
                        { phase: "MVP", months: model.timeline.mvp, desc: "Prototipo funzionante con 5 CCNL" },
                        { phase: "Launch", months: model.timeline.launch, desc: "Prodotto live con marketing iniziale" },
                        { phase: "Break-even", months: model.timeline.breakeven, desc: "Profittabilità raggiunta" },
                      ].map((phase, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${model.color}30`, color: model.color }}>
                              {i + 1}
                            </div>
                            {i < 2 && <div className="w-0.5 h-8 bg-white/10 mt-1" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-sm text-white">{phase.phase}</span>
                              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${model.color}20`, color: model.color }}>
                                +{phase.months}m
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{phase.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs">
                        <span className="text-slate-500">Tempo totale a break-even: </span>
                        <span className="font-mono font-bold" style={{ color: model.color }}>
                          {model.timeline.breakeven} mesi ({Math.round(model.timeline.breakeven / 12 * 10) / 10} anni)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline comparison chart */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Confronto Timeline (mesi)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedModelsData.map(m => ({
                      name: m.name,
                      MVP: m.timeline.mvp,
                      Launch: m.timeline.launch - m.timeline.mvp,
                      "Break-even": m.timeline.breakeven - m.timeline.launch,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip suffix=" mesi" />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 11 }} />
                      <Bar dataKey="MVP" stackId="a" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Launch" stackId="a" fill="#818CF8" />
                      <Bar dataKey="Break-even" stackId="a" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. STRATEGIE DI RETENTION
            ═══════════════════════════════════════════════════════════ */}
            <section id="retention">
              <SectionHeader
                number="Sezione 04"
                title="Strategie di Retention per Ogni Modello"
                subtitle="Come mantenere i clienti e ridurre il churn"
                verdict={{ label: "Strategie Specifiche", type: "positive" }}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {selectedModelsData.map((model) => (
                  <div key={model.id} className="bg-slate-800/60 border border-white/10 rounded-xl p-5" style={{ borderTopColor: model.color, borderTopWidth: 2 }}>
                    <h3 className="font-semibold text-white text-sm mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: model.color }}>
                      {model.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs">
                        <span className="text-slate-500">Churn target: </span>
                        <span className="font-mono font-bold text-slate-300">{(model.churn_monthly * 100).toFixed(1)}%/mese</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500">Retention target: </span>
                        <span className="font-mono font-bold text-emerald-400">{(model.retention_paid * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {model.id === "model-1" && (
                        <>
                          <p className="text-xs text-slate-400">• Email alert anomalie rilevate</p>
                          <p className="text-xs text-slate-400">• Notifiche push: "Controlla il tuo cedolino"</p>
                          <p className="text-xs text-slate-400">• Referral program: invita amici, sconto 20%</p>
                          <p className="text-xs text-slate-400">• Upsell a €4,99 dopo 3 analisi free</p>
                        </>
                      )}
                      {model.id === "model-2" && (
                        <>
                          <p className="text-xs text-slate-400">• Notifiche instant quando anomalia rilevata</p>
                          <p className="text-xs text-slate-400">• Storico anomalie per tracking</p>
                          <p className="text-xs text-slate-400">• Upsell a abbonamento dopo 5 anomalie</p>
                          <p className="text-xs text-slate-400">• Community forum: condividi esperienze</p>
                        </>
                      )}
                      {model.id === "model-3" && (
                        <>
                          <p className="text-xs text-slate-400">• Alert mensile: "Controlla il tuo cedolino"</p>
                          <p className="text-xs text-slate-400">• Storico 3 anni di cedolini</p>
                          <p className="text-xs text-slate-400">• Chatbot 24/7 per domande CCNL</p>
                          <p className="text-xs text-slate-400">• Upsell a Pro con chatbot avanzato</p>
                        </>
                      )}
                      {model.id === "model-4" && (
                        <>
                          <p className="text-xs text-slate-400">• Alert automatici anomalie mensili</p>
                          <p className="text-xs text-slate-400">• Report PDF scaricabile</p>
                          <p className="text-xs text-slate-400">• Supporto email prioritario</p>
                          <p className="text-xs text-slate-400">• Upsell a Pro con chatbot</p>
                        </>
                      )}
                      {model.id === "model-5" && (
                        <>
                          <p className="text-xs text-slate-400">• Chatbot diritto del lavoro 24/7</p>
                          <p className="text-xs text-slate-400">• Alert anomalie + consulenza</p>
                          <p className="text-xs text-slate-400">• Community VIP con esperti</p>
                          <p className="text-xs text-slate-400">• Webinar mensili CCNL</p>
                        </>
                      )}
                      {model.id === "model-6" && (
                        <>
                          <p className="text-xs text-slate-400">• Multi-tier: upgrade naturale</p>
                          <p className="text-xs text-slate-400">• Alert anomalie per tutti</p>
                          <p className="text-xs text-slate-400">• Chatbot per Pro users</p>
                          <p className="text-xs text-slate-400">• Gamification: badge per attività</p>
                        </>
                      )}
                      {model.id === "model-7" && (
                        <>
                          <p className="text-xs text-slate-400">• Partnership CAF: supporto offline</p>
                          <p className="text-xs text-slate-400">• Integrazione con app CAF</p>
                          <p className="text-xs text-slate-400">• Alert anomalie + consulenza CAF</p>
                          <p className="text-xs text-slate-400">• Loyalty program CAF</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. CHATBOT DIRITTO DEL LAVORO
            ═══════════════════════════════════════════════════════════ */}
            <section id="chatbot">
              <SectionHeader
                number="Sezione 05"
                title="Chatbot Specializzato in Diritto del Lavoro"
                subtitle="Componente chiave per i modelli Pro e Ibrido"
                verdict={{ label: "Feature Differenziante", type: "premium" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Architettura del Chatbot
                  </h3>
                  <div className="space-y-3">
                    {[
                      { phase: "1. Knowledge Base", desc: "900+ CCNL + normativa lavoro italiana + giurisprudenza", cost: "€20K" },
                      { phase: "2. LLM Fine-tuning", desc: "GPT-4 specializzato su diritto del lavoro", cost: "€15K" },
                      { phase: "3. Retrieval Augmented Generation", desc: "Accesso real-time a CCNL e normativa", cost: "€10K" },
                      { phase: "4. Validation Layer", desc: "Risposta verificate da consulenti del lavoro", cost: "€25K" },
                      { phase: "5. Integration", desc: "Integrazione con piattaforma Lavoroinchiaro", cost: "€10K" },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 border-pink-500/30 pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-xs text-white">{item.phase}</span>
                          <span className="font-mono text-xs text-pink-400">{item.cost}</span>
                        </div>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs">
                      <span className="text-slate-500">Costo totale sviluppo: </span>
                      <span className="font-mono font-bold text-pink-400">€80K</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Timeline: 4-6 mesi</div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Capacità del Chatbot
                  </h3>
                  <div className="space-y-2">
                    {[
                      { q: "Qual è lo scatto di anzianità nel mio CCNL?", ok: true },
                      { q: "Mi spetta la tredicesima? Quando?", ok: true },
                      { q: "Posso rifiutare il lavoro straordinario?", ok: true },
                      { q: "Qual è il mio diritto a ferie e permessi?", ok: true },
                      { q: "Come calcolare il TFR?", ok: true },
                      { q: "Cosa fare se il cedolino è errato?", ok: true },
                      { q: "Posso fare causa al mio datore?", ok: false },
                      { q: "Mi serve un avvocato?", ok: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={item.ok ? "text-emerald-400" : "text-slate-500"}>{item.ok ? "✓" : "—"}</span>
                        <span className="text-slate-400">{item.q}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500">
                      <strong className="text-slate-400">Disclaimer:</strong> Il chatbot fornisce informazioni generali,
                      non consulenza legale. Per questioni legali complesse, consiglia di contattare un consulente del lavoro.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chatbot cost per model */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Costo Operativo del Chatbot per Utente (€/mese)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Freemium Puro", cost: 0, color: "#3B82F6" },
                      { name: "Pay-Per-Error", cost: 0, color: "#818CF8" },
                      { name: "Ultra-Low €0,99", cost: 0, color: "#10B981" },
                      { name: "Freemium Annual", cost: 0, color: "#F59E0B" },
                      { name: "Pro + Chatbot", cost: 1.50, color: "#EC4899" },
                      { name: "Ibrido", cost: 0.75, color: "#06B6D4" },
                      { name: "B2B2C", cost: 0.50, color: "#8B5CF6" },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 9 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `€${v.toFixed(2)}`} />
                      <Tooltip formatter={(v: any) => `€${v.toFixed(2)}`} contentStyle={{ background: "#1E293B", border: "1px solid #334155" }} />
                      <Bar dataKey="cost" radius={[3, 3, 0, 0]}>
                        {[
                          { color: "#3B82F6" }, { color: "#818CF8" }, { color: "#10B981" },
                          { color: "#F59E0B" }, { color: "#EC4899" }, { color: "#06B6D4" },
                          { color: "#8B5CF6" }
                        ].map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                6. SIMULATORE DI PRICING
            ═══════════════════════════════════════════════════════════ */}
            <section id="pricing-simulator">
              <SectionHeader
                number="Sezione 06"
                title="Simulatore di Pricing Interattivo"
                subtitle="Modifica i parametri e vedi come cambiano LTV, CAC, ratio e break-even"
                verdict={{ label: "Strumento Interattivo", type: "info" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Parametri Simulazione
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        label: "CAC (€)",
                        key: "cac",
                        min: 3,
                        max: 20,
                        step: 1,
                        note: "Costo per acquisire un cliente"
                      },
                      {
                        label: "Conversion Free→Paid (%)",
                        key: "conversion",
                        min: 0.05,
                        max: 0.50,
                        step: 0.05,
                        note: "% di free users che convertono a paid"
                      },
                      {
                        label: "Churn Mensile (%)",
                        key: "churn",
                        min: 0.02,
                        max: 0.15,
                        step: 0.01,
                        note: "% di clienti che cancellano ogni mese"
                      },
                      {
                        label: "Prezzo Medio (€/mese)",
                        key: "price",
                        min: 0.99,
                        max: 9.99,
                        step: 0.99,
                        note: "Prezzo medio per utente pagante"
                      }
                    ].map((param) => (
                      <div key={param.key}>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-semibold text-white">{param.label}</label>
                          <span className="font-mono text-sm font-bold text-blue-400">
                            {param.key === "conversion" || param.key === "churn"
                              ? (simulatorInputs[param.key as keyof typeof simulatorInputs] * 100).toFixed(1) + "%"
                              : "€" + (simulatorInputs[param.key as keyof typeof simulatorInputs] as number).toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={simulatorInputs[param.key as keyof typeof simulatorInputs]}
                          onChange={(e) => setSimulatorInputs({
                            ...simulatorInputs,
                            [param.key]: param.key === "conversion" || param.key === "churn"
                              ? parseFloat(e.target.value)
                              : parseFloat(e.target.value)
                          })}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((simulatorInputs[param.key as keyof typeof simulatorInputs] as number - param.min) / (param.max - param.min)) * 100}%, #334155 ${((simulatorInputs[param.key as keyof typeof simulatorInputs] as number - param.min) / (param.max - param.min)) * 100}%, #334155 100%)`
                          }}
                        />
                        <p className="text-xs text-slate-600 mt-1">{param.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Risultati Simulazione
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        label: "LTV (Lifetime Value)",
                        value: "€" + simulatedMetrics.ltv.toFixed(2),
                        color: "#3B82F6",
                        note: "Valore totale generato da un cliente"
                      },
                      {
                        label: "CAC (Customer Acquisition Cost)",
                        value: "€" + simulatedMetrics.cac.toFixed(2),
                        color: "#64748B",
                        note: "Costo per acquisire un cliente"
                      },
                      {
                        label: "LTV/CAC Ratio",
                        value: simulatedMetrics.ratio.toFixed(2) + "x",
                        color: simulatedMetrics.ratio > 3 ? "#10B981" : simulatedMetrics.ratio > 2 ? "#F59E0B" : "#EF4444",
                        note: "Soglia sostenibilità: 3x"
                      },
                      {
                        label: "Break-even (mesi)",
                        value: simulatedMetrics.breakeven + " mesi",
                        color: simulatedMetrics.breakeven < 6 ? "#10B981" : simulatedMetrics.breakeven < 12 ? "#F59E0B" : "#EF4444",
                        note: "Quando il cliente ripaga il CAC"
                      }
                    ].map((metric, i) => (
                      <div key={i} className="bg-slate-700/40 rounded-lg p-4 border-l-2" style={{ borderLeftColor: metric.color }}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-slate-400">{metric.label}</span>
                          <span className="font-mono font-bold text-lg" style={{ color: metric.color }}>
                            {metric.value}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{metric.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs">
                      <span className="text-slate-500">Verdict: </span>
                      <span className={`font-semibold ${
                        simulatedMetrics.ratio > 3 ? "text-emerald-400" :
                        simulatedMetrics.ratio > 2 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {simulatedMetrics.ratio > 3 ? "✓ Sostenibile" :
                         simulatedMetrics.ratio > 2 ? "⚠ Margine" : "✗ Non sostenibile"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                7. RACCOMANDAZIONE FINALE
            ═══════════════════════════════════════════════════════════ */}
            <section id="recommendation">
              <SectionHeader
                number="Sezione 07"
                title="Raccomandazione Finale: Il Modello Ottimale"
                subtitle="Quale modello scegliere per scalare rapidamente e sostenibilmente"
                verdict={{ label: "Modello Ibrido Consigliato", type: "positive" }}
              />

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    rank: "1° Scelta",
                    name: "Ibrido: Freemium + Pay-Per + Pro",
                    color: "#06B6D4",
                    ltv: "€67,50",
                    ratio: "6,75x",
                    breakeven: "8 mesi",
                    why: "Massima flessibilità, cattura tutti i segmenti, LTV robusto, opzioni di upgrade naturali",
                    pros: [
                      "LTV medio-alto (€67,50)",
                      "LTV/CAC ratio sostenibile (6,75x)",
                      "Break-even in 8 mesi",
                      "Tre tier per diversi bisogni",
                      "Upsell naturale da free a Pro"
                    ],
                    cons: [
                      "Complesso da gestire",
                      "Richiede UX molto chiara",
                      "Analytics sofisticato necessario"
                    ]
                  },
                  {
                    rank: "2° Scelta",
                    name: "Ultra-Low: €0,99/mese Illimitato",
                    color: "#10B981",
                    ltv: "€95,04",
                    ratio: "10,56x",
                    breakeven: "3 mesi",
                    why: "Break-even rapidissimo, massima retention, pricing irresistibile, ma richiede scala massiva",
                    pros: [
                      "LTV altissimo (€95,04)",
                      "Break-even in 3 mesi",
                      "Retention massima (96%)",
                      "Pricing psicologico irresistibile",
                      "Facile da spiegare"
                    ],
                    cons: [
                      "Margine lordo molto basso",
                      "Richiede scala massiva (250K utenti)",
                      "Difficile monetizzare ulteriormente",
                      "Dipendente da CAC basso"
                    ]
                  },
                  {
                    rank: "3° Scelta",
                    name: "B2B2C: Partnership CAF/Sindacati",
                    color: "#8B5CF6",
                    ltv: "€39,90",
                    ratio: "79,8x",
                    breakeven: "1 mese",
                    why: "CAC quasi zero, break-even istantaneo, ma richiede partnership difficili da negoziare",
                    pros: [
                      "CAC quasi zero",
                      "LTV/CAC ratio massimo (79,8x)",
                      "Break-even in 1 mese",
                      "Distribuzione garantita",
                      "Scalabilità rapida"
                    ],
                    cons: [
                      "Richiede partnership",
                      "Margine ridotto (€3,99 vs €5,99)",
                      "Dipendenza da partner",
                      "Negoziazione 3-6 mesi"
                    ]
                  }
                ].map((option, i) => (
                  <div key={i} className="bg-slate-800/60 border border-white/10 rounded-xl p-6 flex flex-col" style={{ borderTopColor: option.color, borderTopWidth: 2 }}>
                    <div className="mb-4">
                      <div className="text-xs font-mono mb-1" style={{ color: option.color }}>{option.rank}</div>
                      <h3 className="font-bold text-white text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: option.color }}>
                        {option.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{option.why}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">LTV</div>
                        <div className="font-mono font-bold text-sm" style={{ color: option.color }}>{option.ltv}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Ratio</div>
                        <div className="font-mono font-bold text-sm" style={{ color: option.color }}>{option.ratio}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Break-even</div>
                        <div className="font-mono font-bold text-sm" style={{ color: option.color }}>{option.breakeven}</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-semibold text-emerald-400 mb-2">Pro</div>
                      <div className="space-y-1 mb-4">
                        {option.pros.map((pro, j) => (
                          <p key={j} className="text-xs text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span>{pro}</span>
                          </p>
                        ))}
                      </div>

                      <div className="text-xs font-semibold text-amber-400 mb-2">Contro</div>
                      <div className="space-y-1">
                        {option.cons.map((con, j) => (
                          <p key={j} className="text-xs text-slate-400 flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">⚠</span>
                            <span>{con}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final recommendation */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 mb-6">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Raccomandazione Finale</div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Lanciare con il Modello Ibrido
                </h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Il modello <strong className="text-cyan-400">Ibrido (Freemium + Pay-Per-Error + Pro con Chatbot)</strong> è il più equilibrato:
                  combina acquisizione rapida (freemium), monetizzazione immediata (pay-per-error €3,99), e upsell naturale (Pro €9,99/mese).
                  LTV/CAC ratio di 6,75x è sostenibile, break-even in 8 mesi è realistico, e la complessità è gestibile con UX chiara.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {[
                    { phase: "Mesi 1-3", task: "MVP Freemium + Pay-Per", detail: "Lancio con 15 CCNL, analisi base gratuita, upsell a €3,99" },
                    { phase: "Mesi 4-6", task: "Chatbot Beta", detail: "Sviluppo chatbot specializzato, test con Pro users" },
                    { phase: "Mesi 7-12", task: "Scale & Optimize", detail: "Marketing SEO, partnership CAF, ottimizzazione retention" },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-800/40 rounded-lg p-4">
                      <div className="text-xs font-mono text-cyan-400 mb-1">{item.phase}</div>
                      <div className="text-sm font-semibold text-white mb-1">{item.task}</div>
                      <p className="text-xs text-slate-400">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  <strong className="text-slate-300">Nota:</strong> Se il CAC organico (SEO) rimane sotto €5, il modello Ultra-Low (€0,99/mese)
                  diventa più interessante. Se riuscite a negoziare partnership CAF, il modello B2B2C offre scalabilità massima.
                </div>
              </div>

              {/* Comparison matrix */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 font-mono text-slate-500 uppercase tracking-wide">Metrica</th>
                        {businessModels.slice(0, 4).map((m) => (
                          <th key={m.id} className="text-center px-4 py-3 font-mono text-slate-500 uppercase tracking-wide">{m.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { metric: "LTV", key: "ltv" },
                        { metric: "CAC", key: "cac" },
                        { metric: "Ratio", key: "ratio" },
                        { metric: "Break-even", key: "breakeven_months" },
                        { metric: "Churn", key: "churn_monthly" },
                        { metric: "Year 3 Revenue", key: "year3_revenue" },
                      ].map((row) => (
                        <tr key={row.metric} className="border-b border-white/5">
                          <td className="px-4 py-2 font-mono text-slate-500">{row.metric}</td>
                          {businessModels.slice(0, 4).map((m) => {
                            const value = m[row.key as keyof typeof m];
                            let display = "";
                            if (row.key === "ltv" || row.key === "cac") display = "€" + (value as number).toFixed(2);
                            else if (row.key === "ratio") display = (value as number).toFixed(2) + "x";
                            else if (row.key === "breakeven_months") display = (value as number) + "m";
                            else if (row.key === "churn_monthly") display = ((value as number) * 100).toFixed(1) + "%";
                            else if (row.key === "year3_revenue") display = "€" + ((value as number) / 1000).toFixed(0) + "K";
                            return (
                              <td key={m.id} className="px-4 py-2 text-center font-mono" style={{ color: m.color }}>
                                {display}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <footer className="border-t border-white/5 px-6 md:px-10 py-8 mt-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Lavoroinchiaro.it — Business Model Analysis Completa
                </div>
                <div className="text-xs text-slate-500">
                  7 modelli di business, unit economics dettagliati, timeline di lancio, strategie di retention, chatbot specializzato
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge type="premium">7 Modelli</Badge>
                <Badge type="info">Analisi Completa</Badge>
                <Badge type="positive">Pronto per Lancio</Badge>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-600 max-w-3xl">
              <strong className="text-slate-500">Disclaimer:</strong> Questa analisi è basata su dati pubblici, stime di mercato, e ipotesi conservative.
              I numeri sono illustrativi e devono essere validati con dati reali. Le metriche di break-even, churn, e retention dipendono dall'esecuzione
              e dalle condizioni di mercato. Consultare con esperti di business model prima di implementare.
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
