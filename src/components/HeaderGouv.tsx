"use client";

import Image from "next/image";
import { Radio, Crosshair, AlertOctagon, Activity } from "lucide-react";
import { TabKey } from "./TopBar";

const TABS: { key: TabKey; label: string; icon: React.ReactNode; code: string }[] = [
  { key: "synthese",       label: "Synthèse",               code: "S/01", icon: <Activity     className="w-3.5 h-3.5" /> },
  { key: "identification", label: "Identification RF",       code: "S/02", icon: <Radio        className="w-3.5 h-3.5" /> },
  { key: "localisation",   label: "Localisation",            code: "S/03", icon: <Crosshair    className="w-3.5 h-3.5" /> },
  { key: "anomalies",      label: "Anomalies",               code: "S/04", icon: <AlertOctagon className="w-3.5 h-3.5" /> },
];

export function HeaderGouv({
  active,
  onChange,
  clock,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  clock: string;
}) {
  return (
    <header style={{ background: "#fff", boxShadow: "0 1px 0 #D0D3D9, 0 2px 12px rgba(0,0,0,0.06)" }}>

      {/* ── TIER 1 — République Française / Ministère des Armées ─────────── */}
      <div style={{ background: "#111111" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "10px 28px", display: "flex", alignItems: "center", gap: 20 }}>

          {/* Bloc République Française */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {/* Drapeau tricolore vertical — symbole DSFR officiel */}
            <div style={{ display: "flex", height: 44, width: 30, borderRadius: 3, overflow: "hidden", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              <div style={{ flex: 1, background: "#002395" }} />
              <div style={{ flex: 1, background: "#FFFFFF" }} />
              <div style={{ flex: 1, background: "#ED2939" }} />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: "1.15", letterSpacing: "0.005em" }}>Gouvernement</div>
              <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 11, letterSpacing: "0.03em" }}>République Française</div>
            </div>
          </div>

          {/* Séparateur */}
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />

          {/* Ministère */}
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: "1.15" }}>
              Ministère des Armées et des Anciens Combattants
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 1 }}>
              Direction générale de l'armement · Cellule SURMAR
            </div>
          </div>

          {/* Droite — Liberté Égalité Fraternité */}
          <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.45)", fontSize: 11, fontStyle: "italic", letterSpacing: "0.02em", textAlign: "right", lineHeight: 1.6 }}>
            Liberté<br />Égalité<br />Fraternité
          </div>
        </div>
      </div>

      {/* ── TIER 2 — Identité applicative ──────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8EAED" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", gap: 20 }}>

          {/* Logo Marine Nationale */}
          <div style={{ flexShrink: 0, width: 64, height: 64, position: "relative" }}>
            <Image
              src="/logos/marine-nationale.png"
              alt="Marine Nationale"
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              priority
            />
          </div>

          {/* Séparateur accent bleu */}
          <div style={{ width: 3, height: 52, background: "linear-gradient(180deg, #000091 0%, #000091 70%, rgba(0,0,145,0.2) 100%)", borderRadius: 99, flexShrink: 0 }} />

          {/* Titre app */}
          <div>
            <div style={{ color: "#11142B", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", lineHeight: "1.15" }}>
              RF Intelligence Maritime
            </div>
            <div style={{ color: "#636878", fontSize: 12, marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Plateforme de surveillance passive · Identification RF & AIS</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D0D3D9", display: "inline-block" }} />
              <span style={{ color: "#000091", fontWeight: 600, fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>v1.0</span>
            </div>
          </div>

          {/* Droite : badge démo + horloge */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>

            {/* Bandeau DÉMONSTRATEUR obligatoire */}
            <div style={{
              background: "linear-gradient(135deg, #FFF3E0 0%, #FFF8E7 100%)",
              border: "1.5px solid #C64A00",
              borderRadius: 8,
              padding: "7px 16px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#C64A00", animation: "pulse_dot 2s ease-in-out infinite" }} />
              <div>
                <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#C64A00", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Démonstrateur
                </div>
                <div style={{ fontSize: 9, color: "#A35000", letterSpacing: "0.03em", marginTop: 1 }}>
                  Maquette à usage pédagogique
                </div>
              </div>
            </div>

            {/* Horloge UTC */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#636878", marginBottom: 2 }}>
                UTC
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, color: "#11142B", fontWeight: 700, letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums" }}>
                {clock}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIER 3 — Navigation ──────────────────────────────────────────────── */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Onglets */}
          <nav style={{ display: "flex", gap: 2 }}>
            {TABS.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onChange(t.key)}
                  style={{
                    position: "relative",
                    padding: "13px 20px",
                    fontSize: 13.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#000091" : "#636878",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "color 0.15s",
                    outline: "none",
                    borderRadius: "8px 8px 0 0",
                    letterSpacing: isActive ? "-0.01em" : "0",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#000091"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#636878"; }}
                >
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: isActive ? "#8080CC" : "#B0B7C3", letterSpacing: "0.1em" }}>
                    {t.code}
                  </span>
                  <span style={{ color: isActive ? "#000091" : "#8A9099" }}>{t.icon}</span>
                  <span>{t.label}</span>
                  {/* Indicateur actif */}
                  {isActive && (
                    <span style={{
                      position: "absolute", bottom: 0, left: 12, right: 12, height: 3,
                      background: "linear-gradient(90deg, #000091, #1212CC)",
                      borderRadius: "3px 3px 0 0",
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Indicateurs opérationnels */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
            <StatusPill label="Capteurs" value="4 / 5 actifs"  tone="ok" />
            <StatusPill label="AIS feed"  value="2.4 s latence" tone="ok" />
            <StatusPill label="RF feed"   value="42 sigs/h"     tone="ok" />
          </div>
        </div>

        {/* Liseré de séparation bas de header */}
        <div style={{ height: 1, background: "linear-gradient(90deg, #000091 0%, #D0D3D9 40%, #D0D3D9 100%)" }} />
      </div>
    </header>
  );
}

function StatusPill({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "bad" }) {
  const dotColor = { ok: "#18753C", warn: "#8B5E00", bad: "#CE0500" }[tone];
  const dotBg    = { ok: "#DFFCE9", warn: "#FFF0C0", bad: "#FFE5E5" }[tone];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "#F4F5F7",
      border: "1px solid #E0E3E8",
      borderRadius: 8,
      padding: "5px 12px",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotBg, border: `1.5px solid ${dotColor}`, flexShrink: 0 }} className="animate-pulse_dot" />
      <div style={{ lineHeight: "1.3" }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#636878" }}>{label}</div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, color: "#11142B", fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
