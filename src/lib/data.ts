// Type definitions for our data
export interface SalesData {
  month: string;
  revenue: number;
  unitsSold: number;
  profit: number;
  category: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "inactive" | "pending";
  lastActive: string;
  sessionsThisMonth: number;
  joinedDate: string;
}

export interface ProductData {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  rating: number;
  totalSold: number;
}

// Data fetching functions (simulating server-side data access)
import salesData from "@/data/sales.json";
import usersData from "@/data/users.json";
import productsData from "@/data/products.json";

export async function getSalesData(): Promise<SalesData[]> {
  // Simulate network delay for realistic loading states
  await new Promise((resolve) => setTimeout(resolve, 500));
  return salesData as SalesData[];
}

export async function getUsersData(): Promise<UserData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return usersData as UserData[];
}

export async function getProductsData(): Promise<ProductData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return productsData as ProductData[];
}

// Summary calculations
export function calculateSalesSummary(data: SalesData[]) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalUnits = data.reduce((sum, item) => sum + item.unitsSold, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  const avgMonthlyRevenue = totalRevenue / data.length;

  return {
    totalRevenue,
    totalUnits,
    totalProfit,
    avgMonthlyRevenue,
    profitMargin: ((totalProfit / totalRevenue) * 100).toFixed(1),
  };
}

export function calculateUsersSummary(data: UserData[]) {
  const activeUsers = data.filter((u) => u.status === "active").length;
  const totalSessions = data.reduce((sum, u) => sum + u.sessionsThisMonth, 0);

  return {
    totalUsers: data.length,
    activeUsers,
    inactiveUsers: data.filter((u) => u.status === "inactive").length,
    pendingUsers: data.filter((u) => u.status === "pending").length,
    avgSessionsPerUser: (totalSessions / data.length).toFixed(1),
  };
}

export function calculateProductsSummary(data: ProductData[]) {
  const totalValue = data.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalSold = data.reduce((sum, p) => sum + p.totalSold, 0);

  return {
    totalProducts: data.length,
    inStock: data.filter((p) => p.status === "in_stock").length,
    lowStock: data.filter((p) => p.status === "low_stock").length,
    outOfStock: data.filter((p) => p.status === "out_of_stock").length,
    totalInventoryValue: totalValue,
    totalUnitsSold: totalSold,
  };
}
