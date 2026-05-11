"use client";

import { ReviewSubmit } from "./review-submit";
import { useTakeContext } from "./take-shell";

export function ReviewSubmitContainer({ signedIn }: { signedIn: boolean }) {
  const { state, reset } = useTakeContext();
  return <ReviewSubmit state={state} onReset={reset} signedIn={signedIn} />;
}
