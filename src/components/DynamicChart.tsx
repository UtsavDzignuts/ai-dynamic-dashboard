/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ChartType } from "@/lib/ai-interpreter";

interface DynamicChartProps {
    data: any[];
    chartType: ChartType;
    xKey: string;
    yKeys: string[];
    colors?: string[];
    title?: string;
    description?: string;
}

const defaultColors = [
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
];

export default function DynamicChart({
    data,
    chartType,
    xKey,
    yKeys,
    colors = defaultColors,
    title,
    description,
}: DynamicChartProps) {
    // Track which series are visible (all visible by default)
    const [visibleSeries, setVisibleSeries] = useState<Set<string>>(
        new Set(yKeys)
    );

    // Toggle a series visibility
    const toggleSeries = useCallback((key: string) => {
        setVisibleSeries((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                // Don't allow hiding all series - keep at least one
                if (next.size > 1) {
                    next.delete(key);
                }
            } else {
                next.add(key);
            }
            return next;
        });
    }, []);

    // Custom legend click handler
    const handleLegendClick = (e: any) => {
        const { dataKey } = e;
        if (dataKey) {
            toggleSeries(dataKey);
        }
    };

    // Custom legend renderer with interactive styling
    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {payload?.map((entry: any, index: number) => {
                    const isVisible = visibleSeries.has(entry.dataKey);
                    return (
                        <button
                            key={`legend-${index}`}
                            onClick={() => toggleSeries(entry.dataKey)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${isVisible
                                ? "bg-gray-700/50 hover:bg-gray-600/50"
                                : "bg-gray-800/50 opacity-50 hover:opacity-75"
                                }`}
                        >
                            <span
                                className={`w-3 h-3 rounded-full transition-opacity ${isVisible ? "opacity-100" : "opacity-40"
                                    }`}
                                style={{ backgroundColor: entry.color }}
                            />
                            <span
                                className={`text-sm transition-colors ${isVisible ? "text-gray-200" : "text-gray-500 line-through"
                                    }`}
                            >
                                {entry.value}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    // Get visible yKeys
    const activeKeys = yKeys.filter((key) => visibleSeries.has(key));

    const renderChart = () => {
        switch (chartType) {
            case "line":
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey={xKey}
                            stroke="#9ca3af"
                            tick={{ fill: "#9ca3af" }}
                        />
                        <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "1px solid #374151",
                                borderRadius: "8px",
                                color: "#f3f4f6",
                            }}
                        />
                        <Legend content={renderLegend} onClick={handleLegendClick} />
                        {yKeys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                dot={{ fill: colors[index % colors.length], strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                hide={!visibleSeries.has(key)}
                            />
                        ))}
                    </LineChart>
                );

            case "area":
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey={xKey}
                            stroke="#9ca3af"
                            tick={{ fill: "#9ca3af" }}
                        />
                        <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "1px solid #374151",
                                borderRadius: "8px",
                                color: "#f3f4f6",
                            }}
                        />
                        <Legend content={renderLegend} onClick={handleLegendClick} />
                        {yKeys.map((key, index) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                fill={colors[index % colors.length]}
                                fillOpacity={0.3}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                hide={!visibleSeries.has(key)}
                            />
                        ))}
                    </AreaChart>
                );

            case "bar":
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey={xKey}
                            stroke="#9ca3af"
                            tick={{ fill: "#9ca3af" }}
                        />
                        <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "1px solid #374151",
                                borderRadius: "8px",
                                color: "#f3f4f6",
                            }}
                        />
                        <Legend content={renderLegend} onClick={handleLegendClick} />
                        {yKeys.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={colors[index % colors.length]}
                                radius={[4, 4, 0, 0]}
                                hide={!visibleSeries.has(key)}
                            />
                        ))}
                    </BarChart>
                );
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
            {/* Header with title and controls */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    {title && (
                        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
                    )}
                    {description && (
                        <p className="text-gray-400 text-sm">{description}</p>
                    )}
                </div>

                {/* Series toggle buttons */}
                <div className="flex items-center gap-2">
                    {yKeys.length > 1 && (
                        <>
                            <span className="text-xs text-gray-500 mr-2">Show:</span>
                            {yKeys.map((key, index) => {
                                const isVisible = visibleSeries.has(key);
                                return (
                                    <button
                                        key={key}
                                        onClick={() => toggleSeries(key)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border ${isVisible
                                            ? "border-transparent text-white"
                                            : "border-gray-600 text-gray-500 bg-transparent hover:border-gray-500"
                                            }`}
                                        style={{
                                            backgroundColor: isVisible
                                                ? colors[index % colors.length]
                                                : "transparent",
                                        }}
                                    >
                                        {key}
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}

