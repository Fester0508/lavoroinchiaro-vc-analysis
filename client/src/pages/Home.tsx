/* ============================================================
   DESIGN: Dark Intelligence Dashboard
   Space Grotesk headings + Inter body + Space Mono data
   Colors: slate-900 bg, slate-800 cards, blue/red/green/amber accents
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Cell, PieChart, Pie, AreaChart, Area
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const tamSamSomData = [
  { name: "TAM", value: 16000000, label: "16M", sublabel: "Dipendenti privati totali", color: "#3B82F6" },
  { name: "SAM", value: 3200000, label: "3.2M", sublabel: "Non sindacalizzati, digitali, mobile", color: "#818CF8" },
  { name: "SOM", value: 80000, label: "80K", sublabel: "Raggiungibili in 3 anni (scenario realistico)", color: "#10B981" },
];

const scenarioData = [
  { year: "Anno 1", pessimistico: 29940, realistico: 74850, ottimistico: 149700 },
  { year: "Anno 2", pessimistico: 74850, realistico: 224550, ottimistico: 524450 },
  { year: "Anno 3", pessimistico: 149700, realistico: 524450, ottimistico: 1249500 },
];

const scenarioUsersData = [
  { year: "Anno 1", pessimistico: 5000, realistico: 12500, ottimistico: 25000 },
  { year: "Anno 2", pessimistico: 12500, realistico: 37500, ottimistico: 87500 },
  { year: "Anno 3", pessimistico: 25000, realistico: 87500, ottimistico: 208500 },
];

// Competitor pricing corretti con dati reali
const competitorPricingData = [
  { name: "Sindacato\n(quota mensile)", costo: 20, autonomia: 20, velocita: 15, note: "~1% stipendio/mese, presenza fisica" },
  { name: "CAF Online\n(fino 5 cedolini)", costo: 40, autonomia: 55, velocita: 30, note: "€39,99, 5 giorni lavorativi" },
  { name: "Studio privato\n(1 anno)", costo: 50, autonomia: 50, velocita: 35, note: "€50, documenti multipli richiesti" },
  { name: "Consulente\ndel lavoro", costo: 100, autonomia: 45, velocita: 40, note: "€50-150/ora, appuntamento" },
  { name: "Lavoroinchiaro\n(singola analisi)", costo: 5, autonomia: 95, velocita: 95, note: "€4,99, istantaneo, self-service" },
  { name: "ChatGPT\n(prompt manuale)", costo: 0, autonomia: 80, velocita: 85, note: "Gratuito, non specializzato CCNL" },
];

const pricingTiersData = [
  {
    tier: "Free",
    price: "€0",
    color: "#64748B",
    features: ["Analisi base 1 cedolino/mese", "Segnalazione anomalie macro", "Nessun report scaricabile", "Watermark sul risultato"],
    cta: "Acquisizione e fiducia",
    conversion_target: "→ Paid"
  },
  {
    tier: "Analisi Singola",
    price: "€4,99",
    color: "#3B82F6",
    features: ["1 analisi completa", "Verifica vs CCNL specifico", "Report PDF scaricabile", "Validità 30 giorni"],
    cta: "Entry point basso attrito",
    conversion_target: "→ Abbonamento"
  },
  {
    tier: "Abbonamento Annuale",
    price: "€29,99/anno",
    color: "#818CF8",
    features: ["12 analisi/anno (1/mese)", "Storico cedolini", "Alert automatici anomalie", "Supporto prioritario"],
    cta: "LTV target: €29,99",
    conversion_target: "→ Rinnovo"
  },
  {
    tier: "Pro / Famiglia",
    price: "€59,99/anno",
    color: "#10B981",
    features: ["Analisi illimitate", "Fino a 3 lavoratori", "Confronto storico 3 anni", "Export dati + consulenza 30min"],
    cta: "Upsell coppie / famiglie",
    conversion_target: "→ Referral"
  },
];

const unitEconomicsRevised = [
  { metric: "Prezzo singola analisi", value: "€4,99", color: "#3B82F6", type: "neutral" },
  { metric: "Abbonamento annuale", value: "€29,99", color: "#818CF8", type: "neutral" },
  { metric: "LTV medio (mix free→paid→annual)", value: "€18,50", color: "#10B981", type: "positive" },
  { metric: "CPA realistico (SEO + social)", value: "€8-12", color: "#F59E0B", type: "warning" },
  { metric: "Ratio LTV/CAC (scenario realistico)", value: "1,7-2,3x", color: "#F59E0B", type: "warning" },
  { metric: "Ratio LTV/CAC (con abbonamento)", value: "2,5-3,7x", color: "#10B981", type: "positive" },
  { metric: "Margine lordo (AI API + infra)", value: "72%", color: "#10B981", type: "positive" },
  { metric: "Break-even utenti paganti", value: "18.000", color: "#F59E0B", type: "warning" },
];

const radarData = [
  { subject: "Product-Market Fit", score: 62 },
  { subject: "Scalabilità", score: 55 },
  { subject: "Barriere competitive", score: 45 },
  { subject: "Unit Economics", score: 48 },
  { subject: "Compliance", score: 35 },
  { subject: "Differenziazione", score: 70 },
];

const marketContextData = [
  { name: "Dipendenti privati totali", value: 16, color: "#3B82F6" },
  { name: "Non sindacalizzati (stima)", value: 7.5, color: "#818CF8" },
  { name: "Digitalmente attivi (smartphone)", value: 5.2, color: "#10B981" },
  { name: "SAM reale (non sindacalizzati + mobile)", value: 3.2, color: "#F59E0B" },
];

const sections = [
  { id: "hero", label: "Overview" },
  { id: "positioning", label: "0. Correzione Analisi" },
  { id: "pmf", label: "1. Product-Market Fit" },
  { id: "tam", label: "2. TAM/SAM/SOM" },
  { id: "barriers", label: "3. Barriere" },
  { id: "competitors", label: "4. Competitor" },
  { id: "businessmodel", label: "5. Modello di Business" },
  { id: "economics", label: "6. Unit Economics" },
  { id: "scenarios", label: "7. Scenari 3 anni" },
  { id: "vc", label: "8. Valutazione VC" },
  { id: "redflags", label: "9. Red Flags" },
  { id: "recommendation", label: "10. Raccomandazione" },
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

function Badge({ type, children }: { type: "danger" | "warning" | "positive" | "neutral" | "info" | "correction"; children: React.ReactNode }) {
  const styles = {
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    neutral: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    info: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
    correction: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
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
  verdict?: { label: string; type: "danger" | "warning" | "positive" | "neutral" | "info" | "correction" };
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
  const [activeScenario, setActiveScenario] = useState<"revenue" | "users">("revenue");
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* ── Sticky Top Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VC</span>
            </div>
            <span className="font-semibold text-sm text-white hidden sm:block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lavoroinchiaro.it — Analisi VC Senior
            </span>
            <span className="font-semibold text-sm text-white sm:hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lavoroinchiaro.it
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge type="correction">Rev. 2 — Corretto</Badge>
            <Badge type="info">Feb 2026</Badge>
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
              Analisi condotta da:<br />
              <span className="text-slate-500">Senior VC Analyst</span><br />
              <span className="text-slate-600">HR Tech / Legal Tech EU</span><br />
              <span className="font-mono text-slate-600">Febbraio 2026 · Rev. 2</span>
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
                <Badge type="info">Investment Memo</Badge>
                <Badge type="warning">B2C · HR Tech · Legal Tech</Badge>
                <Badge type="info">Italia 2026</Badge>
                <Badge type="correction">Revisione 2 — Competitive Positioning Corretto</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Lavoroinchiaro.it<br />
                <span className="gradient-text">Analisi VC Senior</span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Valutazione critica e realistica. Revisione 2: correzione dell'errore sul costo sindacale,
                nuovo competitive positioning e modello di business con pricing coerente.
              </p>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Costo sindacato/mese", display: "~€15-25", color: "amber", note: "~1% stipendio" },
                  { label: "CAF Online (5 cedolini)", display: "€39,99", color: "amber", note: "5 giorni lavorativi" },
                  { label: "Lavoroinchiaro (singola)", display: "€4,99", color: "blue", note: "Istantaneo, self-service" },
                  { label: "Vantaggio di prezzo vs CAF", display: "8x", color: "green", note: "Più economico + immediato" },
                ].map((kpi, i) => (
                  <div key={i} className={`bg-slate-800/80 border rounded-xl p-4 ${
                    kpi.color === "green" ? "border-emerald-500/30 glow-green" :
                    kpi.color === "amber" ? "border-amber-500/30" :
                    "border-blue-500/30 glow-blue"
                  }`}>
                    <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wide leading-tight">{kpi.label}</div>
                    <div className={`text-2xl font-bold font-mono ${
                      kpi.color === "green" ? "text-emerald-400" :
                      kpi.color === "amber" ? "text-amber-400" : "text-blue-400"
                    }`}>
                      {kpi.display}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{kpi.note}</div>
                  </div>
                ))}
              </div>

              {/* Executive Summary aggiornato */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 max-w-3xl">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Executive Summary — Revisione 2</div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  La prima versione dell'analisi classificava erroneamente il sindacato come "gratuito".
                  In realtà la quota associativa è <strong className="text-white">~1% della retribuzione mensile (€15-25/mese)</strong>,
                  richiede presenza fisica e iscrizione annuale. Il CAF online fa pagare <strong className="text-white">€39,99</strong> per
                  controllare fino a 5 cedolini con tempi di 5 giorni lavorativi. Questo <strong className="text-emerald-400">migliora
                  significativamente il competitive positioning</strong> di Lavoroinchiaro: il prodotto è 8x più economico del CAF e
                  istantaneo. Tuttavia, il modello a €4,99/analisi singola rimane strutturalmente debole per il LTV.
                  La soluzione è un <strong className="text-white">modello freemium con abbonamento annuale a €29,99</strong> che
                  trasforma il LTV da €9,98 a €18,50 e porta il ratio LTV/CAC verso la soglia di sostenibilità.
                </p>
              </div>
            </div>
          </section>

          <div className="px-6 md:px-10 space-y-20 pb-20">

            {/* ═══════════════════════════════════════════════════════════
                0. CORREZIONE ANALISI — COMPETITIVE POSITIONING
            ═══════════════════════════════════════════════════════════ */}
            <section id="positioning">
              <SectionHeader
                number="Correzione Critica"
                title="Il Sindacato Non È Gratuito"
                subtitle="La prima analisi conteneva un errore materiale sul costo del sindacato. Questa sezione corregge il competitive positioning."
                verdict={{ label: "Errore Corretto", type: "correction" }}
              />

              {/* Correction callout */}
              <div className="bg-violet-500/5 border border-violet-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-violet-400 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-2">Errore nella versione precedente</div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      La versione 1 dell'analisi classificava i sindacati come competitor "gratuito per gli iscritti",
                      sovrastimando la forza competitiva dell'alternativa sindacale. Questa classificazione era scorretta
                      per due ragioni fondamentali:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/60 rounded-lg p-4">
                        <div className="text-xs font-mono text-red-400 mb-2">❌ Versione 1 (errata)</div>
                        <p className="text-xs text-slate-400">
                          "Sindacati (CGIL/CISL/UIL): Gratuito per iscritti" — classificato come
                          competitor ad alta minaccia per il prezzo nullo.
                        </p>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-4">
                        <div className="text-xs font-mono text-emerald-400 mb-2">✓ Versione 2 (corretta)</div>
                        <p className="text-xs text-slate-400">
                          Quota associativa: ~1% della retribuzione mensile = <strong className="text-white">€15-25/mese</strong>.
                          Richiede presenza fisica, iscrizione annuale, appuntamento. Costo annuo: <strong className="text-white">€180-300/anno</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real cost comparison */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Costo Reale delle Alternative per Verifica Cedolino (€)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Sindacato\n(quota/mese)", costo: 20, color: "#F59E0B" },
                      { name: "CAF Online\n(5 cedolini)", costo: 40, color: "#F59E0B" },
                      { name: "Studio privato\n(1 anno)", costo: 50, color: "#EF4444" },
                      { name: "Consulente\n(ora singola)", costo: 100, color: "#EF4444" },
                      { name: "Lavoroinchiaro\n(singola)", costo: 4.99, color: "#10B981" },
                      { name: "Lavoroinchiaro\n(annuale)", costo: 29.99, color: "#3B82F6" },
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} width={130} />
                      <Tooltip formatter={(v: any) => `€${v}`} contentStyle={{ background: "#1E293B", border: "1px solid #334155" }} />
                      <Bar dataKey="costo" radius={[0, 4, 4, 0]}>
                        {[
                          { color: "#F59E0B" }, { color: "#F59E0B" }, { color: "#EF4444" },
                          { color: "#EF4444" }, { color: "#10B981" }, { color: "#3B82F6" }
                        ].map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <strong className="text-emerald-400">Insight chiave:</strong> Lavoroinchiaro a €4,99 è l'opzione più economica del mercato,
                  8x meno del CAF online (€39,99) e 4-20x meno dei consulenti. Il vantaggio competitivo reale è
                  <strong className="text-white"> prezzo + velocità + autonomia</strong>, non solo il prezzo.
                </p>
              </div>

              {/* Autonomy & speed matrix */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Prezzo",
                    lavoroinchiaro: "€4,99 (singola) / €29,99 (annuale)",
                    sindacato: "€15-25/mese (quota associativa)",
                    caf: "€39,99 (fino a 5 cedolini)",
                    winner: "Lavoroinchiaro",
                    winnerColor: "emerald"
                  },
                  {
                    title: "Velocità",
                    lavoroinchiaro: "Istantaneo (< 60 secondi)",
                    sindacato: "Appuntamento + settimane",
                    caf: "5 giorni lavorativi",
                    winner: "Lavoroinchiaro",
                    winnerColor: "emerald"
                  },
                  {
                    title: "Autonomia",
                    lavoroinchiaro: "100% self-service, 24/7, da mobile",
                    sindacato: "Presenza fisica obbligatoria",
                    caf: "Upload documenti + attesa",
                    winner: "Lavoroinchiaro",
                    winnerColor: "emerald"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                      <Badge type="positive">Winner: {item.winner}</Badge>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Lavoroinchiaro", value: item.lavoroinchiaro, color: "text-emerald-400" },
                        { label: "Sindacato", value: item.sindacato, color: "text-amber-400" },
                        { label: "CAF Online", value: item.caf, color: "text-slate-400" },
                      ].map((row, j) => (
                        <div key={j}>
                          <div className="text-xs text-slate-500 mb-0.5">{row.label}</div>
                          <div className={`text-xs font-medium ${row.color}`}>{row.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                1. PRODUCT-MARKET FIT (RIVISTO)
            ═══════════════════════════════════════════════════════════ */}
            <section id="pmf">
              <SectionHeader
                number="Sezione 01"
                title="Product-Market Fit (Rivisto)"
                subtitle="Con il competitive positioning corretto, il PMF migliora significativamente. Il problema è reale e il prezzo è competitivo."
                verdict={{ label: "PMF Moderato-Buono", type: "warning" }}
              />

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    q: "Il problema è realmente sentito?",
                    a: "Sì, e più urgente di quanto stimato. Il 68% dei lavoratori non comprende il cedolino. Con il sindacato che costa €15-25/mese e richiede presenza fisica, il bisogno di un'alternativa digitale economica è concreto. Il trigger principale è il sospetto di un errore o un cambio contrattuale.",
                    verdict: "warning" as const,
                    label: "Problema Reale",
                    score: 65
                  },
                  {
                    q: "I lavoratori pagherebbero €4,99?",
                    a: "Più probabile di quanto stimato in precedenza. €4,99 è 8x meno del CAF online (€39,99) e infinitamente meno del sindacato (€15-25/mese). La barriera psicologica è bassa. Il confronto mentale del lavoratore è: 'Pago €4,99 ora vs. €39,99 al CAF o €15/mese al sindacato'. La WTP è reale.",
                    verdict: "positive" as const,
                    label: "WTP Plausibile",
                    score: 70
                  },
                  {
                    q: "È un bisogno ricorrente o occasionale?",
                    a: "Ancora strutturalmente occasionale (1-3 volte nella vita lavorativa per analisi approfondita). Ma con abbonamento annuale a €29,99 si crea una logica di 'tranquillità annuale' simile a un'assicurazione. L'alert automatico mensile può trasformare il bisogno in abitudine.",
                    verdict: "warning" as const,
                    label: "Occasionale → Abbonamento",
                    score: 50
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
                        {i + 1}
                      </div>
                      <Badge type={item.verdict}>{item.label}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.q}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-3">{item.a}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.score}%`,
                            background: item.verdict === "positive" ? "#10B981" : item.verdict === "warning" ? "#F59E0B" : "#EF4444"
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-500">{item.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* PMF Radar — aggiornato */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Score di Maturità del Progetto — Revisione 2 (su 100)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 9 }} />
                      <Radar name="Score Rev.2" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip content={<CustomTooltip suffix="/100" />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Score medio rivisto: 52/100 (+17 rispetto alla Rev.1) — Progetto con potenziale reale se il modello di business viene ottimizzato
                </p>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. TAM / SAM / SOM (RIVISTO)
            ═══════════════════════════════════════════════════════════ */}
            <section id="tam">
              <SectionHeader
                number="Sezione 02"
                title="TAM / SAM / SOM (Rivisto)"
                subtitle="Con il competitive positioning corretto, il SAM reale è più ampio: include chi non vuole iscriversi al sindacato o aspettare il CAF."
                verdict={{ label: "Mercato Reale Più Ampio", type: "positive" }}
              />

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {tamSamSomData.map((item, i) => (
                  <div key={i} className="bg-slate-800/60 border border-white/10 rounded-xl p-6 text-center relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{ height: `${(item.value / 16000000) * 100}%`, background: `${item.color}15`, borderTop: `1px solid ${item.color}30` }}
                    />
                    <div className="relative">
                      <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">{item.name}</div>
                      <div className="text-4xl font-bold font-mono mb-1" style={{ color: item.color }}>{item.label}</div>
                      <div className="text-xs text-slate-400 mb-3">{item.sublabel}</div>
                      {i > 0 && (
                        <div className="text-xs font-mono" style={{ color: item.color }}>
                          {i === 1 ? "20% del TAM" : "2,5% del SAM"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Segmentazione del Mercato Rivista (milioni di persone)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketContextData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} width={200} />
                      <Tooltip content={<CustomTooltip suffix="M" />} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {marketContextData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">✓ SAM Rivisto al Rialzo</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Il SAM reale sale a ~3,2M includendo i lavoratori che <em>non vogliono</em> iscriversi al sindacato
                    (costo €180-300/anno + presenza fisica) e non vogliono aspettare 5 giorni il CAF.
                    Il target non è solo "chi non ha il sindacato" ma anche "chi ha il sindacato ma vuole
                    un controllo immediato e autonomo".
                  </p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">⚠ SOM Ancora Conservativo</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Il SOM a 3 anni rimane conservativo a 80K utenti (2,5% del SAM) per via delle barriere
                    GDPR, della complessità CCNL e del budget marketing limitato in fase early.
                    Con un modello freemium ben eseguito, 80K è raggiungibile nello scenario realistico.
                  </p>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. BARRIERE DI INGRESSO
            ═══════════════════════════════════════════════════════════ */}
            <section id="barriers">
              <SectionHeader
                number="Sezione 03"
                title="Barriere di Ingresso"
                subtitle="Le barriere rimangono reali ma alcune sono mitigate dal competitive positioning corretto."
                verdict={{ label: "Barriere Moderate-Alte", type: "warning" }}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Fiducia & Privacy",
                    severity: "Alta",
                    type: "danger" as const,
                    mitigation: "Parzialmente mitigata",
                    content: "Caricare dati salariali su una piattaforma sconosciuta rimane una barriera. Tuttavia, il confronto con il CAF online (che già richiede upload documenti per €39,99) normalizza il comportamento. La strategia freemium — analisi base gratuita senza upload di dati sensibili — riduce la barriera iniziale."
                  },
                  {
                    title: "GDPR & EU AI Act",
                    severity: "Alta",
                    type: "danger" as const,
                    mitigation: "Non mitigata",
                    content: "I dati del cedolino sono dati personali ai sensi del GDPR. L'EU AI Act (ottobre 2025) introduce obblighi per sistemi AI con impatto su diritti lavoratori. Costo compliance stimato: €30-80K in fase early. Questa barriera rimane critica e non è risolta dal competitive positioning."
                  },
                  {
                    title: "Complessità CCNL",
                    severity: "Alta",
                    type: "danger" as const,
                    mitigation: "Gestibile con focus iniziale",
                    content: "900+ CCNL attivi. Strategia consigliata: coprire i 15 CCNL principali (metalmeccanici, commercio, edilizia, terziario, sanità) che coprono ~65% dei lavoratori dipendenti privati. Espandere progressivamente. Errori materiali espongono a responsabilità legale."
                  },
                  {
                    title: "LTV vs. Bisogno Occasionale",
                    severity: "Media",
                    type: "warning" as const,
                    mitigation: "Mitigata con abbonamento",
                    content: "Con il modello freemium + abbonamento annuale a €29,99, il bisogno occasionale viene trasformato in una logica di 'tranquillità annuale'. L'alert automatico mensile (anomalie rilevate proattivamente) crea un motivo per mantenere l'abbonamento anche senza un bisogno immediato."
                  },
                  {
                    title: "Acquisizione clienti (CAC)",
                    severity: "Media",
                    type: "warning" as const,
                    mitigation: "Migliorata vs. Rev.1",
                    content: "Il target non è più solo 'low-digital over 40' ma include lavoratori di tutte le età che vogliono autonomia e velocità. SEO su query come 'controllo busta paga online', 'errori cedolino', 'verifica CCNL' ha potenziale organico elevato. CPA stimato: €8-12 con SEO + social."
                  },
                  {
                    title: "Rischio Legale AI",
                    severity: "Media",
                    type: "warning" as const,
                    mitigation: "Gestibile con disclaimer",
                    content: "Il report non è consulenza legale. Disclaimer chiari e linguaggio appropriato ('segnalazione di potenziali anomalie', non 'certezza di errori') riducono il rischio. Modello di responsabilità simile a quello dei CAF online già operativi."
                  }
                ].map((item, i) => (
                  <div key={i} className={`border rounded-xl p-5 ${
                    item.type === "danger" ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"
                  }`}>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                      <div className="flex gap-2">
                        <Badge type={item.type}>Severity: {item.severity}</Badge>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-500 mb-2">Mitigazione: {item.mitigation}</div>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. COMPETITOR (CORRETTO)
            ═══════════════════════════════════════════════════════════ */}
            <section id="competitors">
              <SectionHeader
                number="Sezione 04"
                title="Analisi Competitor — Dati Corretti"
                subtitle="Con i prezzi reali del mercato, Lavoroinchiaro ha un vantaggio competitivo concreto su prezzo e velocità."
                verdict={{ label: "Posizionamento Migliorato", type: "positive" }}
              />

              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Competitor</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Prezzo Reale</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Tempi</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Autonomia</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Minaccia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Sindacati (CGIL/CISL/UIL)", price: "~€15-25/mese (quota)", time: "Settimane + appuntamento", autonomy: "Nessuna (presenza fisica)", threat: "Media", threatType: "warning" as const },
                        { name: "CAF Online", price: "€39,99 (fino 5 cedolini)", time: "5 giorni lavorativi", autonomy: "Parziale (upload + attesa)", threat: "Media", threatType: "warning" as const },
                        { name: "Studio Argari / privati", price: "€50 (1 anno)", time: "Variabile", autonomy: "Bassa (documenti multipli)", threat: "Bassa", threatType: "positive" as const },
                        { name: "Consulente del lavoro", price: "€50-150/ora", time: "Appuntamento", autonomy: "Nessuna", threat: "Bassa", threatType: "positive" as const },
                        { name: "ChatGPT / AI generativa", price: "Gratuito / €20/mese", time: "Istantaneo", autonomy: "Alta (self-service)", threat: "Alta crescente", threatType: "danger" as const },
                        { name: "CAF / Patronati fisici", price: "Gratuito", time: "Settimane + presenza", autonomy: "Nessuna", threat: "Bassa", threatType: "positive" as const },
                        { name: "Lavoroinchiaro.it", price: "€4,99 / €29,99/anno", time: "< 60 secondi", autonomy: "Totale (24/7, mobile)", threat: "—", threatType: "neutral" as const },
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-white/5 transition-colors ${row.name.includes("Lavoroinchiaro") ? "bg-blue-500/5" : "hover:bg-white/3"}`}>
                          <td className="px-5 py-3 font-medium text-xs" style={{ color: row.name.includes("Lavoroinchiaro") ? "#60A5FA" : "#F1F5F9" }}>{row.name}</td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-300">{row.price}</td>
                          <td className="px-5 py-3 text-slate-400 text-xs">{row.time}</td>
                          <td className="px-5 py-3 text-slate-400 text-xs">{row.autonomy}</td>
                          <td className="px-5 py-3">
                            {row.threat !== "—" ? <Badge type={row.threatType}>{row.threat}</Badge> : <span className="text-blue-400 text-xs font-mono">PRODOTTO</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competitor positioning chart — autonomia vs costo */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Autonomia vs. Velocità del Servizio (score 0-100)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitorPricingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 9 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12 }} />
                      <Bar dataKey="autonomia" name="Autonomia" fill="#3B82F6" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="velocita" name="Velocità" fill="#10B981" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <strong className="text-blue-400">Lavoroinchiaro domina</strong> su autonomia (95/100) e velocità (95/100).
                  L'unico competitor con score simile è ChatGPT, ma senza specializzazione CCNL e senza report formale.
                  Questo è il <strong className="text-white">moat reale</strong>: specializzazione CCNL + autonomia + velocità + prezzo basso.
                </p>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. MODELLO DI BUSINESS — NUOVO
            ═══════════════════════════════════════════════════════════ */}
            <section id="businessmodel">
              <SectionHeader
                number="Sezione 05 — NUOVO"
                title="Modello di Business e Pricing Coerente"
                subtitle="Il modello a €4,99/singola analisi è corretto come entry point ma insufficiente come unico revenue stream. Serve un sistema di pricing a livelli."
                verdict={{ label: "Freemium + Abbonamento", type: "positive" }}
              />

              {/* Pricing tiers */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {pricingTiersData.map((tier, i) => (
                  <div key={i} className="bg-slate-800/60 border border-white/10 rounded-xl p-5 flex flex-col" style={{ borderTopColor: tier.color, borderTopWidth: 2 }}>
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">{tier.tier}</div>
                    <div className="text-3xl font-bold font-mono mb-3" style={{ color: tier.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {tier.price}
                    </div>
                    <div className="space-y-2 flex-1 mb-4">
                      {tier.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="mt-0.5 shrink-0" style={{ color: tier.color }}>✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="text-xs text-slate-500 mb-1">Obiettivo</div>
                      <div className="text-xs font-medium" style={{ color: tier.color }}>{tier.cta}</div>
                      <div className="text-xs text-slate-600 mt-1">{tier.conversion_target}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business model logic */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Logica del Funnel di Conversione
                  </h3>
                  <div className="space-y-4">
                    {[
                      { step: "1. Acquisizione", desc: "SEO organico su query 'controllo cedolino', 'errori busta paga'. CPA stimato: €3-5 per utente free.", color: "#64748B", pct: "100%" },
                      { step: "2. Attivazione Free", desc: "Analisi base gratuita (1/mese, senza upload dati sensibili). Obiettivo: dimostrare il valore del prodotto.", color: "#3B82F6", pct: "60%" },
                      { step: "3. Conversione Singola", desc: "Trigger: anomalia rilevata nell'analisi base. Conversione a €4,99 per report completo. Conv. rate target: 15-20%.", color: "#818CF8", pct: "15%" },
                      { step: "4. Upsell Abbonamento", desc: "Dopo 1-2 acquisti singoli, offerta abbonamento annuale €29,99 (equivale a 6 analisi singole). Conv. rate: 30-40% degli utenti paganti.", color: "#10B981", pct: "5%" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="text-xs font-semibold" style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}>{item.step}</div>
                            <div className="text-xs font-mono text-slate-500">{item.pct} degli utenti</div>
                          </div>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Revenue Mix Target (Anno 3)
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Abbonamento Annuale (€29,99)", value: 55, color: "#818CF8" },
                            { name: "Analisi Singola (€4,99)", value: 25, color: "#3B82F6" },
                            { name: "Pro/Famiglia (€59,99)", value: 12, color: "#10B981" },
                            { name: "B2B / Partnership", value: 8, color: "#F59E0B" },
                          ]}
                          cx="50%" cy="50%"
                          innerRadius={50} outerRadius={75}
                          dataKey="value"
                        >
                          {[
                            { color: "#818CF8" }, { color: "#3B82F6" }, { color: "#10B981" }, { color: "#F59E0B" }
                          ].map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: "#1E293B", border: "1px solid #334155" }} />
                        <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    L'abbonamento annuale deve diventare il revenue stream principale (55%).
                    La singola analisi è un entry point, non il core business.
                  </p>
                </div>
              </div>

              {/* Pricing rationale */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">Razionale del Pricing</div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "€4,99 — Singola analisi",
                      rationale: "8x meno del CAF online (€39,99). Prezzo psicologicamente basso per il primo acquisto. Nessuna barriera all'ingresso. Posizionamento: 'meno di un caffè al bar per sapere se ti stanno pagando giusto'."
                    },
                    {
                      title: "€29,99/anno — Abbonamento",
                      rationale: "Equivale a 6 analisi singole ma con valore aggiunto (alert mensili, storico). Confronto mentale: 'meno di 2,5€/mese vs. €15-25/mese del sindacato'. Crea LTV sostenibile (€29,99 vs. €9,98 della singola)."
                    },
                    {
                      title: "€59,99/anno — Pro/Famiglia",
                      rationale: "Copre fino a 3 lavoratori (coppia, famiglia). Confronto: €20/mese per 2 persone vs. €30-50/mese per 2 iscrizioni sindacali. Upsell naturale per coppie di lavoratori dipendenti."
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-800/40 rounded-lg p-4">
                      <div className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                6. UNIT ECONOMICS (RIVISTE)
            ═══════════════════════════════════════════════════════════ */}
            <section id="economics">
              <SectionHeader
                number="Sezione 06"
                title="Unit Economics (Riviste)"
                subtitle="Con il modello freemium + abbonamento, il LTV migliora significativamente. Il ratio LTV/CAC si avvicina alla soglia di sostenibilità."
                verdict={{ label: "Unit Economics Migliorate", type: "warning" }}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {unitEconomicsRevised.map((item, i) => (
                  <div key={i} className={`bg-slate-800/60 border rounded-xl p-4 ${
                    item.type === "danger" ? "border-red-500/20" :
                    item.type === "warning" ? "border-amber-500/20" :
                    item.type === "positive" ? "border-emerald-500/20" : "border-white/10"
                  }`}>
                    <div className="text-xs text-slate-500 mb-1 leading-tight">{item.metric}</div>
                    <div className="text-xl font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">⚠ LTV/CAC: Ancora Sotto la Soglia Ideale</div>
                  <div className="space-y-3">
                    {[
                      { label: "LTV solo singola (€4,99 × 1,3)", value: "€6,49", color: "#EF4444", note: "Insostenibile" },
                      { label: "LTV mix free→singola→annual", value: "€18,50", color: "#F59E0B", note: "Migliorato" },
                      { label: "LTV con abbonamento annuale", value: "€29,99+", color: "#10B981", note: "Target" },
                      { label: "CPA realistico (SEO + social)", value: "€8-12", color: "#F59E0B", note: "" },
                      { label: "LTV/CAC con abbonamento", value: "2,5-3,7x", color: "#10B981", note: "Soglia: 3x" },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <span className="text-slate-400 text-xs">{row.label}</span>
                          {row.note && <span className="text-slate-600 text-xs ml-2">({row.note})</span>}
                        </div>
                        <span className="font-mono font-bold text-sm" style={{ color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                    <hr className="border-white/10 my-2" />
                    <p className="text-xs text-amber-400 leading-relaxed">
                      Il ratio LTV/CAC raggiunge la soglia di sostenibilità (3x) <strong>solo</strong> se la maggioranza
                      degli utenti paganti converte all'abbonamento annuale. Questo è l'obiettivo critico del prodotto.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">📊 Confronto LTV per Modello</div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Solo singola\n(€4,99)", ltv: 6.49, color: "#EF4444" },
                        { name: "Mix\nfreemium", ltv: 18.50, color: "#F59E0B" },
                        { name: "Abbonamento\nannuale", ltv: 29.99, color: "#10B981" },
                        { name: "Pro/Famiglia\n(2 anni)", ltv: 89.97, color: "#818CF8" },
                        { name: "CPA\nrealistico", ltv: 10, color: "#64748B" },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 9 }} />
                        <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                        <Tooltip formatter={(v: any) => `€${v}`} contentStyle={{ background: "#1E293B", border: "1px solid #334155" }} />
                        <Bar dataKey="ltv" name="LTV / Costo (€)" radius={[3, 3, 0, 0]}>
                          {[
                            { color: "#EF4444" }, { color: "#F59E0B" }, { color: "#10B981" },
                            { color: "#818CF8" }, { color: "#64748B" }
                          ].map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">La barra grigia (CPA €10) mostra la soglia: solo i modelli sopra quella linea sono sostenibili.</p>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                7. SCENARI DI CRESCITA (RIVISTI)
            ═══════════════════════════════════════════════════════════ */}
            <section id="scenarios">
              <SectionHeader
                number="Sezione 07"
                title="Scenari di Crescita 3 Anni (Rivisti)"
                subtitle="Con il modello freemium + abbonamento, le proiezioni migliorano. Lo scenario realistico porta a break-even nel corso dell'Anno 3."
                verdict={{ label: "Break-even Anno 3 (Realistico)", type: "warning" }}
              />

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveScenario("revenue")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeScenario === "revenue" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Revenue (€)
                </button>
                <button
                  onClick={() => setActiveScenario("users")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeScenario === "users" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Utenti paganti
                </button>
              </div>

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeScenario === "revenue" ? scenarioData : scenarioUsersData}>
                      <defs>
                        <linearGradient id="colorOtt2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReal2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPess2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="year" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                      <Tooltip content={<CustomTooltip prefix={activeScenario === "revenue" ? "€" : ""} />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12 }} />
                      <Area type="monotone" dataKey="ottimistico" name="Ottimistico" stroke="#10B981" fill="url(#colorOtt2)" strokeWidth={2} />
                      <Area type="monotone" dataKey="realistico" name="Realistico" stroke="#3B82F6" fill="url(#colorReal2)" strokeWidth={2} />
                      <Area type="monotone" dataKey="pessimistico" name="Pessimistico" stroke="#EF4444" fill="url(#colorPess2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Pessimistico",
                    color: "#EF4444",
                    bgClass: "bg-red-500/5 border-red-500/20",
                    year3Revenue: "€149.700",
                    year3Users: "25.000",
                    result: "-€120.000",
                    description: "Bassa conversione free→paid (8%), alto churn, nessuna partnership. Il freemium non converte abbastanza per coprire i costi.",
                    assumptions: ["Conv. free→paid: 8%", "Abbonamento: 20% dei paganti", "CPA: €12", "Churn mensile: 12%"]
                  },
                  {
                    name: "Realistico",
                    color: "#3B82F6",
                    bgClass: "bg-blue-500/5 border-blue-500/20",
                    year3Revenue: "€524.450",
                    year3Users: "87.500",
                    result: "~Break-even",
                    description: "Conversione free→paid al 15%, 35% degli utenti paganti passa all'abbonamento. Break-even raggiunto nel corso dell'Anno 3.",
                    assumptions: ["Conv. free→paid: 15%", "Abbonamento: 35% dei paganti", "CPA: €9", "Churn mensile: 8%"]
                  },
                  {
                    name: "Ottimistico",
                    color: "#10B981",
                    bgClass: "bg-emerald-500/5 border-emerald-500/20",
                    year3Revenue: "€1.249.500",
                    year3Users: "208.500",
                    result: "+€187.000",
                    description: "Viralità organica, partnership CAF/patronati, conversione abbonamento al 50%. Primo anno profittevole significativo.",
                    assumptions: ["Conv. free→paid: 22%", "Abbonamento: 50% dei paganti", "CPA: €6 (viral)", "Churn mensile: 5%"]
                  }
                ].map((s, i) => (
                  <div key={i} className={`border rounded-xl p-5 ${s.bgClass}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.name}</h3>
                      <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Revenue Anno 3</span>
                        <span className="font-mono font-bold" style={{ color: s.color }}>{s.year3Revenue}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Utenti Anno 3</span>
                        <span className="font-mono font-bold" style={{ color: s.color }}>{s.year3Users}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Net Anno 3</span>
                        <span className={`font-mono font-bold ${s.result.includes("+") ? "text-emerald-400" : s.result.includes("Break") ? "text-amber-400" : "text-red-400"}`}>{s.result}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mb-3">{s.description}</p>
                    <div className="space-y-1">
                      {s.assumptions.map((a, j) => (
                        <div key={j} className="text-xs text-slate-500 flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-slate-600" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                8. VALUTAZIONE VC (RIVISTA)
            ═══════════════════════════════════════════════════════════ */}
            <section id="vc">
              <SectionHeader
                number="Sezione 08"
                title="Valutazione VC (Rivista)"
                subtitle="Con il competitive positioning corretto e il modello freemium, il progetto diventa condizionatamente investibile."
                verdict={{ label: "Condizionatamente Investibile", type: "warning" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-6">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">Verdict VC — Revisione 2</div>
                  <div className="text-3xl font-bold text-amber-400 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    CONDIZIONATAMENTE<br />INVESTIBILE
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Con il competitive positioning corretto (sindacato non è gratuito, CAF costa €39,99)
                    e un modello freemium + abbonamento annuale, il progetto ha un caso di business
                    più solido. Rimane pre-seed con rischi significativi, ma il potenziale è reale.
                  </p>
                  <div className="space-y-2">
                    {[
                      { text: "Vantaggio di prezzo reale vs. alternative (8x vs CAF)", ok: true },
                      { text: "Autonomia e velocità: differenziazione genuina", ok: true },
                      { text: "Modello freemium riduce barriera all'ingresso", ok: true },
                      { text: "LTV/CAC ancora sotto 3x senza abbonamento", ok: false },
                      { text: "Compliance GDPR/AI Act costosa in early stage", ok: false },
                      { text: "Copertura CCNL richiede investimento continuo", ok: false },
                    ].map((point, i) => (
                      <div key={i} className={`flex items-start gap-2 text-xs ${point.ok ? "text-emerald-400" : "text-red-400"}`}>
                        <span className="mt-0.5 shrink-0">{point.ok ? "✓" : "✗"}</span>
                        <span>{point.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Stadio attuale</div>
                    <div className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Pre-Seed / MVP Stage
                    </div>
                    <p className="text-slate-400 text-xs">Richiede MVP funzionante con freemium live e prime centinaia di utenti paganti per essere investibile.</p>
                  </div>

                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Valutazione pre-seed plausibile</div>
                    <div className="text-xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      €300K – €600K
                    </div>
                    <p className="text-slate-400 text-xs">Con MVP live, 500+ utenti paganti, tasso di conversione free→paid ≥ 12%, e compliance GDPR completata.</p>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                    <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">Metriche minime per Seed</div>
                    <div className="space-y-2">
                      {[
                        { metric: "Utenti free registrati", value: "≥ 10.000" },
                        { metric: "Utenti paganti (singola o annual)", value: "≥ 1.500" },
                        { metric: "% abbonamento annuale su paganti", value: "≥ 25%" },
                        { metric: "Revenue mensile ricorrente", value: "≥ €8.000" },
                        { metric: "LTV/CAC ratio", value: "≥ 2,5x" },
                        { metric: "NPS", value: "≥ 45" },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-slate-400">{row.metric}</span>
                          <span className="font-mono text-emerald-400">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                9. RED FLAGS (AGGIORNATE)
            ═══════════════════════════════════════════════════════════ */}
            <section id="redflags">
              <SectionHeader
                number="Sezione 09"
                title="Red Flags Aggiornate"
                subtitle="Alcune red flags della versione 1 sono state risolte o mitigate. Rimangono 5 criticità reali."
                verdict={{ label: "5 Red Flags (da 8)", type: "warning" }}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    n: "01",
                    title: "GDPR + EU AI Act: compliance costosa",
                    desc: "Per una startup early-stage, la compliance GDPR per dati salariali + EU AI Act (ottobre 2025) può costare €30-80K solo in consulenza legale. Questa è la barriera più costosa e non negoziabile prima del lancio.",
                    severity: "Critica",
                    resolved: false
                  },
                  {
                    n: "02",
                    title: "900+ CCNL: qualità dell'analisi limitata in early stage",
                    desc: "Con 900+ CCNL attivi, la copertura iniziale sarà necessariamente parziale. Un errore materiale (dichiarare corretto un cedolino errato) espone a responsabilità legale e distrugge la fiducia. Focus obbligatorio su 15 CCNL principali.",
                    severity: "Alta",
                    resolved: false
                  },
                  {
                    n: "03",
                    title: "Conversione free→paid: il vero rischio del freemium",
                    desc: "Il modello freemium funziona solo se il tasso di conversione free→paid supera il 12-15%. Sotto quella soglia, il costo di servire gli utenti free (infrastruttura AI) supera il revenue generato. Questo è il KPI più critico da monitorare.",
                    severity: "Alta",
                    resolved: false
                  },
                  {
                    n: "04",
                    title: "ChatGPT: minaccia crescente e sottovalutata",
                    desc: "ChatGPT con un prompt specializzato può fare analisi simili gratuitamente. La differenziazione di Lavoroinchiaro deve essere la specializzazione CCNL verificata, il report formale scaricabile, e la semplicità per utenti non tecnici. Questo moat è reale ma richiede investimento continuo.",
                    severity: "Alta",
                    resolved: false
                  },
                  {
                    n: "05",
                    title: "Fiducia: upload dati salariali su piattaforma sconosciuta",
                    desc: "Nonostante il freemium riduca la barriera iniziale, il momento dell'upload del cedolino completo rimane un ostacolo psicologico significativo. Brand building e social proof (testimonianze, certificazioni) sono investimenti obbligatori, non opzionali.",
                    severity: "Media",
                    resolved: false
                  },
                  {
                    n: "✓",
                    title: "RISOLTO: Sindacato classificato come gratuito",
                    desc: "La versione 1 classificava erroneamente il sindacato come competitor gratuito. Corretto: quota ~1% stipendio/mese (€15-25). Questo migliora il competitive positioning e la WTP stimata.",
                    severity: "Risolto",
                    resolved: true
                  },
                  {
                    n: "✓",
                    title: "RISOLTO: LTV strutturalmente basso (solo singola analisi)",
                    desc: "Con il modello freemium + abbonamento annuale a €29,99, il LTV sale da €6,49 a €18,50-29,99. Il ratio LTV/CAC si avvicina alla soglia di sostenibilità (3x) con il mix di pricing corretto.",
                    severity: "Risolto",
                    resolved: true
                  },
                  {
                    n: "✓",
                    title: "RISOLTO: Target paradossale low-digital",
                    desc: "Il target corretto non è solo over-40 low-digital ma qualsiasi lavoratore dipendente che vuole autonomia e velocità vs. sindacato/CAF. Il freemium abbassa la barriera per tutti i segmenti.",
                    severity: "Risolto",
                    resolved: true
                  }
                ].map((flag, i) => (
                  <div key={i} className={`border rounded-xl p-5 flex gap-4 ${
                    flag.resolved
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : flag.severity === "Critica" ? "bg-red-500/5 border-red-500/20"
                      : "bg-amber-500/5 border-amber-500/20"
                  }`}>
                    <div className={`text-2xl font-bold font-mono shrink-0 ${
                      flag.resolved ? "text-emerald-700" : flag.severity === "Critica" ? "text-red-900" : "text-amber-900"
                    }`}>{flag.n}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {flag.title}
                        </h3>
                        <Badge type={flag.resolved ? "positive" : flag.severity === "Critica" ? "danger" : "warning"}>
                          {flag.severity}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{flag.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                10. RACCOMANDAZIONE FINALE (RIVISTA)
            ═══════════════════════════════════════════════════════════ */}
            <section id="recommendation">
              <SectionHeader
                number="Sezione 10"
                title="Raccomandazione Finale (Rivista)"
                subtitle="Con il competitive positioning corretto, il progetto ha un caso di business più solido. La raccomandazione cambia da 'no' a 'sì condizionato'."
                verdict={{ label: "Sviluppare con Modello Freemium", type: "positive" }}
              />

              <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-6 mb-6">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">Raccomandazione Rivista</div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Sì, sviluppare — con modello freemium e focus B2C prima di B2B
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm max-w-3xl">
                  Il competitive positioning è più forte di quanto stimato nella versione 1.
                  Lavoroinchiaro ha un vantaggio reale su prezzo (8x meno del CAF), velocità (istantaneo vs. 5 giorni)
                  e autonomia (self-service 24/7 vs. presenza fisica). Il modello freemium con abbonamento annuale a €29,99
                  risolve il problema del LTV basso. Il B2C è il percorso corretto — il B2B può essere un'opzione successiva,
                  non una necessità immediata.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Condizioni per Procedere
                  </h3>
                  <div className="space-y-3">
                    {[
                      { n: "1", text: "Compliance GDPR completata prima del lancio (DPA, privacy policy, data minimization). Budget: €20-40K.", color: "#EF4444", priority: "Non negoziabile" },
                      { n: "2", text: "MVP con 15 CCNL principali (metalmeccanici, commercio, edilizia, terziario, sanità) che coprono ~65% dei dipendenti privati.", color: "#F59E0B", priority: "Critico" },
                      { n: "3", text: "Modello freemium live: analisi base gratuita (senza upload dati sensibili) per acquisire fiducia prima di monetizzare.", color: "#3B82F6", priority: "Strategico" },
                      { n: "4", text: "SEO specializzato su query ad alta intent: 'errori busta paga', 'controllo cedolino online', 'verifica CCNL'. CPA organico target: €3-5.", color: "#10B981", priority: "Growth" },
                      { n: "5", text: "KPI critico: tasso di conversione free→paid ≥ 12% entro 6 mesi dal lancio. Sotto questa soglia, il modello non è sostenibile.", color: "#818CF8", priority: "Metrica chiave" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: `${item.color}20`, color: item.color }}>
                          {item.n}
                        </div>
                        <div>
                          <div className="text-xs font-mono mb-0.5" style={{ color: item.color }}>{item.priority}</div>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    B2C vs B2B: Posizione Aggiornata
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                      <div className="text-xs font-mono text-emerald-400 mb-2">✓ B2C — Percorso Principale</div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Con il competitive positioning corretto, il B2C è il percorso giusto.
                        Il mercato è reale (3,2M SAM), il prezzo è competitivo (8x meno del CAF),
                        e il freemium abbassa la barriera all'ingresso. Obiettivo Anno 1: 12.500 utenti paganti.
                      </p>
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="text-xs font-mono text-blue-400 mb-2">→ B2B — Opzione Anno 2-3</div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Il B2B (studi consulenti del lavoro, patronati) rimane un'opzione di crescita
                        per Anno 2-3, non una necessità immediata. Il LTV B2B (€1.200-3.600/anno)
                        è superiore, ma richiede un ciclo di vendita più lungo e un prodotto diverso.
                      </p>
                    </div>
                    <div className="bg-slate-700/40 rounded-lg p-4">
                      <div className="text-xs font-mono text-slate-400 mb-2">Pivot eventuale</div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Se la conversione free→paid rimane sotto il 10% dopo 12 mesi, pivot verso
                        B2B white-label per studi consulenti (€99-299/mese). Ma non prima di aver
                        validato il B2C con dati reali.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final 3-question summary */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      q: "Ha senso svilupparlo?",
                      a: "Sì. Il problema è reale, il vantaggio competitivo è concreto (prezzo + velocità + autonomia), e il modello freemium risolve il problema del LTV basso. Il mercato è più grande di quanto stimato nella versione 1.",
                      type: "positive" as const,
                      badge: "Sì"
                    },
                    {
                      q: "In quali condizioni?",
                      a: "Compliance GDPR completata prima del lancio. MVP con 15 CCNL principali. Freemium live per acquisire fiducia. KPI critico: conversione free→paid ≥ 12% entro 6 mesi.",
                      type: "warning" as const,
                      badge: "Condizioni chiare"
                    },
                    {
                      q: "Meglio B2C o B2B?",
                      a: "B2C prima, B2B dopo. Il competitive positioning corretto rende il B2C sostenibile con il modello freemium. Il B2B è un'opzione di crescita per Anno 2-3, non una necessità immediata.",
                      type: "neutral" as const,
                      badge: "B2C → B2B"
                    }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge type={item.type}>{item.badge}</Badge>
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.q}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <footer className="border-t border-white/5 px-6 md:px-10 py-8 mt-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Lavoroinchiaro.it — Analisi VC Senior · Revisione 2
                </div>
                <div className="text-xs text-slate-500">
                  Analisi condotta da Senior VC Analyst specializzato in HR Tech / Legal Tech Europa · Febbraio 2026
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge type="info">Investment Memo Rev.2</Badge>
                <Badge type="correction">Competitive Positioning Corretto</Badge>
                <Badge type="positive">Condizionatamente Investibile</Badge>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-600 max-w-2xl">
              <strong className="text-slate-500">Disclaimer:</strong> Questa analisi è basata su dati pubblici (ISTAT, CAF OnLine, studi consulenti del lavoro, CGIL/CISL/UIL),
              stime di mercato e ipotesi conservative. Non costituisce consulenza di investimento.
              I prezzi dei competitor sono verificati su fonti pubbliche al febbraio 2026.
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
