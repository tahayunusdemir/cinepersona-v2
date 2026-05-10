"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <title>Something went wrong</title>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
          The application crashed unexpectedly.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: "0.75rem",
              opacity: 0.5,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            ref: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            border: "1px solid currentColor",
            borderRadius: "0.375rem",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
