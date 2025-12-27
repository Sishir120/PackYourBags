import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    unit?: string;
    icon?: React.ReactNode;
    color?: "rose" | "lime" | "cyan";
}

export function StatCard({ label, value, unit, icon, color = "lime" }: StatCardProps) {
    const colorMap = {
        rose: "text-rose-600 bg-rose-500/10",
        lime: "text-[#DFFF00] bg-[#DFFF00]/10",
        cyan: "text-cyan-500 bg-cyan-500/10",
    };

    return (
        <div className="glass-premium p-4 rounded-xl border border-white/5 transition-all hover:bg-white/5 group">
            <div className="flex items-center justify-between mb-3">
                <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity",
                    color === "rose" ? "text-rose-400" :
                        color === "lime" ? "text-emerald-400" : "text-cyan-400"
                )}>
                    {label}
                </span>
                {icon && (
                    <div className={cn("p-1.5 rounded-lg bg-white/5 transition-colors group-hover:bg-white/10",
                        color === "rose" ? "text-rose-400" :
                            color === "lime" ? "text-emerald-400" : "text-cyan-400"
                    )}>
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tighter">{value}</span>
                {unit && <span className="text-[10px] font-black uppercase text-foreground-muted opacity-40">{unit}</span>}
            </div>
        </div>
    );
}
