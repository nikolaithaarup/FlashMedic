import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

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
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>{children}</body>
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
