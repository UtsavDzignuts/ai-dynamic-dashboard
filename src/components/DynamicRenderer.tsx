"use client";

import { useEffect, useState } from "react";
import { AIInterpretation } from "@/lib/ai-interpreter";
import {
    SalesData,
    UserData,
    ProductData,
    calculateSalesSummary,
    calculateUsersSummary,
    calculateProductsSummary,
} from "@/lib/data";
import DynamicChart from "./DynamicChart";
import DataTable, { StatusBadge } from "./DataTable";
import InfoCard, { CardGrid } from "./InfoCard";
import { LoadingChart, LoadingTable, LoadingCardGrid } from "./loading/Skeletons";

// Icons for cards
const DollarIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const BoxIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const TrendUpIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

interface DynamicRendererProps {
    interpretation: AIInterpretation;
}

// Sales Chart Component
function SalesChartView({ chartType, data }: { chartType: "bar" | "line" | "area"; data: SalesData[] }) {
    return (
        <DynamicChart
            data={data}
            chartType={chartType}
            xKey="month"
            yKeys={["revenue", "profit"]}
            title="Sales Performance"
            description="Monthly revenue and profit trends"
        />
    );
}

// Users Chart Component
function UsersChartView({ chartType, data }: { chartType: "bar" | "line" | "area"; data: UserData[] }) {
    const chartData = data.map((user) => ({
        name: user.name.split(" ")[0],
        sessions: user.sessionsThisMonth,
    }));
    return (
        <DynamicChart
            data={chartData}
            chartType={chartType}
            xKey="name"
            yKeys={["sessions"]}
            colors={["#06b6d4"]}
            title="User Activity"
            description="Sessions per user this month"
        />
    );
}

// Products Chart Component
function ProductsChartView({ chartType, data }: { chartType: "bar" | "line" | "area"; data: ProductData[] }) {
    const chartData = data.map((product) => ({
        name: product.name.split(" ")[0],
        sold: product.totalSold,
        stock: product.stock,
    }));
    return (
        <DynamicChart
            data={chartData}
            chartType={chartType}
            xKey="name"
            yKeys={["sold", "stock"]}
            colors={["#10b981", "#f59e0b"]}
            title="Product Performance"
            description="Units sold vs current stock"
        />
    );
}

// Sales Table Component
function SalesTableView({ data }: { data: SalesData[] }) {
    const columns = [
        { key: "month", label: "Month" },
        { key: "revenue", label: "Revenue", format: (v: number) => `$${v.toLocaleString()}` },
        { key: "unitsSold", label: "Units Sold", format: (v: number) => v.toLocaleString() },
        { key: "profit", label: "Profit", format: (v: number) => `$${v.toLocaleString()}` },
        { key: "category", label: "Category" },
    ];
    return <DataTable data={data} columns={columns} title="Sales Data" description="Detailed sales breakdown by month" />;
}

// Users Table Component
function UsersTableView({ data }: { data: UserData[] }) {
    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status", format: (v: string) => <StatusBadge status={v as "active" | "inactive" | "pending"} /> },
        { key: "sessionsThisMonth", label: "Sessions" },
    ];
    return <DataTable data={data} columns={columns} title="User Directory" description="Complete user directory with status" />;
}

// Products Table Component
function ProductsTableView({ data }: { data: ProductData[] }) {
    const columns = [
        { key: "name", label: "Product" },
        { key: "category", label: "Category" },
        { key: "price", label: "Price", format: (v: number) => `$${v.toFixed(2)}` },
        { key: "stock", label: "Stock" },
        { key: "status", label: "Status", format: (v: string) => <StatusBadge status={v as "in_stock" | "low_stock" | "out_of_stock"} /> },
        { key: "rating", label: "Rating", format: (v: number) => `⭐ ${v}` },
    ];
    return <DataTable data={data} columns={columns} title="Product Inventory" description="Full product catalog with stock levels" />;
}

