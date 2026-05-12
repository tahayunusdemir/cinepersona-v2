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
          margin: 0,
          minHeight: "100dvh",
          background: "#0a0820",
          color: "#f4f1e8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <title>Projection error · CinePersona</title>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at top, #2e2a64 0%, transparent 55%)",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(244,241,232,0.6)",
          }}
        >
          Catastrophic stop
        </div>
        <h1
          style={{
            position: "relative",
            fontSize: "2.25rem",
            fontWeight: 400,
            margin: 0,
            fontFamily: "ui-serif, Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          The projector stopped.
        </h1>
        <p
          style={{
            position: "relative",
            fontSize: "0.875rem",
            opacity: 0.7,
            maxWidth: 420,
            margin: 0,
          }}
        >
          The application crashed unexpectedly. You can try rewinding, or
          reload the page.
        </p>
        {error.digest && (
          <p
            style={{
              position: "relative",
              fontSize: "0.7rem",
              opacity: 0.55,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Ref · {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            position: "relative",
            marginTop: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            background: "#ecb756",
            color: "#1a1840",
            border: 0,
            borderRadius: 9999,
            boxShadow: "0 8px 28px -12px rgba(236,183,86,0.5)",
            cursor: "pointer",
          }}
        >
          Rewind & retry
        </button>
      </body>
    </html>
  );
}
