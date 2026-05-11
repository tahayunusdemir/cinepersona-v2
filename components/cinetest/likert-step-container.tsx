"use client";

import { LikertStep } from "./likert-step";
import { useTakeContext } from "./take-shell";

type Props = { page: number };

export function LikertStepContainer({ page }: Props) {
  const { state, setAnswer } = useTakeContext();
  return <LikertStep page={page} state={state} onSetAnswer={setAnswer} />;
}
