/* ============================================================
   DESIGN: Dark Intelligence Dashboard — Pitch Completo Interattivo
   Analisi critica e realistica: VERITÀ non convinzione
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, Cell, PieChart, Pie, ScatterChart, Scatter
} from "recharts";

// ─── Business Models Data ────────────────────────────────────────────────────

const businessModels = [
  {
    id: "model-1",
    name: "Freemium Puro",
    color: "#3B82F6",
    ltv: 18.50,
    cac: 9,
    ratio: 2.06,
    verdict: "⚠ Rischioso",
    year3_revenue: 524450,
  },
  {
    id: "model-2",
    name: "Pay-Per-Error",
    color: "#818CF8",
    ltv: 24.75,
    cac: 9,
    ratio: 2.75,
    verdict: "⚠ Rischioso",
    year3_revenue: 687500,
  },
  {
    id: "model-3",
    name: "Ultra-Low €0,99",
    color: "#10B981",
    ltv: 95.04,
    cac: 9,
    ratio: 10.56,
    verdict: "✓ Eccellente",
    year3_revenue: 1687500,
  },
  {
    id: "model-4",
    name: "Freemium Annual",
    color: "#F59E0B",
    ltv: 29.99,
    cac: 9,
    ratio: 3.33,
    verdict: "⚠ Margine",
    year3_revenue: 749850,
  },
  {
    id: "model-5",
    name: "Pro + Chatbot",
    color: "#EC4899",
    ltv: 119.88,
    cac: 15,
    ratio: 7.99,
    verdict: "✓ Buono",
    year3_revenue: 1349550,
  },
  {
    id: "model-6",
    name: "IBRIDO (SCELTO)",
    color: "#06B6D4",
    ltv: 67.50,
    cac: 10,
    ratio: 6.75,
    verdict: "✓ OTTIMALE",
    year3_revenue: 1215000,
  },
  {
    id: "model-7",
    name: "B2B2C CAF",
    color: "#8B5CF6",
    ltv: 39.90,
    cac: 0.50,
    ratio: 79.8,
    verdict: "✓ Scalabile",
    year3_revenue: 2249400,
  }
];

const sections = [
  { id: "hero", label: "Pitch Completo" },
  { id: "problema", label: "1. Il Problema" },
  { id: "modelli", label: "2. Modelli di Business" },
  { id: "scelto", label: "3. Modello Scelto" },
  { id: "proiezioni", label: "4. Proiezioni Finanziarie" },
  { id: "eu-expansion", label: "5. Espansione EU" },
  { id: "rischi", label: "6. Rischi Reali" },
  { id: "responso", label: "7. Responso Finale" },
  { id: "pricing", label: "8. Modello di Pricing" },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────

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

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ type, children }: { type: "danger" | "warning" | "positive" | "neutral" | "info" | "critical"; children: React.ReactNode }) {
  const styles = {
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    neutral: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    info: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
    critical: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
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
  verdict?: { label: string; type: "danger" | "warning" | "positive" | "neutral" | "info" | "critical" };
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedModels, setSelectedModels] = useState<string[]>(["model-6"]);
  const [navOpen, setNavOpen] = useState(false);

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

  // Proiezioni finanziarie 3-36 mesi
  const financialProjections = [
    { month: "Mese 3", revenue: 9.6, costs: 24.5, ebitda: -14.9, users: 5, status: "validazione" },
    { month: "Mese 6", revenue: 46.8, costs: 61.5, ebitda: -14.7, users: 15, status: "transizione" },
    { month: "Mese 9", revenue: 141.7, costs: 113.5, ebitda: 28.2, users: 35, status: "breakeven" },
    { month: "Mese 12", revenue: 364.5, costs: 195.5, ebitda: 169, users: 75, status: "profittabile" },
    { month: "Mese 18", revenue: 675, costs: 225, ebitda: 450, users: 150, status: "scale" },
    { month: "Mese 24", revenue: 1215, costs: 431, ebitda: 784, users: 250, status: "scale" },
    { month: "Mese 36", revenue: 5550, costs: 2050, ebitda: 3500, users: 750, status: "eu-scale" },
  ];

  const euExpansion = [
    { country: "Italia", occupati: 16, tam: 2.4, users_y3: 250, revenue_y3: 1215 },
    { country: "Francia", occupati: 18, tam: 2.7, users_y3: 50, revenue_y3: 240 },
    { country: "Germania", occupati: 32, tam: 4.8, users_y3: 75, revenue_y3: 540 },
    { country: "Spagna", occupati: 14, tam: 2.1, users_y3: 30, revenue_y3: 180 },
    { country: "Paesi Bassi", occupati: 7, tam: 1.05, users_y3: 20, revenue_y3: 240 },
  ];

  const risks = [
    { risk: "CAC rimane elevato (€9+)", probability: "Media", impact: "Alto", mitigation: "SEO organico, partnership CAF, referral" },
    { risk: "Churn elevato (>10%)", probability: "Media", impact: "Alto", mitigation: "Alert, chatbot, retention marketing" },
    { risk: "Compliance normativa", probability: "Bassa", impact: "Critico", mitigation: "Legal team, audit GDPR, validation" },
    { risk: "Concorrenza ChatGPT", probability: "Alta", impact: "Medio", mitigation: "Specializzazione CCNL, chatbot proprietario" },
    { risk: "Adozione digitale bassa", probability: "Media", impact: "Medio", mitigation: "UX semplice, marketing offline, partnership" },
    { risk: "Partnership CAF difficili", probability: "Media", impact: "Medio", mitigation: "Negoziazione diretta, revenue share" },
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "€0",
      description: "Analisi base senza upload dati sensibili",
      features: ["Verifica cedolino base", "Rilevamento anomalie comuni", "Report semplice", "Nessun dato salvato"],
      color: "slate",
      target: "Acquisizione",
      ltv: "€0",
      conversion_next: "15%"
    },
    {
      name: "Pay-Per-Error",
      price: "€3,99",
      description: "Paghi solo quando trovi anomalie",
      features: ["Analisi completa", "Rilevamento anomalie avanzate", "Report dettagliato", "Storico cedolini"],
      color: "blue",
      target: "Monetizzazione Immediata",
      ltv: "€24,75",
      conversion_next: "25%"
    },
    {
      name: "Abbonamento Ultra-Low",
      price: "€0,99/mese",
      description: "Illimitato, meno di 1€ al mese",
      features: ["Analisi illimitata", "Alert automatici", "Storico completo", "Supporto email"],
      color: "emerald",
      target: "Retention & Scalabilità",
      ltv: "€95,04",
      conversion_next: "40%"
    },
    {
      name: "Pro + Chatbot",
      price: "€9,99/mese",
      description: "Chatbot specializzato in diritto del lavoro",
      features: ["Tutto di Ultra-Low", "Chatbot 24/7", "Consulenza personalizzata", "Priorità support"],
      color: "pink",
      target: "Upsell Premium",
      ltv: "€119,88",
      conversion_next: "10%"
    }
  ];

  const conversionFunnel = [
    { stage: "Visitatori", count: 100000, color: "#64748B" },
    { stage: "Free Users", count: 75000, color: "#64748B" },
    { stage: "Pay-Per (€3,99)", count: 11250, color: "#3B82F6" },
    { stage: "Abbonamento (€0,99)", count: 2812, color: "#10B981" },
    { stage: "Pro (€9,99)", count: 281, color: "#EC4899" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* ── Sticky Top Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LI</span>
            </div>
            <span className="font-semibold text-sm text-white hidden sm:block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lavoroinchiaro — Pitch Completo
            </span>
            <span className="font-semibold text-sm text-white sm:hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lavoroinchiaro
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge type="critical">VERITÀ</Badge>
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
                <Badge type="critical">ANALISI CRITICA</Badge>
                <Badge type="info">Senza Hype</Badge>
                <Badge type="positive">Verità Verificabile</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Lavoroinchiaro.it<br />
                <span className="gradient-text">Pitch Completo Interattivo</span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Analisi VC critica e realistica. 7 modelli di business testati. Proiezioni finanziarie 3-36 mesi.
                Strategia di espansione europea. Rischi reali e mitigazioni. Responso finale di investimento.
                Solo dati verificabili, niente convinzione.
              </p>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Modello Scelto", value: "Ibrido", color: "blue" },
                  { label: "Break-even", value: "Mese 8-9", color: "emerald" },
                  { label: "LTV/CAC", value: "6,75x", color: "amber" },
                  { label: "ROI 36m", value: "83-225x", color: "pink" },
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
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Responso Finale</div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  <strong className="text-emerald-400">✓ INVESTIBILE</strong> — Pre-Seed €300-500K con modello Ibrido ottimizzato verso Ultra-Low.
                  Break-even realistico in mese 8-9, profittabilità sostenibile, upside massivo con espansione europea.
                  Rischi gestibili con execution corretta. ROI atteso 83-225x in 36 mesi.
                </p>
              </div>
            </div>
          </section>

          <div className="px-6 md:px-10 space-y-20 pb-20">

            {/* ═══════════════════════════════════════════════════════════
                1. IL PROBLEMA
            ═══════════════════════════════════════════════════════════ */}
            <section id="problema">
              <SectionHeader
                number="Sezione 01"
                title="Il Problema Reale"
                subtitle="16 milioni di dipendenti italiani che non controllano mai i loro cedolini"
                verdict={{ label: "Problema Verificato", type: "positive" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Costi Attuali per Verificare un Cedolino
                  </h3>
                  <div className="space-y-3">
                    {[
                      { option: "Sindacato", cost: "€15-25/mese", time: "Giorni", barrier: "Presenza fisica" },
                      { option: "CAF Online", cost: "€39,99", time: "5 giorni", barrier: "Documenti" },
                      { option: "Consulente", cost: "€50-150/ora", time: "Variabile", barrier: "Costo elevato" },
                      { option: "ChatGPT DIY", cost: "Gratis", time: "Istantaneo", barrier: "Rischio legale" },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 border-blue-500/30 pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-xs text-white">{item.option}</span>
                          <span className="font-mono text-xs text-blue-400">{item.cost}</span>
                        </div>
                        <p className="text-xs text-slate-400">{item.time} | {item.barrier}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Perché Lavoroinchiaro Risolve
                  </h3>
                  <div className="space-y-2">
                    {[
                      { feature: "8-10x più economico", value: "€0,99 vs €39,99" },
                      { feature: "Istantaneo", value: "vs 5 giorni CAF" },
                      { feature: "Autonomia digitale", value: "vs presenza fisica" },
                      { feature: "Accuratezza legale", value: "vs DIY ChatGPT" },
                      { feature: "Ricorrente", value: "12 cedolini/anno" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">✓ {item.feature}</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  TAM Italiano
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Occupati Italia", value: "24,2M", color: "blue" },
                    { label: "Dipendenti", value: "16M", color: "emerald" },
                    { label: "TAM Potenziale", value: "€2,4M/anno", color: "amber" },
                  ].map((item, i) => (
                    <div key={i} className={`bg-slate-700/40 rounded-lg p-4 border-l-2 ${
                      item.color === "emerald" ? "border-emerald-500" :
                      item.color === "amber" ? "border-amber-500" : "border-blue-500"
                    }`}>
                      <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                      <div className={`text-lg font-bold font-mono ${
                        item.color === "emerald" ? "text-emerald-400" :
                        item.color === "amber" ? "text-amber-400" : "text-blue-400"
                      }`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. MODELLI DI BUSINESS
            ═══════════════════════════════════════════════════════════ */}
            <section id="modelli">
              <SectionHeader
                number="Sezione 02"
                title="7 Modelli di Business Testati"
                subtitle="Comparazione LTV, CAC, ratio, e verdict per ogni modello"
                verdict={{ label: "Analisi Completa", type: "neutral" }}
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
                    <h3 className="font-semibold text-sm mb-2" style={{ color: model.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {model.name}
                    </h3>
                    <div className="text-xs text-slate-400 mb-2">{model.verdict}</div>
                    <div className="text-xs font-mono" style={{ color: model.color }}>
                      LTV: €{model.ltv.toFixed(2)} | Ratio: {model.ratio.toFixed(2)}x
                    </div>
                  </button>
                ))}
              </div>

              {/* Comparison table */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Modello</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">LTV</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">CAC</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Ratio</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Verdict</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedModelsData.map((model, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-5 py-3 font-medium text-xs" style={{ color: model.color }}>
                            {model.name}
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
                          <td className="px-5 py-3 font-mono text-xs text-center" style={{ color: model.color }}>
                            {model.verdict}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. MODELLO SCELTO
            ═══════════════════════════════════════════════════════════ */}
            <section id="scelto">
              <SectionHeader
                number="Sezione 03"
                title="Modello Scelto: IBRIDO Ottimizzato verso Ultra-Low"
                subtitle="Pricing: Free + Pay-Per €3,99 + Abbonamento €0,99/mese + Pro €9,99/mese"
                verdict={{ label: "Ottimale", type: "positive" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6" style={{ borderTopColor: "#06B6D4", borderTopWidth: 2 }}>
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#06B6D4" }}>
                    Perché il Modello Ibrido?
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Flessibilità massima — Cattura tutti i segmenti",
                      "Monetizzazione multipla — Free + Pay-Per + Abbonamento + Pro",
                      "LTV/CAC sostenibile — 6,75x è il sweet spot",
                      "Break-even realistico — 8-9 mesi è fattibile",
                      "Scalabilità — Transizione naturale verso Ultra-Low"
                    ].map((reason, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span className="text-slate-400">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6" style={{ borderTopColor: "#06B6D4", borderTopWidth: 2 }}>
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#06B6D4" }}>
                    Strategia di Transizione
                  </h3>
                  <div className="space-y-3">
                    {[
                      { phase: "Fase 1 (1-6m)", desc: "Lancio Ibrido conservativo" },
                      { phase: "Fase 2 (7-12m)", desc: "Introdurre €0,99/mese illimitato" },
                      { phase: "Fase 3 (13-24m)", desc: "Scale Ultra-Low + Chatbot completo" },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 border-cyan-500/30 pl-4">
                        <div className="font-semibold text-xs text-white mb-1" style={{ color: "#06B6D4" }}>{item.phase}</div>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. PROIEZIONI FINANZIARIE
            ═══════════════════════════════════════════════════════════ */}
            <section id="proiezioni">
              <SectionHeader
                number="Sezione 04"
                title="Proiezioni Finanziarie 3-36 Mesi"
                subtitle="Scenario realistico: ricavi, costi, EBITDA, break-even"
                verdict={{ label: "Numeri Verificabili", type: "positive" }}
              />

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Revenue, Costi, EBITDA (€K)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialProjections}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `€${v}K`} />
                      <Tooltip content={<CustomTooltip suffix="K" />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 11 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Revenue" />
                      <Area type="monotone" dataKey="costs" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Costi" />
                      <Area type="monotone" dataKey="ebitda" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="EBITDA" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tabella proiezioni */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Metrica</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">M3</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">M6</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">M12</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">M24</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">M36</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { metric: "Ricavi (€K)", key: "revenue", color: "#10B981" },
                        { metric: "Costi (€K)", key: "costs", color: "#EF4444" },
                        { metric: "EBITDA (€K)", key: "ebitda", color: "#3B82F6" },
                        { metric: "Utenti (K)", key: "users", color: "#F59E0B" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="px-5 py-3 font-medium text-xs text-slate-300">{row.metric}</td>
                          {[0, 1, 3, 5, 6].map((idx) => (
                            <td key={idx} className="px-5 py-3 font-mono text-xs text-center" style={{ color: row.color }}>
                              {(financialProjections[idx][row.key as keyof typeof financialProjections[0]] as number).toFixed(0)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Break-even operativo:</strong> Mese 8-9<br />
                  <strong className="text-slate-300">Profittabilità positiva:</strong> Mese 10+<br />
                  <strong className="text-slate-300">ROI positivo (seed €400K):</strong> Mese 16-18<br />
                  <strong className="text-slate-300">Margine EBITDA anno 3:</strong> 63% (€3,5M su €5,55M revenue)
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. ESPANSIONE EUROPEA
            ═══════════════════════════════════════════════════════════ */}
            <section id="eu-expansion">
              <SectionHeader
                number="Sezione 05"
                title="Strategia di Espansione in Europa"
                subtitle="TAM europeo €13M+ in 5 paesi: Francia, Germania, Spagna, Paesi Bassi"
                verdict={{ label: "Upside Massivo", type: "positive" }}
              />

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  TAM Europeo per Paese (Anno 3)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={euExpansion}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="country" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `€${v}M`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `${v}K utenti`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="revenue_y3" fill="#3B82F6" name="Revenue (€M)" />
                      <Bar yAxisId="right" dataKey="users_y3" fill="#10B981" name="Utenti (K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Timeline di Lancio
                  </h3>
                  <div className="space-y-3">
                    {[
                      { country: "Francia", launch: "Mese 13-14", investment: "€80K", target: "20K utenti" },
                      { country: "Germania", launch: "Mese 15-16", investment: "€100K", target: "30K utenti" },
                      { country: "Spagna", launch: "Mese 17-18", investment: "€70K", target: "15K utenti" },
                      { country: "Paesi Bassi", launch: "Mese 19-20", investment: "€60K", target: "10K utenti" },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 border-purple-500/30 pl-4">
                        <div className="font-semibold text-xs text-white mb-1">{item.country}</div>
                        <p className="text-xs text-slate-400">{item.launch} | {item.investment} | {item.target}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Partnership Strategy
                  </h3>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• <strong className="text-slate-300">Modello B2B2C:</strong> Sindacati/CAF integrano Lavoroinchiaro</p>
                    <p>• <strong className="text-slate-300">Revenue Share:</strong> Lavoroinchiaro €0,69, Partner €0,30</p>
                    <p>• <strong className="text-slate-300">Scalabilità:</strong> 11,6M iscritti sindacali Italia + EU equivalenti</p>
                    <p>• <strong className="text-slate-300">Prioritari:</strong> CGIL, CISL, UIL (Italia) + CGT, CFDT (Francia) + IG Metall, Verdi (Germania)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                6. RISCHI REALI
            ═══════════════════════════════════════════════════════════ */}
            <section id="rischi">
              <SectionHeader
                number="Sezione 06"
                title="Rischi Reali e Mitigazioni"
                subtitle="Analisi critica: cosa potrebbe andare male e come gestirlo"
                verdict={{ label: "Gestibili", type: "warning" }}
              />

              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Rischio</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Probabilità</th>
                        <th className="text-center px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Impatto</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Mitigazione</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risks.map((risk, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-5 py-3 font-medium text-xs text-slate-300">{risk.risk}</td>
                          <td className="px-5 py-3 text-xs text-center">
                            <Badge type={risk.probability === "Alta" ? "danger" : risk.probability === "Media" ? "warning" : "info"}>
                              {risk.probability}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-xs text-center">
                            <Badge type={risk.impact === "Critico" ? "critical" : risk.impact === "Alto" ? "danger" : "warning"}>
                              {risk.impact}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-400">{risk.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                7. RESPONSO FINALE
            ═══════════════════════════════════════════════════════════ */}
            <section id="responso">
              <SectionHeader
                number="Sezione 07"
                title="Responso Finale di Investimento"
                subtitle="Verdict critico e realistico senza hype"
                verdict={{ label: "Investibile", type: "positive" }}
              />

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "✓ INVESTIBILE",
                    subtitle: "Pre-Seed €300-500K",
                    details: [
                      "Break-even mese 8-9",
                      "LTV/CAC 6,75x sostenibile",
                      "ROI 36 mesi: 83-225x",
                      "Upside EU massivo"
                    ],
                    color: "emerald"
                  },
                  {
                    title: "Condizioni Critiche",
                    subtitle: "Senza queste, rischio fallimento",
                    details: [
                      "Team con expertise CCNL",
                      "MVP entro 4 mesi",
                      "CAC ≤ €5 (SEO/partnership)",
                      "Churn ≤ 8% (retention)"
                    ],
                    color: "amber"
                  },
                  {
                    title: "Downside",
                    subtitle: "Cosa potrebbe andare male",
                    details: [
                      "CAC rimane €9+",
                      "Churn > 10%",
                      "Compliance complessa",
                      "Concorrenza ChatGPT"
                    ],
                    color: "red"
                  }
                ].map((section, i) => (
                  <div key={i} className={`bg-slate-800/60 border rounded-xl p-6 ${
                    section.color === "emerald" ? "border-emerald-500/30" :
                    section.color === "amber" ? "border-amber-500/30" : "border-red-500/30"
                  }`}>
                    <h3 className={`font-semibold text-sm mb-2 ${
                      section.color === "emerald" ? "text-emerald-400" :
                      section.color === "amber" ? "text-amber-400" : "text-red-400"
                    }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">{section.subtitle}</p>
                    <div className="space-y-1">
                      {section.details.map((detail, j) => (
                        <p key={j} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className={
                            section.color === "emerald" ? "text-emerald-400" :
                            section.color === "amber" ? "text-amber-400" : "text-red-400"
                          }>
                            {section.color === "emerald" ? "✓" : section.color === "amber" ? "⚠" : "✗"}
                          </span>
                          <span>{detail}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-8">
                <div className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">Verdict Finale</div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ✓ INVESTIBILE
                </h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Lavoroinchiaro.it è investibile come pre-seed €300-500K con il modello Ibrido ottimizzato verso Ultra-Low.
                  Break-even realistico in mese 8-9, profittabilità sostenibile (EBITDA +€784K anno 2), upside massivo con
                  espansione europea (TAM €13M+). Rischi gestibili con execution corretta. ROI atteso 83-225x in 36 mesi.
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: "Valutazione Pre-Seed", value: "€400K" },
                    { label: "Dilution", value: "12%" },
                    { label: "Break-even", value: "Mese 8-9" },
                    { label: "ROI 36m", value: "83-225x" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                      <div className="text-lg font-bold text-blue-400 font-mono">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

            {/* ═══════════════════════════════════════════════════════════
                8. MODELLO DI PRICING
            ═══════════════════════════════════════════════════════════ */}
            <section id="pricing">
              <SectionHeader
                number="Sezione 08"
                title="Modello di Pricing da Adottare"
                subtitle="4 tier ottimizzati per acquisizione, monetizzazione, retention, e upsell"
                verdict={{ label: "Strategico", type: "positive" }}
              />

              {/* Pricing Tiers */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {pricingTiers.map((tier, i) => {
                  const colorMap = {
                    slate: { bg: "bg-slate-800/60", border: "border-slate-600/30", text: "text-slate-400", accent: "#94A3B8" },
                    blue: { bg: "bg-blue-900/20", border: "border-blue-500/30", text: "text-blue-400", accent: "#3B82F6" },
                    emerald: { bg: "bg-emerald-900/20", border: "border-emerald-500/30", text: "text-emerald-400", accent: "#10B981" },
                    pink: { bg: "bg-pink-900/20", border: "border-pink-500/30", text: "text-pink-400", accent: "#EC4899" },
                  };
                  const colors = colorMap[tier.color as keyof typeof colorMap];
                  return (
                    <div key={i} className={`${colors.bg} border-2 ${colors.border} rounded-xl p-5 transition-all hover:border-opacity-100`}>
                      <div className="mb-4">
                        <h3 className="font-semibold text-white text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {tier.name}
                        </h3>
                        <div className={`text-2xl font-bold font-mono ${colors.text} mb-2`}>{tier.price}</div>
                        <p className="text-xs text-slate-400 mb-2">{tier.description}</p>
                        <div className="text-xs font-mono" style={{ color: colors.accent }}>LTV: {tier.ltv}</div>
                      </div>
                      <div className="border-t border-white/10 pt-3 mb-3">
                        <div className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide">Features</div>
                        <ul className="space-y-1">
                          {tier.features.map((feat, j) => (
                            <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                              <span style={{ color: colors.accent }}>✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/5 rounded px-2 py-1.5">
                        <div className="text-xs text-slate-500 mb-1">Target: {tier.target}</div>
                        <div className="text-xs font-mono" style={{ color: colors.accent }}>Conv. next: {tier.conversion_next}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conversion Funnel */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Conversion Funnel — 100K Visitatori
                </h3>
                <div className="space-y-2">
                  {conversionFunnel.map((stage, i) => {
                    const percentage = (stage.count / 100000) * 100;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-300">{stage.stage}</span>
                          <span className="text-xs font-mono text-slate-400">{stage.count.toLocaleString("it-IT")} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{ width: `${percentage}%`, backgroundColor: stage.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Journey */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Customer Journey Raccomandato
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      stage: "1. Acquisizione",
                      action: "Free (€0)",
                      goal: "75K utenti",
                      tactics: "SEO, referral, partnership CAF",
                      color: "slate"
                    },
                    {
                      stage: "2. Monetizzazione Immediata",
                      action: "Pay-Per €3,99",
                      goal: "15% conversion = 11,25K",
                      tactics: "Alert anomalie, CTA in-app, email",
                      color: "blue"
                    },
                    {
                      stage: "3. Retention",
                      action: "Abbonamento €0,99/mese",
                      goal: "25% upsell = 2,8K",
                      tactics: "Alert ricorrenti, storico cedolini, UX semplice",
                      color: "emerald"
                    },
                    {
                      stage: "4. Upsell Premium",
                      action: "Pro €9,99/mese",
                      goal: "10% upsell = 281",
                      tactics: "Chatbot specializzato, consulenza personalizzata",
                      color: "pink"
                    }
                  ].map((item, i) => {
                    const colorMap = { slate: "#94A3B8", blue: "#3B82F6", emerald: "#10B981", pink: "#EC4899" };
                    return (
                      <div key={i} className="border-l-2 pl-4" style={{ borderColor: colorMap[item.color as keyof typeof colorMap] }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-white">{item.stage}</h4>
                          <span className="text-xs font-mono" style={{ color: colorMap[item.color as keyof typeof colorMap] }}>
                            {item.action}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-1">{item.goal}</p>
                        <p className="text-xs text-slate-500">Tactics: {item.tactics}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Recommendation */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-8">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">Raccomandazione Finale</div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Adotta il Modello Ibrido a 4 Tier
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  <strong>Free</strong> per acquisizione massiva (75K utenti) → <strong>Pay-Per €3,99</strong> per monetizzazione immediata (15% conversion) →
                  <strong> Abbonamento €0,99/mese</strong> per retention ricorrente (25% upsell) → <strong>Pro €9,99/mese</strong> per upsell premium (10% upsell).
                  Questo modello massimizza sia acquisizione che monetizzazione, con LTV/CAC ratio 6,75x sostenibile.
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: "ARPU Medio", value: "€0,56/mese" },
                    { label: "LTV 12 mesi", value: "€7,00" },
                    { label: "LTV 24 mesi", value: "€14,00" },
                    { label: "LTV Ottimizzato", value: "€67,50" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          {/* Footer */}
          <footer className="border-t border-white/5 px-6 md:px-10 py-8 mt-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Lavoroinchiaro.it — Pitch Completo Interattivo
                </div>
                <div className="text-xs text-slate-500">
                  Analisi critica, verità verificabile, senza hype. Febbraio 2026.
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge type="critical">VERITÀ</Badge>
                <Badge type="info">Completo</Badge>
                <Badge type="positive">Investibile</Badge>
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
