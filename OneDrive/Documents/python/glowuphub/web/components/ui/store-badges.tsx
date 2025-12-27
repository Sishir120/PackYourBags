import Link from "next/link";

export function AppStoreBadge({ className }: { className?: string }) {
    return (
        <Link href="#" className={className} aria-label="Download on the App Store">
            <svg viewBox="0 0 120 40" className="h-full w-auto" preserveAspectRatio="xMidYMid meet">
                <image href="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" width="120" height="40" />
            </svg>
        </Link>
    );
}

export function GooglePlayBadge({ className }: { className?: string }) {
    return (
        <Link href="#" className={className} aria-label="Get it on Google Play">
            <svg viewBox="0 0 135 40" className="h-full w-auto" preserveAspectRatio="xMidYMid meet">
                <image href="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" width="135" height="40" />
            </svg>
        </Link>
    );
}

export function StoreBadges({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <Link href="#" className="transition-opacity hover:opacity-80">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on the App Store"
                    className="h-10 w-auto"
                />
            </Link>
            <Link href="#" className="transition-opacity hover:opacity-80">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-10 w-auto"
                />
            </Link>
        </div>
    );
}
