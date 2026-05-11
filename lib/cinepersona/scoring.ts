import { questions } from "./questions";
import type { AxisId, AxisLetter, AxisScore, LikertValue, TestResult } from "./types";

const PRIMARY: Record<AxisId, AxisLetter> = {
  1: "E",
  2: "S",
  3: "A",
  4: "C",
};

const OPPOSITE: Record<AxisId, AxisLetter> = {
  1: "D",
  2: "L",
  3: "I",
  4: "W",
};

const LIKERT_SCALE: LikertValue[] = [-3, -2, -1, 0, 1, 2, 3];

export const likertScale = LIKERT_SCALE;

export const likertLabels: Record<LikertValue, string> = {
  [-3]: "Strongly Disagree",
  [-2]: "Disagree",
  [-1]: "Slightly Disagree",
  [0]: "Neutral",
  [1]: "Slightly Agree",
  [2]: "Agree",
  [3]: "Strongly Agree",
};

export const likertShortLabels: Record<LikertValue, string> = {
  [-3]: "Strong −",
  [-2]: "−",
  [-1]: "Slight −",
  [0]: "0",
  [1]: "Slight +",
  [2]: "+",
  [3]: "Strong +",
};

export function scoreAxis(
  axis: AxisId,
  answers: Record<number, LikertValue>,
): AxisScore {
  const primary = PRIMARY[axis];
  const opposite = OPPOSITE[axis];
  const axisQuestions = questions.filter((q) => q.axis === axis);
  const max = axisQuestions.length * 3; // each Likert ∈ [-3, +3]

  let raw = 0;
  for (const q of axisQuestions) {
    const value = answers[q.id] ?? 0;
    raw += q.direction === primary ? value : -value;
  }

  // Normalize: -max .. +max → 0 .. 100
  const primaryPct = max === 0 ? 50 : Math.round(((raw + max) / (max * 2)) * 100);
  const letter: AxisLetter = primaryPct >= 50 ? primary : opposite;

  return { axis, primary, letter, primaryPct, raw };
}

export function scoreTest(answers: Record<number, LikertValue>): TestResult {
  const axes: AxisScore[] = [1, 2, 3, 4].map((id) =>
    scoreAxis(id as AxisId, answers),
  );
  const code = axes.map((a) => a.letter).join("");
  return {
    code,
    axes: axes as TestResult["axes"],
    answers,
  };
}

export function unansweredQuestionIds(answers: Record<number, LikertValue>) {
  return questions
    .map((q) => q.id)
    .filter((id) => !(id in answers));
}
