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
  { name: "TAM", value: 16000000, label: "16M", sublabel: "Dipendenti totali", color: "#3B82F6" },
  { name: "SAM", value: 2400000, label: "2.4M", sublabel: "Digitali non sindacalizzati", color: "#818CF8" },
  { name: "SOM", value: 36000, label: "36K", sublabel: "Raggiungibili in 3 anni", color: "#10B981" },
];

const scenarioData = [
  { year: "Anno 1", pessimistico: 9735, realistico: 25960, ottimistico: 64870 },
  { year: "Anno 2", pessimistico: 25960, realistico: 97305, ottimistico: 226965 },
  { year: "Anno 3", pessimistico: 51920, realistico: 233532, ottimistico: 518960 },
];

const scenarioUsersData = [
  { year: "Anno 1", pessimistico: 1500, realistico: 4000, ottimistico: 10000 },
  { year: "Anno 2", pessimistico: 4000, realistico: 15000, ottimistico: 35000 },
  { year: "Anno 3", pessimistico: 8000, realistico: 36000, ottimistico: 80000 },
];

const competitorData = [
  { name: "Sindacati\n(CGIL/CISL/UIL)", threat: 85, price: 0, digital: 20, speed: 25 },
  { name: "Consulenti\nLavoro", threat: 60, price: 15, digital: 45, speed: 35 },
  { name: "ChatGPT /\nAI Generativa", threat: 80, price: 30, digital: 95, speed: 90 },
  { name: "Bonusx /\nSindacare", threat: 50, price: 40, digital: 70, speed: 65 },
  { name: "CAF /\nPatronati", threat: 45, price: 0, digital: 30, speed: 30 },
];

const unitEconomicsData = [
  { metric: "Prezzo singola analisi", value: "€4,99", color: "#3B82F6", type: "neutral" },
  { metric: "Acquisti medi/anno per utente", value: "1,3x", color: "#818CF8", type: "neutral" },
  { metric: "LTV realistico", value: "€9,98", color: "#F59E0B", type: "warning" },
  { metric: "CPA realistico", value: "€12", color: "#EF4444", type: "danger" },
  { metric: "Ratio LTV/CPA", value: "0,83x", color: "#EF4444", type: "danger" },
  { metric: "Margine lordo", value: "65%", color: "#10B981", type: "positive" },
  { metric: "Break-even utenti", value: "25.000", color: "#F59E0B", type: "warning" },
  { metric: "Payback period", value: "24 mesi", color: "#EF4444", type: "danger" },
];

const barriersData = [
  { name: "Fiducia utenti", severity: 90, color: "#EF4444" },
  { name: "GDPR Compliance", severity: 85, color: "#EF4444" },
  { name: "Copertura CCNL (900+)", severity: 80, color: "#EF4444" },
  { name: "EU AI Act", severity: 70, color: "#F59E0B" },
  { name: "Rischio legale AI", severity: 65, color: "#F59E0B" },
  { name: "LTV strutturalmente basso", severity: 95, color: "#EF4444" },
  { name: "CAC elevato (target low-digital)", severity: 75, color: "#EF4444" },
];

const radarData = [
  { subject: "Product-Market Fit", score: 45 },
  { subject: "Scalabilità", score: 35 },
  { subject: "Barriere competitive", score: 25 },
  { subject: "Unit Economics", score: 20 },
  { subject: "Compliance", score: 30 },
  { subject: "Team / Execution", score: 55 },
];

const marketContextData = [
  { name: "Dipendenti totali", value: 16, color: "#3B82F6" },
  { name: "Sindacalizzati attivi", value: 11.65, color: "#818CF8" },
  { name: "Digitalmente attivi", value: 8.5, color: "#10B981" },
  { name: "SAM (target reale)", value: 2.4, color: "#F59E0B" },
];

