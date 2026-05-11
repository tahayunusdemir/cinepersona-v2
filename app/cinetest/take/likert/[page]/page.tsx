import { notFound } from "next/navigation";

import { LikertStepContainer } from "@/components/cinetest/likert-step-container";

type PageParams = { params: Promise<{ page: string }> };

export default async function LikertPage({ params }: PageParams) {
  const { page } = await params;
  const pageNum = Number.parseInt(page, 10);
  if (!Number.isFinite(pageNum) || pageNum < 1 || pageNum > 4) {
    notFound();
  }
  return <LikertStepContainer page={pageNum} />;
}
