import { useCallback, useEffect, useState } from "react";
import type { AuthSession, SignInInput } from "@/lib/domain/auth";
import { repositories } from "@/lib/repositories";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { clearSecureSession, readSecureSession, writeSecureSession } from "@/lib/storage/secure-session-storage";
import { analytics } from "@/lib/services/observability/analytics";
import { errorReporter } from "@/lib/services/observability/error-reporter";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<"idle" | "restoring" | "signed-in" | "signed-out" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const restore = useCallback(async () => {
    setStatus("restoring");
    setErrorMessage("");
    try {
      const stored = await readSecureSession();
      if (stored) {
        setSession(stored);
        setStatus("signed-in");
        analytics.track("session_restored", { source: "storage" });
        return stored;
      }
      const remote = await repositories.auth.restoreSession();
      if (remote) {
        await writeSecureSession(remote);
        setSession(remote);
        setStatus("signed-in");
        analytics.track("session_restored", { source: "repository" });
        return remote;
      }
      setStatus("signed-out");
      return null;
    } catch (error) {
      errorReporter.capture(error, { workflow: "auth_restore" });
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    analytics.track("login_attempted", { mode: "password" });
    setStatus("restoring");
    setErrorMessage("");
    try {
      const nextSession = await repositories.auth.signIn(input);
      await writeSecureSession(nextSession);
      setSession(nextSession);
      setStatus("signed-in");
      return nextSession;
    } catch (error) {
      analytics.track("login_failed", { reason: "repository_error" });
      errorReporter.capture(error, { workflow: "auth_sign_in" });
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await repositories.auth.signOut();
    await clearSecureSession();
    setSession(null);
    setStatus("signed-out");
  }, []);

  useEffect(() => {
    void restore();
  }, [restore]);

  return { session, customer: session?.customer ?? null, status, errorMessage, restore, signIn, signOut };
}
