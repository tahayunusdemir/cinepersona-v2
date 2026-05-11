import { z } from "zod";

import { FRIEND_MESSAGE_MAX_LEN } from "./types";

export const friendMessageSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty.")
  .max(FRIEND_MESSAGE_MAX_LEN, `Maximum ${FRIEND_MESSAGE_MAX_LEN} characters.`);
