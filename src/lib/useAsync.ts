import { useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = [], enabled = true): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: enabled, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fnRef
      .current()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (alive) setState({ data: null, loading: false, error: err?.message || "Something went wrong" });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return state;
}
