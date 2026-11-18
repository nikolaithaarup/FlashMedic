import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";
import { ECG_PATH, ECG_STYLES } from "../src/ui/ecgWave";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="da">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="application-name" content="FlashMedic" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FlashMedic" />
        <meta name="description" content="Medicinsk træning i flashcards, EKG, VGAS og Daily10." />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#083f4f" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png?v=20261117" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <style dangerouslySetInnerHTML={{ __html: `
  /* First paint before JavaScript runs; replaced only when app bootstrap finishes. */
  #synapse-startup { position: fixed; inset: 0; z-index: 2147483646; display: flex;
    align-items: center; justify-content: center; padding: 48px 24px;
    min-height: 100vh; min-height: 100dvh; box-sizing: border-box;
    background: #083F4F; color: #fff; font-family: system-ui, -apple-system, sans-serif; }
  #synapse-startup * { box-sizing: border-box; }
  #synapse-startup .identity { width: 100%; max-width: 480px; text-align: center;
    display: flex; flex-direction: column; align-items: center; }
  #synapse-startup .mark { display: block; width: 136px; height: 68px;
    object-fit: cover; margin-bottom: 14px; }
  #synapse-startup .title { margin: 0; color: #fff; font-size: 32px;
    line-height: 39px; font-weight: 800; letter-spacing: -.6px; }
  #synapse-startup .subtitle { margin: 9px 0 0; color: #e1e8e7;
    font-size: 14px; line-height: 21px; }
  #synapse-startup .loading { display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 4px; min-height: 96px; margin-top: 28px;
    color: #d3dcda; font-size: 13px; font-weight: 500; line-height: 19px; }
  #synapse-startup .studio-footer { display: flex; flex-direction: column;
    align-items: center; gap: 2px; margin-top: 46px; }
  #synapse-startup .part-of { color: #d3dcda; font-size: 11px;
    font-weight: 600; line-height: 16px; letter-spacing: 1.1px; }
  #synapse-startup .studio-logo { display: block; width: 164px;
    height: auto; max-width: 75vw; }
  ${ECG_STYLES}
` }} />
      </head>
      <body>
        <div id="synapse-startup" aria-label="FlashMedic starter">
          <div className="identity">
            <img className="mark" src="/icons/icon-512.png" alt="" aria-hidden="true" width="136" height="68" />
            
            <h1 className="title">FlashMedic</h1>
            <p className="subtitle">Korte øvelser. Skarpere faglighed.</p>
            <div className="loading" role="status" aria-live="polite">
              <svg className="synapse-ecg" width="236" height="68" viewBox="0 0 236 68" style={{ color: "#5EEAD4" }} aria-hidden="true" focusable="false">
                <path className="synapse-ecg-guide" d="M 2 34 L 234 34" />
                <path className="synapse-ecg-glow" d={ECG_PATH} pathLength={100} />
                <path className="synapse-ecg-trace" d={ECG_PATH} pathLength={100} />
              </svg>
              <span>Indlæser…</span>
            </div>
            <div className="studio-footer" aria-label="Part of Synapse Studio">
              <span className="part-of">Part of</span>
              <img className="studio-logo" src="/synapsestudio-logo-white.svg" alt="SynapseStudio" width="164" height="44" />
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}

const globalStyles = `
  :root {
    color-scheme: dark;
    background: #083f4f;
    --fm-safe-top: max(env(safe-area-inset-top, 0px), env(titlebar-area-height, 0px));
    --fm-safe-right: env(safe-area-inset-right, 0px);
    --fm-safe-bottom: env(safe-area-inset-bottom, 0px);
    --fm-safe-left: env(safe-area-inset-left, 0px);
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { width: 100%; max-width: 100%; }
  html, body { overflow-x: hidden; overscroll-behavior-x: none; }
  html { min-height: 100%; background: #083f4f; }
  body {
    margin: 0;
    min-height: 100%;
    min-height: 100dvh;
    background: linear-gradient(143deg, #083f4f 0%, #0d2f38 58%, #0d141b 100%);
    overscroll-behavior-y: none;
    -webkit-tap-highlight-color: transparent;
    padding: 0;
  }
  button, [role="button"], input, textarea { touch-action: manipulation; }
  input, textarea {
    scroll-margin-top: 18vh;
    scroll-margin-bottom: 32vh;
  }
  #root {
    min-height: 100%;
    min-height: 100dvh;
    min-width: 0;
    max-width: 100%;
    padding-top: var(--fm-safe-top);
    padding-right: var(--fm-safe-right);
    padding-bottom: var(--fm-safe-bottom);
    padding-left: var(--fm-safe-left);
    background: linear-gradient(143deg, #083f4f 0%, #0d2f38 58%, #0d141b 100%);
    scroll-padding-bottom: calc(var(--fm-safe-bottom) + 32px);
  }
  #root > * { min-width: 0; max-width: 100%; }
  img, canvas, video { max-width: 100%; }
  :focus-visible { outline: 3px solid #5eead4; outline-offset: 2px; }
  input:focus-visible, textarea:focus-visible {
    outline-width: 2px;
    outline-offset: 1px;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
