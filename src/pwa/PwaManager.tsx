import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { ColorTokens, Radii, Spacing, Typography } from "../../constants/theme";
import { PwaUpdateModal } from "./PwaUpdateModal";

type InstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const INSTALL_DISMISSED_KEY = "flashmedic:pwa-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isHomeLocation() {
  if (typeof window === "undefined") return false;
  return (window.location.pathname === "/" || window.location.pathname === "/index.html") &&
    (!window.location.hash || window.location.hash === "#/");
}

export function PwaManager() {
  const [online, setOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [onHome, setOnHome] = useState(true);
  const [dismissedWorker, setDismissedWorker] = useState<ServiceWorker | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);
  const reloadForUpdateRef = useRef(false);

  // The app's screen navigation uses hash URLs via history.pushState.
  // Recheck the actual Home route so an active quiz is never obscured.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const sync = () => setOnHome(isHomeLocation());
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    window.addEventListener("pageshow", sync);
    const timer = window.setInterval(sync, 1000);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    setOnline(window.navigator.onLine);
    const updateOnlineState = () => setOnline(window.navigator.onLine);
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setShowInstall(window.localStorage.getItem(INSTALL_DISMISSED_KEY) !== "1");
    };
    const installed = () => {
      setInstallPrompt(null);
      setShowInstall(false);
    };
    window.addEventListener("online", updateOnlineState);
    window.addEventListener("offline", updateOnlineState);
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", installed);

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (
      isIos &&
      !isStandalone() &&
      window.localStorage.getItem(INSTALL_DISMISSED_KEY) !== "1"
    ) {
      const timer = window.setTimeout(() => setShowInstall(true), 2500);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("online", updateOnlineState);
        window.removeEventListener("offline", updateOnlineState);
        window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
        window.removeEventListener("appinstalled", installed);
      };
    }

    return () => {
      window.removeEventListener("online", updateOnlineState);
      window.removeEventListener("offline", updateOnlineState);
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator) ||
      __DEV__
    ) {
      return;
    }

    let disposed = false;
    let registration: ServiceWorkerRegistration | null = null;
    let warmTimer: number | null = null;
    const watchRegistration = (current: ServiceWorkerRegistration) => {
      registration = current;
      if (current.waiting) setWaitingWorker(current.waiting);
      current.addEventListener("updatefound", () => {
        const installing = current.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(current.waiting ?? installing);
          }
        });
      });
    };

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((current) => {
        if (!disposed) {
          watchRegistration(current);
          // Download non-essential offline images only after the UI is usable.
          warmTimer = window.setTimeout(() => {
            const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
            if (!disposed && navigator.onLine && !connection?.saveData) {
              (navigator.serviceWorker.controller ?? current.active)?.postMessage({ type: "WARM_OFFLINE" });
            }
          }, 20000);
        }
      })
      .catch((error) => console.warn("Service worker registration failed", error));

    const controllerChanged = () => {
      if (reloadForUpdateRef.current && isHomeLocation()) {
        window.location.reload();
      } else {
        reloadForUpdateRef.current = false;
        setUpdating(false);
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", controllerChanged);
    const updateTimer = window.setInterval(() => void registration?.update(), 60 * 60 * 1000);
    return () => {
      disposed = true;
      window.clearInterval(updateTimer);
      if (warmTimer !== null) window.clearTimeout(warmTimer);
      navigator.serviceWorker.removeEventListener("controllerchange", controllerChanged);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || !navigator.storage?.persisted) return;
    const requestPersistentStorage = async () => {
      if (!(await navigator.storage.persisted())) {
        await navigator.storage.persist?.();
      }
    };
    void requestPersistentStorage().catch((error) =>
      console.warn("Persistent browser storage could not be requested", error),
    );
  }, []);

  if (Platform.OS !== "web") return null;

  const dismissInstall = () => {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
    setShowInstall(false);
  };

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setShowInstall(false);
      setInstallPrompt(null);
      return;
    }
    Alert.alert(
      "Installér på iPhone eller iPad",
      "Åbn Del-menuen i Safari, vælg “Føj til hjemmeskærm”, og bekræft med “Tilføj”.",
    );
  };

  const activateUpdate = () => {
    if (!waitingWorker || !onHome || !online || updating) return;
    setUpdating(true);
    setUpdateFailed(false);
    reloadForUpdateRef.current = true;
    try {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } catch {
      reloadForUpdateRef.current = false;
      setUpdating(false);
      setUpdateFailed(true);
      return;
    }
    // Do not leave the user trapped in a disabled update state on failure.
    window.setTimeout(() => {
      if (reloadForUpdateRef.current) {
        reloadForUpdateRef.current = false;
        setUpdating(false);
        setUpdateFailed(true);
      }
    }, 10000);
  };

  const deferUpdate = () => {
    reloadForUpdateRef.current = false;
    setUpdating(false);
    setDismissedWorker(waitingWorker);
  };

  if (Platform.OS !== "web") return null;

  const showUpdate = online && onHome && !!waitingWorker && dismissedWorker !== waitingWorker;
  const showOtherBanner = !online || (showInstall && !isStandalone());
  if (!showUpdate && !showOtherBanner) return null;

  return (
    <>
      {showUpdate ? (
        <PwaUpdateModal
          updating={updating}
          failed={updateFailed}
          onUpdate={activateUpdate}
          onLater={deferUpdate}
        />
      ) : null}
      {!showUpdate && showOtherBanner ? (
        <View accessibilityLiveRegion="polite" style={styles.container}>
          {!online ? (
            <Text style={styles.message}>Offline · Fremgang gemmes på enheden.</Text>
          ) : (
            <>
              <Text style={styles.message}>Installér FlashMedic</Text>
              <Pressable accessibilityRole="button" onPress={install} style={styles.action}>
                <Text style={styles.actionText}>Installér</Text>
              </Pressable>
              <Pressable accessibilityLabel="Skjul installationsvejledning" onPress={dismissInstall} style={styles.dismiss}>
                <Text style={styles.dismissText}>×</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed" as never,
    left: Spacing.sm,
    right: Spacing.sm,
    bottom: `max(${Spacing.sm}px, env(safe-area-inset-bottom))` as never,
    zIndex: 1000,
    maxWidth: 720,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: ColorTokens.surface.toolElevated,
    borderWidth: 1,
    borderColor: ColorTokens.border.default,
    padding: Spacing.sm,
    boxShadow: "0 8px 24px rgba(0,0,0,0.32)" as never,
  },
  message: {
    flex: 1,
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  action: {
    minHeight: 40,
    justifyContent: "center",
    borderRadius: Radii.control,
    backgroundColor: ColorTokens.accent.action,
    paddingHorizontal: Spacing.md,
  },
  actionText: { color: ColorTokens.text.primary, fontWeight: "700" },
  dismiss: { minWidth: 36, minHeight: 40, alignItems: "center", justifyContent: "center" },
  dismissText: { color: ColorTokens.text.secondary, fontSize: 24, lineHeight: 26 },
});
