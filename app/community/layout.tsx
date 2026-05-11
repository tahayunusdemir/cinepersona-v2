import { MenuIcon } from "lucide-react";

import { CommunitySidebar } from "@/components/community/community-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { listBoards } from "@/lib/community/queries";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const allBoards = await listBoards(supabase);
  const boards = allBoards.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    locked: b.locked,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                aria-label="Open community menu"
              >
                <MenuIcon /> Browse community
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b">
              <SheetTitle>Community</SheetTitle>
              <SheetDescription>
                Boards, people, and your activity.
              </SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto px-3 py-4">
              <CommunitySidebar boards={boards} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <CommunitySidebar boards={boards} />
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
