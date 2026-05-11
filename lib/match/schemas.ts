import { z } from "zod";

import { MESSAGE_MAX_LEN } from "./types";

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty.")
  .max(MESSAGE_MAX_LEN, `Maximum ${MESSAGE_MAX_LEN} characters.`);
