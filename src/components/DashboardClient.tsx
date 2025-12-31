"use client";

import { useState } from "react";
import PromptInput from "@/components/PromptInput";
import DynamicRenderer from "@/components/DynamicRenderer";
import { AIInterpretation } from "@/lib/ai-interpreter";
import { mockInterpretMultiplePrompts } from "@/lib/mock-interpreter";

export default function DashboardClient() {
    const [interpretations, setInterpretations] = useState<AIInterpretation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handlePromptSubmit = async (prompt: string) => {
        setIsLoading(true);

        try {
            // Try to use the API route first
            const response = await fetch("/api/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (response.ok) {
                const result = await response.json();
                // Handle both array and single object responses for backward compatibility
                const results = Array.isArray(result) ? result : [result];
                setInterpretations(results);
            } else {
                // Fallback to mock interpreter
                const mockResults = mockInterpretMultiplePrompts(prompt);
                setInterpretations(mockResults);
            }
        } catch {
            // Fallback to mock interpreter on error
            const mockResults = mockInterpretMultiplePrompts(prompt);
            setInterpretations(mockResults);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Prompt Input Section */}
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                    What would you like to see?
                </h2>
                <p className="text-gray-400 mb-6">
                    Enter a prompt to dynamically generate charts, tables, or summary cards based on your data.
                    You can request multiple datasets at once, e.g., &quot;show products and users&quot;.
                </p>
                <PromptInput onSubmit={handlePromptSubmit} />
            </div>

            {/* Results Section */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-400">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Interpreting your request...</span>
                    </div>
                </div>
            )}

            {interpretations.length > 0 && !isLoading && (
                <div className="space-y-8">
                    {interpretations.map((interpretation, index) => (
                        <div key={`${interpretation.datasetType}-${index}`} className="space-y-4">
                            {/* Interpretation Info */}
                            <div className="flex items-center gap-3 text-sm">
                                <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full border border-violet-500/30">
                                    {interpretation.componentType}
                                </span>
                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                                    {interpretation.datasetType}
                                </span>
                                {interpretation.chartType && (
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                        {interpretation.chartType} chart
                                    </span>
                                )}
                            </div>

                            {/* Dynamic Component */}
                            <DynamicRenderer interpretation={interpretation} />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {interpretations.length === 0 && !isLoading && (
                <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-2xl">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Ready to Generate
                    </h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Enter a prompt above to dynamically generate visualizations. Try something like
                        &quot;Show sales chart&quot;, &quot;List active users&quot;, or &quot;show products and users&quot;.
                    </p>
                </div>
            )}
        </div>
    );
}

