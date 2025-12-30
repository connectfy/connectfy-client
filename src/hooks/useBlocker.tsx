import { useCallback, useEffect, useRef, useState } from "react";
import { history } from "@/common/helpers/history";

interface PendingTransition {
  retry?: () => void;
  location?: any;
  action?: string;
  message?: string;
};

export function useBlocker(when: boolean) {
  const [pending, setPending] = useState<PendingTransition | null>(null);
  const unblockRef = useRef<() => void | null>(null);

  useEffect(() => {
    if (!when) return;

    const unblock = history.block((tx: any) => {
      setPending({
        retry: typeof tx.retry === "function" ? tx.retry : undefined,
        location: tx.location ?? tx,
        action: tx.action,
      });
    });

    unblockRef.current = unblock;
    return () => {
      if (unblockRef.current) unblockRef.current();
      unblockRef.current = null;
    };
  }, [when]);

  const confirm = useCallback(() => {
    if (unblockRef.current) {
      unblockRef.current();
      unblockRef.current = null;
    }

    if (!pending) return;

    if (pending.retry) {
      pending.retry();
    } else if (pending.location) {
      const loc = pending.location;
      const to = typeof loc === "string" ? loc : loc.pathname ?? loc;
      history.push(to);
    }
    setPending(null);
  }, [pending]);

  const cancel = useCallback(() => {
    setPending(null);
  }, []);

  return { pending, confirm, cancel };
}
