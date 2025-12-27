import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    // You can set this to false if you want to test in development
    enabled: process.env.NODE_ENV === 'production',

    integrations: [
        Sentry.replayIntegration(),
    ],
});
