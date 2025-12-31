import { ReactNode } from "react";

interface InfoCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        label: string;
    };
    icon?: ReactNode;
    variant?: "default" | "success" | "warning" | "danger";
}

export default function InfoCard({
    title,
    value,
    change,
    icon,
    variant = "default",
}: InfoCardProps) {
    const variantStyles = {
        default: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
        success: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
        warning: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
        danger: "from-red-500/20 to-rose-500/20 border-red-500/30",
    };

    const iconBgStyles = {
        default: "bg-violet-500/20 text-violet-400",
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/20 text-amber-400",
        danger: "bg-red-500/20 text-red-400",
    };

    return (
        <div
            className={`bg-gradient-to-br ${variantStyles[variant]} backdrop-blur-sm border rounded-xl p-6 shadow-xl`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {change && (
                        <div className="flex items-center mt-2">
                            <span
                                className={`text-sm font-medium ${change.value >= 0 ? "text-emerald-400" : "text-red-400"
                                    }`}
                            >
                                {change.value >= 0 ? "↑" : "↓"} {Math.abs(change.value)}%
                            </span>
                            <span className="text-gray-500 text-sm ml-2">{change.label}</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-lg ${iconBgStyles[variant]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

// Card grid wrapper
export function CardGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {children}
        </div>
    );
}
