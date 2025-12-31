/* eslint-disable @typescript-eslint/no-explicit-any */
interface Column {
    key: string;
    label: string;
    format?: (value: any) => React.ReactNode;
}

interface DataTableProps {
    data: any[];
    columns: Column[];
    title?: string;
    description?: string;
}

export default function DataTable({
    data,
    columns,
    title,
    description,
}: DataTableProps) {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl overflow-hidden">
            {title && (
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            )}
            {description && (
                <p className="text-gray-400 text-sm mb-6">{description}</p>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left py-3 px-4 text-gray-300 font-medium text-sm uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="py-3 px-4 text-gray-200 text-sm"
                                    >
                                        {column.format
                                            ? column.format(row[column.key])
                                            : String(row[column.key] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Status badge component
export function StatusBadge({
    status,
}: {
    status: "active" | "inactive" | "pending" | "in_stock" | "low_stock" | "out_of_stock";
}) {
    const statusStyles = {
        active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        in_stock: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        low_stock: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        out_of_stock: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const labels = {
        active: "Active",
        inactive: "Inactive",
        pending: "Pending",
        in_stock: "In Stock",
        low_stock: "Low Stock",
        out_of_stock: "Out of Stock",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}
        >
            {labels[status]}
        </span>
    );
}
