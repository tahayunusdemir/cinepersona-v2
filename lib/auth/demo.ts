// Single source of truth for the demo account exposed via the login-page
// button. The credentials below MUST stay in sync with
// scripts/seed-demo.mjs (the DEMO_USERS[0] entry) — both are seeded
// together so the button works as soon as `npm run seed:demo` has run.

export const DEMO_CREDENTIALS = {
  email: "demo@cinepersona.app",
  password: "demoPass!23",
  username: "demo",
} as const;
