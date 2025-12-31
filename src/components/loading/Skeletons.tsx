export function LoadingChart() {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-6" />
            <div className="h-80 bg-gray-800 rounded flex items-end justify-around p-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-6 bg-gray-700 rounded-t"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

export function LoadingTable() {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-6" />
            <div className="space-y-3">
                <div className="flex gap-4 py-3 border-b border-gray-700">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-700 rounded flex-1" />
                    ))}
                </div>
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-4 py-3 border-b border-gray-800">
                        {Array.from({ length: 5 }).map((_, colIndex) => (
                            <div key={colIndex} className="h-4 bg-gray-800 rounded flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-6 shadow-xl animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-800 rounded w-1/3" />
                </div>
                <div className="w-12 h-12 bg-gray-700 rounded-lg" />
            </div>
        </div>
    );
}

export function LoadingCardGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
            ))}
        </div>
    );
}
