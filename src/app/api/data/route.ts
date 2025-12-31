import { NextRequest, NextResponse } from "next/server";
import { Filter, SortConfig } from "@/lib/mock-interpreter";

// Import data directly from JSON files
import salesData from "@/data/sales.json";
import usersData from "@/data/users.json";
import productsData from "@/data/products.json";

// Apply a single filter to a data item
function applyFilter(item: Record<string, unknown>, filter: Filter): boolean {
  const fieldValue = item[filter.field];

  if (fieldValue === undefined) {
    return true; // Skip filter if field doesn't exist
  }

  // Handle numeric comparisons
  if (typeof filter.value === "number" || !isNaN(Number(filter.value))) {
    const numericValue =
      typeof fieldValue === "number"
        ? fieldValue
        : parseFloat(String(fieldValue));
    const filterValue =
      typeof filter.value === "number"
        ? filter.value
        : parseFloat(String(filter.value));

    if (isNaN(numericValue)) {
      return true; // Skip if field is not numeric
    }

    switch (filter.operator) {
      case "gt":
        return numericValue > filterValue;
      case "gte":
        return numericValue >= filterValue;
      case "lt":
        return numericValue < filterValue;
      case "lte":
        return numericValue <= filterValue;
      case "eq":
        return numericValue === filterValue;
      case "neq":
        return numericValue !== filterValue;
      default:
        return true;
    }
  }

  // Handle string comparisons
  const stringValue = String(fieldValue).toLowerCase();
  const filterStringValue = String(filter.value).toLowerCase();

  switch (filter.operator) {
    case "eq":
      return stringValue === filterStringValue;
    case "neq":
      return stringValue !== filterStringValue;
    case "contains":
      return stringValue.includes(filterStringValue);
    default:
      return true;
  }
}

// Apply multiple filters to data array
function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: Filter[]
): T[] {
  if (!filters || filters.length === 0) {
    return data;
  }

  return data.filter((item) =>
    filters.every((filter) => applyFilter(item, filter))
  );
}

// Apply sorting to data array
function applySort<T extends Record<string, unknown>>(
  data: T[],
  sort: SortConfig
): T[] {
  if (!sort || !sort.field) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];

    // Handle null/undefined
    if (aVal === undefined || aVal === null)
      return sort.direction === "asc" ? 1 : -1;
    if (bVal === undefined || bVal === null)
      return sort.direction === "asc" ? -1 : 1;

    // Numeric comparison
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    // String comparison
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const comparison = aStr.localeCompare(bStr);
    return sort.direction === "asc" ? comparison : -comparison;
  });
}

// Apply limit to data array
function applyLimit<T>(data: T[], limit: number | undefined): T[] {
  if (!limit || limit <= 0) {
    return data;
  }
  return data.slice(0, limit);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const filtersParam = searchParams.get("filters");
  const sortParam = searchParams.get("sort");
  const limitParam = searchParams.get("limit");

  // Parse filters if provided
  let filters: Filter[] = [];
  if (filtersParam) {
    try {
      filters = JSON.parse(filtersParam) as Filter[];
    } catch (e) {
      console.error("Failed to parse filters:", e);
    }
  }

  // Parse sort if provided
  let sort: SortConfig | undefined;
  if (sortParam) {
    try {
      sort = JSON.parse(sortParam) as SortConfig;
    } catch (e) {
      console.error("Failed to parse sort:", e);
    }
  }

  // Parse limit if provided
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  // Simulate network delay for realistic loading
  await new Promise((resolve) => setTimeout(resolve, 300));

  let data: Record<string, unknown>[];

  switch (type) {
    case "sales":
      data = salesData as unknown as Record<string, unknown>[];
      break;
    case "users":
      data = usersData as unknown as Record<string, unknown>[];
      break;
    case "products":
      data = productsData as unknown as Record<string, unknown>[];
      break;
    default:
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
  }

  // Apply filters
  data = applyFilters(data, filters);

  // Apply sorting
  if (sort) {
    data = applySort(data, sort);
  }

  // Apply limit
  if (limit) {
    data = applyLimit(data, limit);
  }

  return NextResponse.json(data);
}
