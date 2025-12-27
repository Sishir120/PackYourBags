import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
            <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
            <p className="text-foreground-muted mb-8 text-lg">Could not find requested resource</p>
            <Link href="/dashboard">
                <Button className="rounded-full px-8">Return Home</Button>
            </Link>
        </div>
    );
}
