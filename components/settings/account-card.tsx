"use client";

import { useTransition } from "react";
import { Loader2Icon, LogOutIcon, TriangleAlertIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logoutAction } from "@/lib/auth/actions";
import { deactivateAccountAction } from "@/lib/settings/actions";

export function AccountCard() {
  const [signingOut, startSignOut] = useTransition();
  const [deactivating, startDeactivate] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Sign out of this device or deactivate your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-sm text-muted-foreground">
                End your session on this device.
              </p>
            </div>
            <Button
              variant="outline"
              disabled={signingOut}
              onClick={() => startSignOut(() => logoutAction())}
            >
              {signingOut ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <LogOutIcon />
              )}
              Sign out
            </Button>
          </div>

          <div className="flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Deactivate account</p>
              <p className="text-sm text-muted-foreground">
                Hide your profile and content. Sign in again with the same
                email and password to reactivate.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" disabled={deactivating}>
                    {deactivating ? (
                      <Loader2Icon className="animate-spin" />
                    ) : null}
                    Deactivate account
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <TriangleAlertIcon className="text-destructive" />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Deactivate this account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your profile and content will be hidden from CinePersona.
                    You can reactivate at any time by signing in with the same
                    email and password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={deactivating}
                    onClick={() =>
                      startDeactivate(() => deactivateAccountAction())
                    }
                  >
                    {deactivating ? (
                      <Loader2Icon className="animate-spin" />
                    ) : null}
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
