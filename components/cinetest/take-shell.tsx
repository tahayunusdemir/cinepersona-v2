"use client";

import { useParams, usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { ChevronRightIcon, ListIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCineTestState } from "@/hooks/use-cinetest-state";
import { cn } from "@/lib/utils";
import type {
  LikertValue,
  PickSelection,
  TestStateV2,
} from "@/lib/cinepersona/types";

import { PicksAside } from "./picks-aside";
import { TakeProgress } from "./take-progress";

type TakeContextValue = {
  state: TestStateV2;
  hydrated: boolean;
  setAnswer: (id: number, value: LikertValue) => void;
  togglePick: (
    questionId: number,
    selection: PickSelection,
    max: number,
  ) => void;
  setPicks: (questionId: number, picks: PickSelection[]) => void;
  reset: () => void;
};

const TakeContext = createContext<TakeContextValue | null>(null);

export function useTakeContext(): TakeContextValue {
  const ctx = useContext(TakeContext);
  if (!ctx) {
    throw new Error("useTakeContext must be used inside <TakeShell>");
  }
  return ctx;
}

function activeQuestionFromPathname(pathname: string): number | undefined {
  const match = pathname.match(/\/cinetest\/take\/picks\/(\d+)/);
  if (!match) return undefined;
  const id = Number.parseInt(match[1], 10);
  return Number.isFinite(id) ? id : undefined;
}

export function TakeShell({ children }: { children: ReactNode }) {
  const hookValue = useCineTestState();
  const pathname = usePathname() ?? "";
  const params = useParams();

  const contextValue = useMemo<TakeContextValue>(
    () => ({
      state: hookValue.state,
      hydrated: hookValue.hydrated,
      setAnswer: hookValue.setAnswer,
      togglePick: hookValue.togglePick,
      setPicks: hookValue.setPicks,
      reset: hookValue.reset,
    }),
    [hookValue],
  );

  // Track active pick question (for highlight in aside / progress).
  const activeQuestionId =
    params && typeof params.n === "string"
      ? Number.parseInt(params.n, 10)
      : activeQuestionFromPathname(pathname);

  // The aside is only relevant while picking films. On the Likert pages
  // and the review screen it adds noise, so we hide it there.
  const showAside = pathname.includes("/cinetest/take/picks/");

  return (
    <TakeContext.Provider value={contextValue}>
      <TakeProgress state={hookValue.state} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
        <div
          className={cn(
            "grid gap-6",
            showAside && "lg:grid-cols-[1fr_320px]",
          )}
        >
          <main className="min-w-0">{children}</main>

          {showAside ? (
            <>
              <div className="hidden lg:block">
                <div className="sticky top-32">
                  <PicksAside
                    state={hookValue.state}
                    activeQuestionId={activeQuestionId}
                  />
                </div>
              </div>

              <div className="fixed bottom-4 right-4 z-30 lg:hidden">
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button
                        size="sm"
                        variant="default"
                        className="shadow-lg"
                      >
                        <ListIcon className="size-4" />
                        Your picks
                        <ChevronRightIcon className="size-4" />
                      </Button>
                    }
                  />
                  <SheetContent side="right" className="w-full sm:max-w-sm">
                    <SheetHeader>
                      <SheetTitle>Your picks</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto p-4 pt-0">
                      <PicksAside
                        state={hookValue.state}
                        activeQuestionId={activeQuestionId}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </TakeContext.Provider>
  );
}