// Sales Cards Component
function SalesCardsView({ data }: { data: SalesData[] }) {
    const summary = calculateSalesSummary(data);
    return (
        <CardGrid>
            <InfoCard
                title="Total Revenue"
                value={`$${summary.totalRevenue.toLocaleString()}`}
                change={{ value: 12.5, label: "vs last year" }}
                icon={<DollarIcon />}
                variant="success"
            />
            <InfoCard
                title="Units Sold"
                value={summary.totalUnits.toLocaleString()}
                change={{ value: 8.2, label: "vs last year" }}
                icon={<BoxIcon />}
            />
            <InfoCard
                title="Total Profit"
                value={`$${summary.totalProfit.toLocaleString()}`}
                change={{ value: 15.3, label: "vs last year" }}
                icon={<TrendUpIcon />}
                variant="success"
            />
            <InfoCard
                title="Profit Margin"
                value={`${summary.profitMargin}%`}
                change={{ value: 2.1, label: "vs last year" }}
                icon={<DollarIcon />}
            />
        </CardGrid>
    );
}

// Users Cards Component
function UsersCardsView({ data }: { data: UserData[] }) {
    const summary = calculateUsersSummary(data);
    return (
        <CardGrid>
            <InfoCard
                title="Total Users"
                value={summary.totalUsers}
                icon={<UsersIcon />}
            />
            <InfoCard
                title="Active Users"
                value={summary.activeUsers}
                change={{ value: 5.2, label: "this month" }}
                icon={<UsersIcon />}
                variant="success"
            />
            <InfoCard
                title="Inactive Users"
                value={summary.inactiveUsers}
                icon={<UsersIcon />}
                variant="warning"
            />
            <InfoCard
                title="Avg. Sessions"
                value={summary.avgSessionsPerUser}
                change={{ value: 12.8, label: "vs last month" }}
                icon={<TrendUpIcon />}
            />
        </CardGrid>
    );
}

// Products Cards Component
function ProductsCardsView({ data }: { data: ProductData[] }) {
    const summary = calculateProductsSummary(data);
    return (
        <CardGrid>
            <InfoCard
                title="Total Products"
                value={summary.totalProducts}
                icon={<BoxIcon />}
            />
            <InfoCard
                title="In Stock"
                value={summary.inStock}
                icon={<BoxIcon />}
                variant="success"
            />
            <InfoCard
                title="Low Stock"
                value={summary.lowStock}
                icon={<BoxIcon />}
                variant="warning"
            />
            <InfoCard
                title="Out of Stock"
                value={summary.outOfStock}
                icon={<BoxIcon />}
                variant="danger"
            />
        </CardGrid>
    );
}

// Main Dynamic Renderer - Client Component with data fetching
export default function DynamicRenderer({ interpretation }: DynamicRendererProps) {
    const { componentType, datasetType, chartType = "bar", filters, sort, limit } = interpretation;
    const [data, setData] = useState<SalesData[] | UserData[] | ProductData[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Build URL with query parameters
                const params = new URLSearchParams({ type: datasetType });

                if (filters && filters.length > 0) {
                    params.set("filters", JSON.stringify(filters));
                }
                if (sort) {
                    params.set("sort", JSON.stringify(sort));
                }
                if (limit) {
                    params.set("limit", String(limit));
                }

                const response = await fetch(`/api/data?${params.toString()}`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [datasetType, filters, sort, limit]);

    // Loading state
    if (loading || !data) {
        if (componentType === "chart") return <LoadingChart />;
        if (componentType === "table") return <LoadingTable />;
        if (componentType === "card") return <LoadingCardGrid />;
        return null;
    }

    // Render chart
    if (componentType === "chart") {
        switch (datasetType) {
            case "sales":
                return <SalesChartView chartType={chartType} data={data as SalesData[]} />;
            case "users":
                return <UsersChartView chartType={chartType} data={data as UserData[]} />;
            case "products":
                return <ProductsChartView chartType={chartType} data={data as ProductData[]} />;
        }
    }

    // Render table
    if (componentType === "table") {
        switch (datasetType) {
            case "sales":
                return <SalesTableView data={data as SalesData[]} />;
            case "users":
                return <UsersTableView data={data as UserData[]} />;
            case "products":
                return <ProductsTableView data={data as ProductData[]} />;
        }
    }

    // Render cards
    if (componentType === "card") {
        switch (datasetType) {
            case "sales":
                return <SalesCardsView data={data as SalesData[]} />;
            case "users":
                return <UsersCardsView data={data as UserData[]} />;
            case "products":
                return <ProductsCardsView data={data as ProductData[]} />;
        }
    }

    return null;
}
