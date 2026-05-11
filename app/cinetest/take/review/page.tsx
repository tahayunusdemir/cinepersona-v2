import { ReviewSubmitContainer } from "@/components/cinetest/review-submit-container";
import { createClient } from "@/lib/supabase/server";

export default async function ReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ReviewSubmitContainer signedIn={Boolean(user)} />;
}
