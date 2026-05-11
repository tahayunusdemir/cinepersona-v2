import { notFound } from "next/navigation";

import { PicksStepContainer } from "@/components/cinetest/picks-step-container";
import { FILM_PICKS_COUNT } from "@/lib/cinepersona/film-picks-questions";

type PageParams = { params: Promise<{ n: string }> };

export default async function PicksPage({ params }: PageParams) {
  const { n } = await params;
  const questionId = Number.parseInt(n, 10);
  if (
    !Number.isFinite(questionId) ||
    questionId < 1 ||
    questionId > FILM_PICKS_COUNT
  ) {
    notFound();
  }
  return <PicksStepContainer questionId={questionId} />;
}
