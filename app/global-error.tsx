"use client";

import { useEffect } from "react";

const MONO =
  "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS =
  "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
const SERIF = "ui-serif, Georgia, serif";

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
          background: "#0a0a0a",
          color: "#f4f1e8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: SANS,
        }}
      >
        <title>Projection error · CinePersona</title>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(244,241,232,0.6)",
          }}
        >
          Catastrophic stop
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2.25rem",
            fontWeight: 400,
            fontFamily: SERIF,
            letterSpacing: "-0.02em",
          }}
        >
          The projector stopped.
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 420,
            fontSize: "0.875rem",
            opacity: 0.7,
          }}
        >
          The application crashed unexpectedly. You can try rewinding, or
          reload the page.
        </p>
        {error.digest && (
          <p
            style={{
              margin: 0,
              fontFamily: MONO,
              fontSize: "0.7rem",
              opacity: 0.55,
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
            marginTop: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            background: "#ecb756",
            color: "#1a1840",
            border: 0,
            borderRadius: 9999,
            cursor: "pointer",
          }}
        >
          Rewind & retry
        </button>
      </body>
    </html>
  );
}
