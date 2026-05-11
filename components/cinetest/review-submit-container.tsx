"use client";

import { ReviewSubmit } from "./review-submit";
import { useTakeContext } from "./take-shell";

export function ReviewSubmitContainer() {
  const { state, reset } = useTakeContext();
  return <ReviewSubmit state={state} onReset={reset} />;
}
