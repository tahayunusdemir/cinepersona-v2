"use client";

import { notFound } from "next/navigation";

import { getPickQuestion } from "@/lib/cinepersona/film-picks-questions";

import { PicksStep } from "./picks-step";
import { useTakeContext } from "./take-shell";

type Props = { questionId: number };

export function PicksStepContainer({ questionId }: Props) {
  const question = getPickQuestion(questionId);
  if (!question) notFound();

  const { state, togglePick } = useTakeContext();

  return (
    <PicksStep
      question={question}
      state={state}
      onTogglePick={togglePick}
    />
  );
}
