import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Typography } from "../../../../constants/theme";
import {
  approximateEcgRate,
  createTimeline,
  ecgAmplitude,
  getRhythm,
  pulseAmplitude,
  type RhythmId,
} from "./rhythmModel";

type Props = { rhythmId: RhythmId; seed: number; paused: boolean; compact?: boolean };
const WINDOW_SECONDS = 4.8;
const HEIGHT = 230;

export function EkgLiveMonitor({ rhythmId, seed, paused, compact = false }: Props) {
  const height = compact ? 132 : HEIGHT;
  const windowSeconds = compact && ['av_complete','ventricular_escape','av_two_one','mobitz_i','mobitz_ii'].includes(rhythmId) ? 8 : WINDOW_SECONDS;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const elapsedRef = useRef(0);
  const rhythm = getRhythm(rhythmId);
  const [displayRate, setDisplayRate] = useState<number | null>(rhythm.baseBpm || null);

  useEffect(() => {
    elapsedRef.current = 0;
    setDisplayRate(rhythm.baseBpm || null);
  }, [rhythmId, seed, rhythm.baseBpm]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let lastTick = 0;
    let lastPaint = 0;
    let lastRate = -1;
    // The game rounds are short; a patient case may be studied for much longer.
    // Regenerate deterministically before the end of the timeline, preserving phase.
    let traceEnd = Math.max(185, elapsedRef.current + 185);
    let trace = createTimeline(rhythm, seed, -18, traceEnd);
    let paintedWidth = 0;
    const assumed = rhythm.pulse === "assumed";
    const render = (timestamp: number) => {
      if (lastTick && !paused) elapsedRef.current += Math.min(0.08, Math.max(0, timestamp - lastTick) / 1000);
      lastTick = timestamp;
      const widthNow = Math.max(1, canvas.clientWidth);
      if (widthNow !== paintedWidth || !lastPaint || (!paused && timestamp - lastPaint >= 16)) {
        paintedWidth = widthNow;
        lastPaint = timestamp;
        const width = Math.max(1, canvas.clientWidth);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const pw = Math.round(width * dpr);
        const ph = Math.round(height * dpr);
        if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#061c25";
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = "rgba(75,159,167,0.20)";
        for (let x = 0; x <= width; x += 20) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y <= height; y += 20) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
        if (!compact) {
          ctx.strokeStyle = "rgba(255,255,255,0.15)";
          ctx.beginPath(); ctx.moveTo(0, 151); ctx.lineTo(width, 151); ctx.stroke();
        }

        const end = elapsedRef.current;
        if (end + 8 >= traceEnd) {
          traceEnd = end + 185;
          trace = createTimeline(rhythm, seed, -18, traceEnd);
        }
        const start = end - windowSeconds;
        const visible = {
          beats: trace.beats.filter((b) => b.time >= start - 1.2 && b.time <= end + 0.7),
          pTimes: trace.pTimes.filter((p) => p.time >= start - 0.2 && p.time <= end + 0.2),
        };
        const pulseSteps = Math.max(320, Math.ceil(width / 1.1));
        const ecgSteps = Math.max(1200, Math.ceil(width * 4));
        const paint = (pulse: boolean) => {
          const steps = pulse ? pulseSteps : ecgSteps;
          const sampleTimes: number[] = [];
          for (let i = 0; i <= steps; i++) {
            sampleTimes.push(start + (i / steps) * windowSeconds);
          }
          if (!pulse) {
            // Preserve exact QRS extrema as they move between pixel coordinates.
            for (const beat of visible.beats) {
              for (const offset of [-0.055, -0.028, -0.012, 0, 0.012, 0.028, 0.055, 0.078]) {
                const t = beat.time + offset;
                if (t > start && t < end) sampleTimes.push(t);
              }
            }
            sampleTimes.sort((a, b) => a - b);
          }
          ctx.beginPath();
          for (let i = 0; i < sampleTimes.length; i++) {
            const t = sampleTimes[i];
            const x = ((t - start) / windowSeconds) * width;
            const amplitude = pulse ? pulseAmplitude(t, visible, rhythm) : ecgAmplitude(t, visible, rhythm);
            const y = pulse ? 210 - amplitude * 48 : compact ? 73 - amplitude * 56 : 95 - amplitude * 68;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = pulse ? "#5fb7ff" : "#67efd4";
          ctx.lineWidth = 2.2;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          if (pulse && !assumed) ctx.setLineDash([3, 6]);
          else ctx.setLineDash([]);
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = pulse && !assumed ? 0 : 4;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.setLineDash([]);
        };
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, width, compact ? height : 151);
        ctx.clip();
        paint(false);
        ctx.restore();
        if (!compact) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 152, width, height - 152);
          ctx.clip();
          paint(true);
          ctx.restore();
        }
        if (end - lastRate >= 1 && rhythm.baseBpm > 0) {
          lastRate = end;
          const bpm = approximateEcgRate(trace.beats, end, rhythm.baseBpm);
          setDisplayRate((old) => old === bpm ? old : bpm);
        }
      }
      if (!paused) frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    // A frozen monitor only redraws when its layout changes, rather than running
    // animation frames continuously while the learner reads the explanation.
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      if (paused) { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(render); }
    }) : undefined;
    observer?.observe(canvas);
    return () => { observer?.disconnect(); window.cancelAnimationFrame(frame); };
  }, [rhythm, seed, paused, compact, height, windowSeconds]);

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{compact ? "EKG · SIMULERET AFLEDNING II" : "EKG · AFLEDNING II"}</Text>
        <Text style={styles.rate} accessibilityLabel={displayRate === null ? "Elektrisk frekvens ikke målelig" : `Elektrisk frekvens ${displayRate} per minut`}>
          {displayRate === null ? "—" : displayRate} <Text style={styles.unit}>/min</Text>
        </Text>
      </View>
      <canvas
        ref={canvasRef}
        aria-label={compact ? "Syntetisk enkeltkanals-EKG til rytmefortolkning" : "Animeret, syntetisk afledning II og hypotetisk pulskurve"}
        role="img"
        style={{ display: "block", width: "100%", height }}
      />
    </View>
  );
}

const font = Typography.families.sans;
const styles = StyleSheet.create({
  frame: { overflow: "hidden", borderWidth: 1, borderColor: "rgba(119,225,214,0.30)", borderRadius: 14, backgroundColor: "#061c25", width: "100%", minWidth: 0 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingTop: 8, paddingBottom: 2 },
  headerLabel: { fontFamily: font, fontSize: 11, color: "#9dcacb", fontWeight: "700", letterSpacing: 0.6 },
  rate: { fontFamily: font, fontSize: 25, color: "#67efd4", fontWeight: "800" },
  unit: { fontFamily: font, fontSize: 12, color: "#9dcacb", fontWeight: "500" },
});
