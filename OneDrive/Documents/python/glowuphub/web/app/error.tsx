'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <div className="max-w-md space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Something went wrong!
                </h1>
                <p className="text-lg text-foreground-muted">
                    We apologize for the inconvenience. Our team has been notified of this issue.
                </p>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => reset()}
                        className="rounded-full px-8"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/dashboard'}
                        className="rounded-full px-8"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
