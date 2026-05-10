"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm opacity-70">
        An unexpected error occurred. You can try again.
      </p>
      {error.digest && (
        <p className="text-xs font-mono opacity-50">ref: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-2 rounded-md border border-current/20 px-4 py-2 text-sm hover:opacity-80"
      >
        Try again
      </button>
    </main>
  );
}
