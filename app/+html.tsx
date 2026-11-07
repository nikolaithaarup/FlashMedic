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
  :root { color-scheme: dark; background: #10161c; }
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { width: 100%; }
  html { height: 100%; background: #10161c; }
  body {
    margin: 0;
    min-height: 100%;
    min-height: 100dvh;
    background: #10161c;
    overscroll-behavior-y: none;
    -webkit-tap-highlight-color: transparent;
    padding-top: max(env(safe-area-inset-top), env(titlebar-area-height, 0px));
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
  }
  button, [role="button"], input, textarea { touch-action: manipulation; }
  input, textarea {
    scroll-margin-top: 18vh;
    scroll-margin-bottom: 32vh;
  }
  #root {
    min-height: 100%;
    min-height: 100dvh;
    scroll-padding-bottom: calc(env(safe-area-inset-bottom) + 32px);
  }
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
