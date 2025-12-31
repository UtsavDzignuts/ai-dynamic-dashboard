"use client";

import { useState, useTransition } from "react";

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
}

const examplePrompts = [
    "Show sales summary chart",
    "List active users",
    "Show product inventory table",
    "Display revenue trend line chart",
    "Show user overview cards",
];

export default function PromptInput({ onSubmit }: PromptInputProps) {
    const [prompt, setPrompt] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            startTransition(() => {
                onSubmit(prompt.trim());
            });
        }
    };

    const handleExampleClick = (example: string) => {
        setPrompt(example);
        startTransition(() => {
            onSubmit(example);
        });
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt (e.g., 'Show sales chart' or 'List users')"
                        className="w-full px-6 py-4 bg-gray-900/80 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 pr-28"
                        disabled={isPending}
                    />
                    <button
                        type="submit"
                        disabled={isPending || !prompt.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Loading
                            </span>
                        ) : (
                            "Generate"
                        )}
                    </button>
                </div>
            </form>

            {/* Example prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-gray-500 text-sm">Try:</span>
                {examplePrompts.map((example) => (
                    <button
                        key={example}
                        onClick={() => handleExampleClick(example)}
                        disabled={isPending}
                        className="px-3 py-1 text-sm bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-full text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {example}
                    </button>
                ))}
            </div>
        </div>
    );
}
