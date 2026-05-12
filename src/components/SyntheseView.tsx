"use client";

import { VESSELS, ANOMALIES, SENSORS, VESSEL_POSITIONS } from "@/lib/data";
import { severityBg, severityColor, formatTimeAgo, fmtMmsi } from "@/lib/engine";
import {
  AlertTriangle,
  Ship,
  Antenna,
  Eye,
  TrendingUp,
  Activity,
} from "lucide-react";

export function SyntheseView({
  onJumpToAnomaly,
}: {
  onJumpToAnomaly: () => void;
}) {
  const suspicious = VESSELS.filter((v) => v.isSuspicious);
  const critical = ANOMALIES.filter((a) => a.severity === "critical");
  const high = ANOMALIES.filter((a) => a.severity === "high");
  const aisOff = Object.values(VESSEL_POSITIONS).filter((p) => !p.aisActive).length;

  return (
    <div className="grid grid-cols-12 gap-4 p-6 bg-grid min-h-[calc(100vh-130px)]">
      {/* KPI strip */}
      <div className="col-span-12 grid grid-cols-6 gap-3">
        <Kpi
          label="Navires suivis"
          value={VESSELS.length}
          unit=""
          icon={<Ship className="w-4 h-4" />}
          tone="neutral"
        />
        <Kpi
          label="Capteurs actifs"
          value={`${SENSORS.filter((s) => s.status === "actif").length}/${SENSORS.length}`}
          unit=""
          icon={<Antenna className="w-4 h-4" />}
          tone="ok"
        />
        <Kpi
          label="AIS désactivés"
          value={aisOff}
          unit="navires"
          icon={<Eye className="w-4 h-4" />}
          tone={aisOff > 2 ? "warn" : "neutral"}
        />
        <Kpi
          label="Anomalies actives"
          value={ANOMALIES.length}
          unit=""
          icon={<Activity className="w-4 h-4" />}
          tone="neutral"
        />
        <Kpi
          label="Alertes critiques"
          value={critical.length}
          unit=""
          icon={<AlertTriangle className="w-4 h-4" />}
          tone="critical"
        />
        <Kpi
          label="Confiance moy."
          value={Math.round(
            (ANOMALIES.reduce((s, a) => s + a.confidence, 0) / ANOMALIES.length) *
              100
          )}
          unit="%"
          icon={<TrendingUp className="w-4 h-4" />}
          tone="ok"
        />
      </div>

      {/* Alertes prioritaires — focus visuel */}
      <section className="col-span-8 panel rounded-sm">
        <div className="px-4 py-3 border-b border-ink-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-alert-critical animate-pulse_dot" />
            <h2 className="font-display text-sm tracking-wide text-steel-100">
              ALERTES PRIORITAIRES
            </h2>
            <span className="label-tag ml-2">
              {critical.length + high.length} actives
            </span>
          </div>
          <button
            onClick={onJumpToAnomaly}
            className="text-xs text-signal hover:text-signal/80 transition"
          >
            Voir toutes les anomalies →
          </button>
        </div>
        <div className="divide-y divide-ink-700">
          {[...critical, ...high].slice(0, 5).map((a) => (
            <div
              key={a.id}
              className={`px-4 py-3 flex items-start gap-3 border-l-2 ${severityBg(
                a.severity
              )}`}
            >
              <div className="font-mono text-[10px] text-steel-400 w-12 pt-0.5">
                {formatTimeAgo(a.timestamp)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${severityBg(
                      a.severity
                    )} ${severityColor(a.severity)}`}
                  >
                    {a.type.toUpperCase()}
                  </span>
                  <span className="text-steel-100 text-sm font-medium">
                    {a.vesselName}
                  </span>
                  <span className="text-steel-400 text-xs font-mono">
                    MMSI {fmtMmsi(a.mmsi)}
                  </span>
                </div>
                <p className="text-xs text-steel-300 leading-relaxed">
                  {a.description}
                </p>
              </div>
              <div className="text-right">
                <div className="label-tag">Confiance</div>
                <div
                  className={`font-mono text-sm ${severityColor(a.severity)}`}
                >
                  {Math.round(a.confidence * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bateaux suspects rapide */}
      <section className="col-span-4 panel rounded-sm">
        <div className="px-4 py-3 border-b border-ink-700">
          <h2 className="font-display text-sm tracking-wide text-steel-100">
            BÂTIMENTS À SURVEILLER
          </h2>
          <div className="label-tag mt-0.5">
            {suspicious.length} marqués suspects
          </div>
        </div>
        <div className="divide-y divide-ink-700">
          {suspicious.map((v) => {
            const pos = VESSEL_POSITIONS[v.mmsi];
            return (
              <div key={v.mmsi} className="px-4 py-2.5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-alert-high animate-pulse_dot" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-steel-100 truncate">
                    {v.name}
                  </div>
                  <div className="text-[11px] font-mono text-steel-400 flex gap-2">
                    <span>{v.flag}</span>
                    <span>·</span>
                    <span>{v.type}</span>
                    {!pos?.aisActive && (
                      <>
                        <span>·</span>
                        <span className="text-alert-high">AIS OFF</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono">
                  <div className="text-steel-300">
                    {v.freqMean.toFixed(2)} MHz
                  </div>
                  <div className="text-steel-400">
                    σ {v.freqStd.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* État des capteurs */}
      <section className="col-span-6 panel rounded-sm">
        <div className="px-4 py-3 border-b border-ink-700">
          <h2 className="font-display text-sm tracking-wide text-steel-100">
            RÉSEAU DE CAPTEURS
          </h2>
          <div className="label-tag mt-0.5">Couverture Méditerranée occidentale</div>
        </div>
        <table className="w-full text-xs">
          <thead className="text-steel-400">
            <tr className="border-b border-ink-700">
              <th className="text-left px-4 py-2 font-mono font-normal label-tag">
                ID
              </th>
              <th className="text-left px-2 py-2 font-mono font-normal label-tag">
                Nom
              </th>
              <th className="text-left px-2 py-2 font-mono font-normal label-tag">
                Type
              </th>
              <th className="text-right px-2 py-2 font-mono font-normal label-tag">
                Portée
              </th>
              <th className="text-right px-4 py-2 font-mono font-normal label-tag">
                État
              </th>
            </tr>
          </thead>
          <tbody>
            {SENSORS.map((s) => (
              <tr key={s.id} className="border-b border-ink-700/50">
                <td className="px-4 py-2 font-mono text-steel-300">{s.id}</td>
                <td className="px-2 py-2 text-steel-200">{s.name}</td>
                <td className="px-2 py-2 text-steel-400">{s.type}</td>
                <td className="px-2 py-2 text-right font-mono text-steel-300">
                  {s.rangeKm} km
                </td>
                <td className="px-4 py-2 text-right">
                  <SensorState state={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Activité 24h */}
      <section className="col-span-6 panel rounded-sm scanline">
        <div className="px-4 py-3 border-b border-ink-700">
          <h2 className="font-display text-sm tracking-wide text-steel-100">
            ACTIVITÉ RF — DERNIÈRES 24H
          </h2>
        </div>
        <div className="p-4">
          <ActivityBars />
        </div>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  unit,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  tone: "neutral" | "ok" | "warn" | "critical";
}) {
  const accent = {
    neutral: "text-steel-100",
    ok: "text-alert-nominal",
    warn: "text-alert-medium",
    critical: "text-alert-critical",
  }[tone];
  return (
    <div className="panel rounded-sm px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="label-tag">{label}</span>
        <span className={`${accent} opacity-70`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-display text-2xl tabular-nums ${accent}`}>
          {value}
        </span>
        {unit && <span className="text-[11px] text-steel-400">{unit}</span>}
      </div>
    </div>
  );
}

function SensorState({ state }: { state: string }) {
  const cfg =
    state === "actif"
      ? { color: "text-alert-nominal", dot: "bg-alert-nominal" }
      : state === "dégradé"
      ? { color: "text-alert-medium", dot: "bg-alert-medium" }
      : { color: "text-alert-critical", dot: "bg-alert-critical" };
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {state}
    </span>
  );
}

function ActivityBars() {
  // 24 barres pour 24h, intensité simulée
  const data = Array.from({ length: 24 }, (_, i) => {
    const base = 30 + Math.sin(i / 4) * 20 + Math.random() * 25;
    const spike = i === 14 || i === 19 ? 35 : 0;
    return Math.min(100, base + spike);
  });
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v, i) => {
        const isSpike = v > 80;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-sm ${
                isSpike ? "bg-alert-high" : "bg-signal/60"
              }`}
              style={{ height: `${v}%` }}
            />
            <span className="text-[9px] font-mono text-steel-400">
              {i.toString().padStart(2, "0")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
