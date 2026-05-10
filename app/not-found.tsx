import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-mono opacity-60">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm opacity-70">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm underline underline-offset-4 hover:opacity-80"
      >
        Back to home
      </Link>
    </main>
  );
}
