"use client";

import { useEffect } from "react";

export function TikTokEmbed({ videoId, url }: { videoId?: string; url?: string }) {
    // Construct the URL: use provided url, or fall back to constructing from videoId
    // Default to a safe placeholder if neither is provided (though types suggest one should be)
    const embedUrl = url || `https://www.tiktok.com/@sabu7916/video/${videoId}`;
    const videoIdAttr = videoId || url?.split('/').pop()?.split('?')[0] || '';

    useEffect(() => {
        // Check if script already exists to avoid duplicates
        if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
            // If script exists, force a reload of the embeds
            // @ts-ignore
            if (window.tiktok?.embed?.load) {
                // @ts-ignore
                window.tiktok.embed.load();
            }
            return;
        }

        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Optional cleanup
        };
    }, []);

    return (
        <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm flex items-center justify-center p-0">
            <blockquote
                className="tiktok-embed"
                cite={embedUrl}
                data-video-id={videoIdAttr}
                data-embed-from="embed_page"
                style={{ maxWidth: "605px", minWidth: "325px", margin: 0 }}
            >
                <section>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={embedUrl}
                    >
                        {/* Fallback content if embed fails */}
                        View on TikTok
                    </a>
                </section>
            </blockquote>
        </div>
    );
}
