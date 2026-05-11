"use server";

import { blockUser, unblockUser } from "@/lib/community/actions";

export type BlockActionState = {
  ok?: boolean;
  error?:
    | "unauthorized"
    | "cannot_block_self"
    | "validation"
    | "unknown";
  message?: string;
};

function readTarget(formData: FormData): {
  targetId: string;
  targetUsername: string | null;
} | null {
  const targetId = formData.get("target_id");
  const targetUsername = formData.get("target_username");
  if (typeof targetId !== "string" || targetId.length === 0) return null;
  return {
    targetId,
    targetUsername:
      typeof targetUsername === "string" && targetUsername.length > 0
        ? targetUsername
        : null,
  };
}

function mapResult(
  ok: boolean | undefined,
  error: string | undefined,
  okMessage: "blocked" | "unblocked",
): BlockActionState {
  if (ok) return { ok: true, message: okMessage };
  if (error === "unauthorized") return { ok: false, error: "unauthorized" };
  if (error === "validation") return { ok: false, error: "cannot_block_self" };
  return { ok: false, error: "unknown" };
}

export async function blockUserAction(
  _prev: BlockActionState | undefined,
  formData: FormData,
): Promise<BlockActionState> {
  const target = readTarget(formData);
  if (!target) return { ok: false, error: "validation" };

  const res = await blockUser(target.targetId, target.targetUsername);
  return mapResult(res.ok, res.error, "blocked");
}

export async function unblockUserAction(
  _prev: BlockActionState | undefined,
  formData: FormData,
): Promise<BlockActionState> {
  const target = readTarget(formData);
  if (!target) return { ok: false, error: "validation" };

  const res = await unblockUser(target.targetId, target.targetUsername);
  return mapResult(res.ok, res.error, "unblocked");
}