const sections = [
  { id: "hero", label: "Overview" },
  { id: "pmf", label: "1. Product-Market Fit" },
  { id: "tam", label: "2. TAM/SAM/SOM" },
  { id: "barriers", label: "3. Barriere" },
  { id: "competitors", label: "4. Competitor" },
  { id: "economics", label: "5. Unit Economics" },
  { id: "scenarios", label: "6. Scenari 3 anni" },
  { id: "vc", label: "7. Valutazione VC" },
  { id: "redflags", label: "8. Red Flags" },
  { id: "recommendation", label: "9. Raccomandazione" },
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

function Badge({ type, children }: { type: "danger" | "warning" | "positive" | "neutral" | "info"; children: React.ReactNode }) {
  const styles = {
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    neutral: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    info: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
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
  verdict?: { label: string; type: "danger" | "warning" | "positive" | "neutral" | "info" };
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
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px -60% 0px" }
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
          <div className="flex items-center gap-3">
            <Badge type="warning">Pre-Seed Analysis</Badge>
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
        {/* Mobile nav */}
        {navOpen && (
          <div className="md:hidden bg-slate-800 border-t border-white/5 px-4 py-3">
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
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl">
              <div className="flex items-center gap-2 mb-6">
                <Badge type="info">Investment Memo</Badge>
                <Badge type="warning">B2C · HR Tech · Legal Tech</Badge>
                <Badge type="info">Italia 2026</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Lavoroinchiaro.it<br />
                <span className="gradient-text">Analisi VC Senior</span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Valutazione critica e realistica di un servizio B2C di analisi automatica cedolini tramite AI.
                Nessun entusiasmo artificiale. Ipotesi conservative. Dati reali.
              </p>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Occupati Italia", value: 24200000, suffix: "", display: "24,2M", color: "blue" },
                  { label: "Dipendenti target", value: 16000000, suffix: "", display: "16M", color: "indigo" },
                  { label: "Prezzo per analisi", value: 4.99, suffix: "€", display: "€4,99", color: "amber" },
                  { label: "Verdict VC", value: 0, suffix: "", display: "NON INV.", color: "red" },
                ].map((kpi, i) => (
                  <div key={i} className={`bg-slate-800/80 border rounded-xl p-4 ${
                    kpi.color === "red" ? "border-red-500/30 glow-red" :
                    kpi.color === "amber" ? "border-amber-500/30" :
                    "border-white/10"
                  }`}>
                    <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wide">{kpi.label}</div>
                    <div className={`text-2xl font-bold font-mono ${
                      kpi.color === "red" ? "text-red-400" :
                      kpi.color === "amber" ? "text-amber-400" :
                      kpi.color === "blue" ? "text-blue-400" : "text-indigo-400"
                    }`}>
                      {kpi.display}
                    </div>
                  </div>
                ))}
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 max-w-3xl">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Executive Summary</div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Lavoroinchiaro.it affronta un problema reale — la scarsa comprensione del cedolino da parte dei lavoratori italiani —
                  ma il modello B2C a transazione singola presenta criticità strutturali: LTV troppo basso (€9,98 realistico),
                  concorrenza gratuita istituzionale molto forte (sindacati, CAF, patronati), e barriere GDPR/AI Act significative.
                  Il prodotto <strong className="text-white">non è investibile allo stato attuale</strong> come puro B2C.
                  Esiste un percorso condizionato verso la sostenibilità, ma richiede un pivot verso il B2B
                  (studi consulenti del lavoro) o un modello freemium con monetizzazione diversificata.
                </p>
              </div>
            </div>
          </section>

          <div className="px-6 md:px-10 space-y-20 pb-20">

            {/* ═══════════════════════════════════════════════════════════
                1. PRODUCT-MARKET FIT
            ═══════════════════════════════════════════════════════════ */}
            <section id="pmf">
              <SectionHeader
                number="Sezione 01"
                title="Product-Market Fit"
                subtitle="Il problema è reale. La disposizione a pagare è incerta. La ricorrenza è strutturalmente bassa."
                verdict={{ label: "PMF Parziale", type: "warning" }}
              />

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    q: "Il problema è realmente sentito?",
                    a: "Sì, ma in modo latente. Il 68% dei lavoratori italiani non comprende correttamente il proprio cedolino (fonte: stime Consulenti del Lavoro). Tuttavia, la maggior parte non lo percepisce come un problema urgente — lo delega al datore di lavoro o al sindacato.",
                    verdict: "warning" as const,
                    label: "Problema Latente"
                  },
                  {
                    q: "I lavoratori pagherebbero €4,99?",
                    a: "Difficile. Il target over-40 e low-digital è abituato a servizi gratuiti (sindacato, CAF). La WTP (willingness to pay) per servizi digitali HR è storicamente bassa in Italia. €4,99 è un prezzo psicologicamente basso, ma la barriera non è il prezzo — è la fiducia e la percezione di necessità.",
                    verdict: "danger" as const,
                    label: "WTP Incerta"
                  },
                  {
                    q: "È un bisogno ricorrente o occasionale?",
                    a: "Strutturalmente occasionale. Un lavoratore verifica il cedolino al massimo 1-3 volte nella vita lavorativa (cambio contratto, sospetto errore, licenziamento). La frequenza stimata è 1,3 acquisti/anno per utente attivo — un LTV che non sostiene un modello B2C scalabile.",
                    verdict: "danger" as const,
                    label: "Bisogno Occasionale"
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
                    <p className="text-slate-400 text-xs leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>

              {/* PMF Radar */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Score di Maturità del Progetto (su 100)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 9 }} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip content={<CustomTooltip suffix="/100" />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Score medio: 35/100 — Stadio early con significative lacune strutturali
                </p>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. TAM / SAM / SOM
            ═══════════════════════════════════════════════════════════ */}
            <section id="tam">
              <SectionHeader
                number="Sezione 02"
                title="Realismo TAM / SAM / SOM"
                subtitle="Analisi della capacità di penetrazione reale nel mercato del lavoro italiano."
                verdict={{ label: "Mercato Sovrastimato", type: "warning" }}
              />

              {/* Funnel visualization */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {tamSamSomData.map((item, i) => (
                  <div key={i} className="bg-slate-800/60 border border-white/10 rounded-xl p-6 text-center relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: `${(item.value / 16000000) * 100}%`,
                        background: `${item.color}15`,
                        borderTop: `1px solid ${item.color}30`
                      }}
                    />
                    <div className="relative">
                      <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">{item.name}</div>
                      <div className="text-4xl font-bold font-mono mb-1" style={{ color: item.color }}>
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-400 mb-3">{item.sublabel}</div>
                      {i > 0 && (
                        <div className="text-xs font-mono" style={{ color: item.color }}>
                          {i === 1 ? "15% del TAM" : "1,5% del SAM"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Market context bar chart */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Segmentazione del Mercato (milioni di persone)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketContextData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} width={160} />
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

              {/* TAM correction notes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">⚠ Correzione Sovrastima</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Il TAM nominale di 24,2M occupati include pensionati iscritti ai sindacati, lavoratori autonomi,
                    e dipendenti pubblici con accesso a patronati dedicati. Il TAM realmente indirizzabile
                    si riduce a ~16M dipendenti privati, e ulteriormente a ~2,4M considerando adozione digitale
                    e propensione al pagamento.
                  </p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">📊 Tasso Adozione Reale</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    L'adozione digitale in Italia è all'87,7% per internet, ma solo il 16,4% delle imprese usa AI.
                    Il segmento target (over 40, low-digital) ha una propensione al pagamento per servizi digitali HR
                    stimata al 8-12%. Penetrazione realistica in 3 anni: <strong className="text-amber-400">0,15-0,5% del SAM</strong>.
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
                subtitle="Analisi delle criticità strutturali che ostacolano l'adozione e la crescita."
                verdict={{ label: "Barriere Elevate", type: "danger" }}
              />

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Severity Score delle Barriere (0-100)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barriersData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} width={200} />
                      <Tooltip content={<CustomTooltip suffix="/100" />} />
                      <Bar dataKey="severity" radius={[0, 4, 4, 0]}>
                        {barriersData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Fiducia & Privacy",
                    severity: "Alta",
                    type: "danger" as const,
                    content: "Caricare dati salariali su una piattaforma sconosciuta è una barriera psicologica enorme per il target over-40. La busta paga contiene dati personali sensibili (reddito, contributi, trattenute). Senza brand recognition consolidato, il tasso di conversione sarà strutturalmente basso."
                  },
                  {
                    title: "GDPR & EU AI Act",
                    severity: "Alta",
                    type: "danger" as const,
                    content: "I dati del cedolino sono dati personali ai sensi del GDPR. Richiedono DPA (Data Processing Agreement), privacy policy robusta, data minimization, e retention policy chiara. L'EU AI Act (in vigore da agosto 2024) potrebbe classificare l'analisi automatizzata con impatto su diritti lavoratori come 'high-risk AI system', con obblighi di conformità costosi."
                  },
                  {
                    title: "Complessità CCNL",
                    severity: "Alta",
                    type: "danger" as const,
                    content: "In Italia esistono oltre 900 CCNL attivi (fonte: CNEL). Coprire tutti con accuratezza sufficiente richiede un investimento enorme in training dati, aggiornamenti continui, e validazione legale. Un errore nell'analisi (es. dichiarare un cedolino corretto quando è errato) espone a responsabilità legale."
                  },
                  {
                    title: "Rischio Legale AI",
                    severity: "Media-Alta",
                    type: "warning" as const,
                    content: "Il report non può essere consulenza legale (richiede iscrizione all'albo). Ma se un lavoratore agisce sulla base di un'analisi errata dell'AI (es. richiede arretrati inesistenti), il rischio di contenzioso è reale. I disclaimer sono necessari ma non sufficienti a proteggere completamente."
                  }
                ].map((item, i) => (
                  <div key={i} className={`border rounded-xl p-5 ${
                    item.type === "danger" ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.title}
                      </h3>
                      <Badge type={item.type}>Severity: {item.severity}</Badge>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. COMPETITOR
            ═══════════════════════════════════════════════════════════ */}
            <section id="competitors">
              <SectionHeader
                number="Sezione 04"
                title="Analisi Competitor Reale"
                subtitle="Il mercato non è vuoto. La concorrenza gratuita istituzionale è il principale ostacolo."
                verdict={{ label: "Concorrenza Forte", type: "danger" }}
              />

              {/* Competitor table */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Competitor</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Tipo</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Prezzo</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Minaccia</th>
                        <th className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wide">Debolezza</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Sindacati (CGIL/CISL/UIL)", type: "Istituzionale", price: "Gratuito (iscritti)", threat: "Alta", threatType: "danger" as const, weakness: "Lento, non digitale, richiede iscrizione" },
                        { name: "Consulenti del Lavoro", type: "Professionale", price: "€50-150/ora", threat: "Media", threatType: "warning" as const, weakness: "Costoso, non scalabile, non self-service" },
                        { name: "ChatGPT / AI Generativa", type: "Sostituto digitale", price: "Gratuito / €20/mese", threat: "Alta crescente", threatType: "danger" as const, weakness: "Non specializzato CCNL, no report formale" },
                        { name: "Bonusx / Sindacare", type: "Digitale", price: "Gratuito / abbonamento", threat: "Media", threatType: "warning" as const, weakness: "Limitato, non AI-driven, focus diverso" },
                        { name: "CAF / Patronati", type: "Istituzionale", price: "Gratuito", threat: "Media", threatType: "warning" as const, weakness: "Fisico, lento, non specializzato cedolini" },
                        { name: "HR Software aziendali", type: "B2B", price: "Abbonamento aziendale", threat: "Bassa", threatType: "positive" as const, weakness: "Non accessibile al singolo lavoratore" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-5 py-3 font-medium text-white text-xs">{row.name}</td>
                          <td className="px-5 py-3 text-slate-400 text-xs">{row.type}</td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-300">{row.price}</td>
                          <td className="px-5 py-3"><Badge type={row.threatType}>{row.threat}</Badge></td>
                          <td className="px-5 py-3 text-slate-500 text-xs">{row.weakness}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competitor positioning chart */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Minaccia Competitiva vs. Digitalizzazione (score 0-100)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 9 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12 }} />
                      <Bar dataKey="threat" name="Minaccia" fill="#EF4444" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="digital" name="Digitalizzazione" fill="#3B82F6" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <strong className="text-amber-400">Nota critica:</strong> ChatGPT rappresenta la minaccia più sottovalutata —
                  alta digitalizzazione, alta minaccia, prezzo gratuito/basso. I sindacati rimangono il competitor principale
                  per il target core, nonostante la bassa digitalizzazione.
                </p>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. UNIT ECONOMICS
            ═══════════════════════════════════════════════════════════ */}
            <section id="economics">
              <SectionHeader
                number="Sezione 05"
                title="Unit Economics"
                subtitle="I numeri fondamentali che determinano la sostenibilità del modello di business."
                verdict={{ label: "Unit Economics Critiche", type: "danger" }}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {unitEconomicsData.map((item, i) => (
                  <div key={i} className={`bg-slate-800/60 border rounded-xl p-4 ${
                    item.type === "danger" ? "border-red-500/20" :
                    item.type === "warning" ? "border-amber-500/20" :
                    item.type === "positive" ? "border-emerald-500/20" :
                    "border-white/10"
                  }`}>
                    <div className="text-xs text-slate-500 mb-1 leading-tight">{item.metric}</div>
                    <div className="text-xl font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* LTV/CAC Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                  <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-3">🚨 Problema Strutturale: LTV/CAC</div>
                  <div className="space-y-3">
                    {[
                      { label: "LTV pessimistico", value: "€6,49", color: "#EF4444" },
                      { label: "LTV realistico", value: "€9,98", color: "#F59E0B" },
                      { label: "LTV ottimistico", value: "€14,97", color: "#10B981" },
                      { label: "CPA realistico (digital)", value: "€12", color: "#EF4444" },
                      { label: "CPA ottimistico (viral)", value: "€7", color: "#F59E0B" },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs">{row.label}</span>
                        <span className="font-mono font-bold text-sm" style={{ color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                    <hr className="border-white/10 my-2" />
                    <p className="text-xs text-red-400 leading-relaxed">
                      Il ratio LTV/CAC realistico è <strong>0,83x</strong> — sotto la soglia minima di 3x per un business sostenibile.
                      Anche nello scenario ottimistico (LTV €14,97 / CPA €7), il ratio è solo 2,1x — ancora insufficiente.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">📊 Struttura dei Costi (Anno 1 stimato)</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Marketing/CAC", value: 45, color: "#EF4444" },
                            { name: "Tech/AI API", value: 25, color: "#3B82F6" },
                            { name: "Legal/Compliance", value: 15, color: "#F59E0B" },
                            { name: "Ops/Team", value: 15, color: "#818CF8" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                        >
                          {[
                            { name: "Marketing/CAC", value: 45, color: "#EF4444" },
                            { name: "Tech/AI API", value: 25, color: "#3B82F6" },
                            { name: "Legal/Compliance", value: 15, color: "#F59E0B" },
                            { name: "Ops/Team", value: 15, color: "#818CF8" },
                          ].map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ background: "#1E293B", border: "1px solid #334155" }} />
                        <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Il marketing assorbe il 45% dei costi — insostenibile con un LTV di €9,98.
                  </p>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                6. SCENARI DI CRESCITA
            ═══════════════════════════════════════════════════════════ */}
            <section id="scenarios">
              <SectionHeader
                number="Sezione 06"
                title="Scenari di Crescita 3 Anni"
                subtitle="Proiezioni conservative, realistiche e ottimistiche con numeri coerenti e spiegati."
                verdict={{ label: "Crescita Lenta", type: "warning" }}
              />

              {/* Scenario toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveScenario("revenue")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeScenario === "revenue"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Revenue (€)
                </button>
                <button
                  onClick={() => setActiveScenario("users")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeScenario === "users"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white border border-white/10"
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
                        <linearGradient id="colorOtt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="year" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                      <Tooltip content={<CustomTooltip prefix={activeScenario === "revenue" ? "€" : ""} />} />
                      <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12 }} />
                      <Area type="monotone" dataKey="ottimistico" name="Ottimistico" stroke="#10B981" fill="url(#colorOtt)" strokeWidth={2} />
                      <Area type="monotone" dataKey="realistico" name="Realistico" stroke="#3B82F6" fill="url(#colorReal)" strokeWidth={2} />
                      <Area type="monotone" dataKey="pessimistico" name="Pessimistico" stroke="#EF4444" fill="url(#colorPess)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Scenario cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Pessimistico",
                    color: "#EF4444",
                    bgClass: "bg-red-500/5 border-red-500/20",
                    year3Revenue: "€51.920",
                    year3Users: "8.000",
                    result: "-€180.000",
                    description: "Bassa fiducia, alto CPA (€18), concorrenza sindacale forte, nessun pivot B2B. Il prodotto non riesce a superare la barriera psicologica del target.",
                    assumptions: ["CPA: €18", "Churn mensile: 15%", "Nessuna partnership", "Marketing solo digitale"]
                  },
                  {
                    name: "Realistico",
                    color: "#3B82F6",
                    bgClass: "bg-blue-500/5 border-blue-500/20",
                    year3Revenue: "€233.532",
                    year3Users: "36.000",
                    result: "-€50.000",
                    description: "Crescita organica + piccolo budget marketing, qualche partnership con patronati o CAF. Il prodotto trova una nicchia ma non scala.",
                    assumptions: ["CPA: €12", "Churn mensile: 10%", "1-2 partnership istituzionali", "PR + SEO + digital"]
                  },
                  {
                    name: "Ottimistico",
                    color: "#10B981",
                    bgClass: "bg-emerald-500/5 border-emerald-500/20",
                    year3Revenue: "€518.960",
                    year3Users: "80.000",
                    result: "+€77.844",
                    description: "Partnership patronati/CAF, PR virale, pivot parziale B2B con studi consulenti. Primo anno di profitto marginale.",
                    assumptions: ["CPA: €7 (viral)", "Churn mensile: 7%", "Partnership CAF/patronati", "Lancio B2B Year 2"]
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
                        <span className={`font-mono font-bold ${s.result.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{s.result}</span>
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
                7. VALUTAZIONE VC
            ═══════════════════════════════════════════════════════════ */}
            <section id="vc">
              <SectionHeader
                number="Sezione 07"
                title="Valutazione VC"
                subtitle="Analisi dell'investibilità, dello stadio, delle metriche minime e della valutazione pre-seed."
                verdict={{ label: "Non Investibile (allo stato attuale)", type: "danger" }}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-6 glow-red">
                  <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-4">Verdict VC</div>
                  <div className="text-4xl font-bold text-red-400 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    NON INVESTIBILE
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Allo stato attuale come puro B2C, Lavoroinchiaro.it non soddisfa i criteri minimi
                    per un investimento pre-seed. Il modello di business presenta criticità strutturali
                    che non possono essere risolte solo con capitale aggiuntivo.
                  </p>
                  <div className="space-y-2">
                    {[
                      "LTV/CAC ratio < 1x (soglia minima: 3x)",
                      "Bisogno occasionale → LTV strutturalmente basso",
                      "Nessuna barriera tecnologica difendibile",
                      "Mercato italiano conservatore vs. pagamenti digitali HR",
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-red-400">
                        <span className="mt-0.5 shrink-0">✗</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Stadio attuale</div>
                    <div className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Pre-Seed / Idea Stage
                    </div>
                    <p className="text-slate-400 text-xs">Nessuna traction validata. Nessun MVP live con utenti paganti.</p>
                  </div>

                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Valutazione pre-seed plausibile</div>
                    <div className="text-xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      €200K – €400K
                    </div>
                    <p className="text-slate-400 text-xs">Solo con MVP funzionante e prime centinaia di utenti paganti. Senza traction, valutazione non supportabile.</p>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                    <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">Metriche minime per Seed</div>
                    <div className="space-y-2">
                      {[
                        { metric: "MAU paganti", value: "≥ 5.000" },
                        { metric: "Revenue mensile", value: "≥ €15.000" },
                        { metric: "LTV/CAC ratio", value: "≥ 2,5x" },
                        { metric: "Churn mensile", value: "≤ 5%" },
                        { metric: "NPS", value: "≥ 40" },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-slate-400">{row.metric}</span>
                          <span className="font-mono text-amber-400">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Condizioni per riconsiderazione</div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: "Pivot B2B", desc: "Dimostrazione di 10+ studi consulenti del lavoro paganti (€99-299/mese) per il tool white-label. Questo trasforma il LTV da €9,98 a €1.200-3.600/anno." },
                    { title: "Traction organica", desc: "5.000+ utenti registrati con NPS ≥ 50 e tasso di conversione free→paid ≥ 15%. Dimostra che il problema è percepito come urgente." },
                    { title: "Partnership istituzionale", desc: "Accordo firmato con almeno un patronato nazionale (INCA, ITAL, ACLI) o CAF per distribuzione. Riduce il CAC strutturalmente." },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-700/40 rounded-lg p-4">
                      <div className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                8. RED FLAGS
            ═══════════════════════════════════════════════════════════ */}
            <section id="redflags">
              <SectionHeader
                number="Sezione 08"
                title="Red Flags"
                subtitle="Tutti i punti critici che potrebbero far fallire il progetto."
                verdict={{ label: "8 Red Flags Critiche", type: "danger" }}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    n: "01",
                    title: "LTV strutturalmente basso",
                    desc: "€4,99 per un acquisto occasionale (1-3 volte nella vita lavorativa) non è un modello di business — è un prodotto. Senza ricorrenza, non c'è business scalabile.",
                    severity: "Critica"
                  },
                  {
                    n: "02",
                    title: "Concorrenza gratuita istituzionale",
                    desc: "Sindacati (11,6M iscritti), CAF, patronati offrono servizi simili gratuitamente. Il lavoratore medio non ha incentivo a pagare €4,99 quando può andare al CAF.",
                    severity: "Critica"
                  },
                  {
                    n: "03",
                    title: "GDPR + EU AI Act: compliance costosa",
                    desc: "Per una startup early-stage, la compliance GDPR per dati salariali + potenziale classificazione come high-risk AI system può costare €50-150K solo in consulenza legale.",
                    severity: "Alta"
                  },
                  {
                    n: "04",
                    title: "900+ CCNL: copertura impossibile in early stage",
                    desc: "Con 900+ CCNL attivi, qualsiasi analisi sarà incompleta o inaccurata per una parte significativa degli utenti. Un errore materiale espone a responsabilità legale.",
                    severity: "Alta"
                  },
                  {
                    n: "05",
                    title: "Target paradossale: low-digital",
                    desc: "Chi ha più bisogno del servizio (over 40, bassa scolarizzazione) è il segmento meno propenso ad usare app a pagamento. Chi usa app a pagamento ha meno bisogno del servizio.",
                    severity: "Alta"
                  },
                  {
                    n: "06",
                    title: "Nessuna barriera tecnologica",
                    desc: "ChatGPT con un prompt ben costruito può fare un'analisi simile gratuitamente. Non c'è moat tecnologico. La differenziazione è solo sulla specializzazione CCNL — che richiede investimento continuo.",
                    severity: "Alta"
                  },
                  {
                    n: "07",
                    title: "Mercato italiano conservatore",
                    desc: "L'Italia ha una delle più basse propensioni al pagamento per servizi digitali in Europa. Il 72% degli utenti internet italiani non ha mai acquistato un servizio digitale B2C non-entertainment.",
                    severity: "Media"
                  },
                  {
                    n: "08",
                    title: "Rischio legale da errori AI",
                    desc: "Se l'AI dichiara corretto un cedolino errato (o viceversa) e il lavoratore agisce di conseguenza, il rischio di contenzioso è reale. I disclaimer limitano ma non eliminano la responsabilità.",
                    severity: "Media"
                  }
                ].map((flag, i) => (
                  <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 flex gap-4">
                    <div className="text-2xl font-bold font-mono text-red-900 shrink-0">{flag.n}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {flag.title}
                        </h3>
                        <Badge type={flag.severity === "Critica" ? "danger" : flag.severity === "Alta" ? "warning" : "info"}>
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
                9. RACCOMANDAZIONE FINALE
            ═══════════════════════════════════════════════════════════ */}
            <section id="recommendation">
              <SectionHeader
                number="Sezione 09"
                title="Raccomandazione Finale"
                subtitle="Risposta diretta: ha senso svilupparlo? In quali condizioni? Con quale pivot?"
                verdict={{ label: "Sviluppo Condizionato", type: "warning" }}
              />

              {/* Main verdict */}
              <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-6 mb-6">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">Raccomandazione</div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Sviluppare solo con pivot B2B e modello freemium
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm max-w-3xl">
                  Il problema è reale e il mercato esiste, ma il modello B2C puro a transazione singola non è sostenibile.
                  Il percorso verso la sostenibilità richiede un cambio di strategia fondamentale:
                  usare il B2C come canale di acquisizione/awareness, non come revenue primaria.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* B2C vs B2B */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      B2C vs B2B: Confronto
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-4 py-2 text-slate-500">Metrica</th>
                          <th className="text-left px-4 py-2 text-red-400">B2C Attuale</th>
                          <th className="text-left px-4 py-2 text-emerald-400">B2B Pivot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { metric: "Prezzo", b2c: "€4,99/analisi", b2b: "€99-299/mese" },
                          { metric: "LTV", b2c: "€9,98", b2b: "€1.200-3.600/anno" },
                          { metric: "CAC", b2c: "€12-18", b2b: "€200-500" },
                          { metric: "LTV/CAC", b2c: "0,83x ❌", b2b: "4-7x ✓" },
                          { metric: "Churn", b2c: "Alto (occasionale)", b2b: "Basso (contratto)" },
                          { metric: "Scalabilità", b2c: "Bassa", b2b: "Media-Alta" },
                          { metric: "Compliance", b2c: "Diretta (rischiosa)", b2b: "Delegata al consulente" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="px-4 py-2 text-slate-400">{row.metric}</td>
                            <td className="px-4 py-2 text-red-400 font-mono">{row.b2c}</td>
                            <td className="px-4 py-2 text-emerald-400 font-mono">{row.b2b}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pivot roadmap */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold text-white text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Roadmap Pivot Consigliata
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        phase: "Fase 1 (0-6 mesi)",
                        color: "#3B82F6",
                        actions: [
                          "MVP con 10-15 CCNL principali (metalmeccanici, commercio, edilizia)",
                          "Freemium B2C per acquisire utenti e validare il problema",
                          "Compliance GDPR completa prima del lancio"
                        ]
                      },
                      {
                        phase: "Fase 2 (6-18 mesi)",
                        color: "#F59E0B",
                        actions: [
                          "Contattare 50 studi consulenti del lavoro per beta B2B",
                          "Partnership con 1-2 patronati nazionali",
                          "Pricing B2B: €99/mese per studi piccoli"
                        ]
                      },
                      {
                        phase: "Fase 3 (18-36 mesi)",
                        color: "#10B981",
                        actions: [
                          "B2B come revenue primaria (>70% revenue)",
                          "B2C come funnel di awareness/upsell",
                          "Espansione a 50+ CCNL con aggiornamento automatico"
                        ]
                      }
                    ].map((phase, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: phase.color }} />
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: phase.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                            {phase.phase}
                          </div>
                          {phase.actions.map((a, j) => (
                            <div key={j} className="text-xs text-slate-400 mb-0.5">• {a}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final summary */}
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      q: "Ha senso svilupparlo?",
                      a: "Sì, condizionatamente. Il problema è reale e il mercato esiste. Ma richiede un cambio di strategia prima di investire risorse significative.",
                      type: "warning" as const
                    },
                    {
                      q: "In quali condizioni?",
                      a: "Con un pivot B2B chiaro, compliance GDPR completa, copertura iniziale limitata a 10-15 CCNL, e un modello freemium per validare la domanda prima di monetizzare.",
                      type: "neutral" as const
                    },
                    {
                      q: "Meglio B2C o B2B?",
                      a: "B2B nettamente preferibile come revenue primaria. B2C utile solo come canale di acquisizione e awareness. Il pivot B2B trasforma il LTV da €9,98 a €1.200-3.600/anno.",
                      type: "positive" as const
                    }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge type={item.type}>
                          {item.type === "warning" ? "Condizionato" : item.type === "neutral" ? "Condizioni" : "B2B"}
                        </Badge>
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
                  Lavoroinchiaro.it — Analisi VC Senior
                </div>
                <div className="text-xs text-slate-500">
                  Analisi condotta da Senior VC Analyst specializzato in HR Tech / Legal Tech Europa · Febbraio 2026
                </div>
              </div>
              <div className="flex gap-3">
                <Badge type="info">Investment Memo</Badge>
                <Badge type="warning">Pre-Seed Stage</Badge>
                <Badge type="danger">Non Investibile (B2C puro)</Badge>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-600 max-w-2xl">
              <strong className="text-slate-500">Disclaimer:</strong> Questa analisi è basata su dati pubblici, stime di mercato e ipotesi conservative.
              Non costituisce consulenza di investimento. I numeri sono proiezioni indicative, non garanzie di performance.
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
