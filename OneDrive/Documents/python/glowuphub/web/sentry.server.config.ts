import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,

    // You can set this to false if you want to test in development
    enabled: process.env.NODE_ENV === 'production',
});
