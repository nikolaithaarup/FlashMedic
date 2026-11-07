import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  SemanticStates,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { PrimaryButton } from "../../ui/primitives";
import { requestSynapseCode, verifySynapseCode } from "../../services/synapseAuth";
import { synchronizeProgress } from "../../sync/progressSync";

type Props = {
  onAuthenticated: (result: { email: string; syncConfirmed: boolean }) => void | Promise<void>;
};

export function SynapseEmailLogin({ onAuthenticated }: Props) {
  const codeInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!challengeToken) return;
    const focusTimer = setTimeout(() => codeInputRef.current?.focus(), 0);
    return () => clearTimeout(focusTimer);
  }, [challengeToken]);

  const requestCode = useCallback(async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setMessage("Indtast din e-mail.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      setChallengeToken(await requestSynapseCode(normalizedEmail));
      setMessage("Koden er på vej.");
    } catch {
      setMessage("Kunne ikke sende koden.");
    } finally {
      setBusy(false);
    }
  }, [email]);

  const verifyCode = useCallback(async () => {
    if (!challengeToken || !/^\d{6}$/.test(code)) {
      setMessage("Indtast den sekscifrede kode.");
      return;
    }
    setBusy(true);
    setMessage(null);
    let verifiedEmail = email.trim();
    try {
      const user = await verifySynapseCode(challengeToken, code);
      verifiedEmail = user.email ?? verifiedEmail;
    } catch {
      setMessage("Koden er ugyldig eller udløbet.");
      setBusy(false);
      return;
    }

    let syncConfirmed = false;
    try {
      await synchronizeProgress();
      syncConfirmed = true;
    } catch {
      // Authentication succeeded. The shared sync indicator owns retry/error state.
    }
    setBusy(false);
    await onAuthenticated({ email: verifiedEmail, syncConfirmed });
  }, [challengeToken, code, email, onAuthenticated]);

  return (
    <>
      {challengeToken ? (
        <>
          <Text style={styles.label}>Seks-cifret kode</Text>
          <TextInput
            ref={codeInputRef}
            accessibilityLabel="Seks-cifret bekræftelseskode"
            autoComplete="one-time-code"
            autoCorrect={false}
            editable={!busy}
            inputMode="numeric"
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            maxLength={6}
            onChangeText={(value) => setCode(value.replace(/\D/g, ""))}
            onSubmitEditing={verifyCode}
            placeholder="123456"
            placeholderTextColor={ColorTokens.text.muted}
            returnKeyType="done"
            selectTextOnFocus
            spellCheck={false}
            style={[styles.input, styles.codeInput]}
            textContentType="oneTimeCode"
            value={code}
          />
          <PrimaryButton label="Bekræft" loading={busy} onPress={verifyCode} />
          <Pressable
            accessibilityLabel="Send ny bekræftelseskode"
            accessibilityRole="button"
            disabled={busy}
            onPress={requestCode}
            style={({ pressed }) => [
              styles.resendAction,
              pressed && styles.resendPressed,
              busy && styles.resendDisabled,
            ]}
          >
            <Text style={styles.resendText}>Send ny kode</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            accessibilityLabel="E-mail til login"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!busy}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={requestCode}
            placeholder="din@email.dk"
            placeholderTextColor={ColorTokens.text.muted}
            returnKeyType="send"
            spellCheck={false}
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />
          <PrimaryButton label="Send kode" loading={busy} onPress={requestCode} />
        </>
      )}

      {message ? (
        <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  input: {
    width: "100%",
    minHeight: Interaction.minimumTouchTarget,
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    overflow: "hidden",
  },
  codeInput: {
    minHeight: 54,
    fontSize: Typography.sizes.sectionTitle,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 6,
    paddingVertical: 0,
    textAlign: "center",
  },
  resendAction: {
    alignSelf: "center",
    minHeight: Interaction.minimumTouchTarget,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
  },
  resendPressed: { opacity: Interaction.pressedOpacity },
  resendDisabled: { opacity: Interaction.disabledOpacity },
  resendText: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
    textAlign: "center",
  },
  message: {
    color: SemanticStates.warning.foreground,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
});
