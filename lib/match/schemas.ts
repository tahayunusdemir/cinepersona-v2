import { z } from "zod";

import { MESSAGE_MAX_LEN, PICKS_MAX, PICKS_MIN } from "./types";

export const picksSchema = z
  .array(z.coerce.number().int().positive())
  .min(PICKS_MIN, `Pick at least ${PICKS_MIN} films.`)
  .max(PICKS_MAX, `Pick at most ${PICKS_MAX} films.`)
  .refine((arr) => new Set(arr).size === arr.length, {
    message: "No duplicate picks.",
  });

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty.")
  .max(MESSAGE_MAX_LEN, `Maximum ${MESSAGE_MAX_LEN} characters.`);

export type PicksInput = z.infer<typeof picksSchema>;
