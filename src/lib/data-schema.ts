// Data schema definitions for AI to understand our data structure
export interface DataSchema {
  name: string;
  description: string;
  fields: FieldSchema[];
  sampleValues?: Record<string, unknown>;
}

export interface FieldSchema {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  description: string;
  possibleValues?: string[]; // For enum-like fields
}

// Sales data schema
export const salesSchema: DataSchema = {
  name: "sales",
  description:
    "Monthly sales data with revenue, units sold, and profit information",
  fields: [
    {
      name: "month",
      type: "string",
      description: "Month name (Jan, Feb, Mar, etc.)",
      possibleValues: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    {
      name: "revenue",
      type: "number",
      description: "Total revenue in dollars",
    },
    { name: "unitsSold", type: "number", description: "Number of units sold" },
    { name: "profit", type: "number", description: "Profit amount in dollars" },
    { name: "category", type: "string", description: "Product category" },
  ],
  sampleValues: {
    month: "Jan",
    revenue: 45000,
    unitsSold: 320,
    profit: 12500,
    category: "Electronics",
  },
};

// Users data schema
export const usersSchema: DataSchema = {
  name: "users",
  description: "User directory with activity status and engagement metrics",
  fields: [
    { name: "id", type: "number", description: "User ID" },
    { name: "name", type: "string", description: "Full name of the user" },
    { name: "email", type: "string", description: "Email address" },
    {
      name: "role",
      type: "string",
      description: "User role",
      possibleValues: ["Admin", "Editor", "Viewer"],
    },
    {
      name: "status",
      type: "string",
      description: "Account status",
      possibleValues: ["active", "inactive", "pending"],
    },
    {
      name: "lastActive",
      type: "date",
      description: "Last activity timestamp",
    },
    {
      name: "sessionsThisMonth",
      type: "number",
      description: "Number of sessions this month",
    },
    { name: "joinedDate", type: "date", description: "Date when user joined" },
  ],
  sampleValues: {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    sessionsThisMonth: 45,
  },
};

// Products data schema
export const productsSchema: DataSchema = {
  name: "products",
  description: "Product inventory with stock levels and pricing",
  fields: [
    { name: "id", type: "number", description: "Product ID" },
    { name: "name", type: "string", description: "Product name" },
    {
      name: "category",
      type: "string",
      description: "Product category",
      possibleValues: ["Electronics", "Accessories"],
    },
    { name: "price", type: "number", description: "Product price in dollars" },
    { name: "stock", type: "number", description: "Current stock quantity" },
    {
      name: "status",
      type: "string",
      description: "Stock status",
      possibleValues: ["in_stock", "low_stock", "out_of_stock"],
    },
    { name: "rating", type: "number", description: "Product rating (1-5)" },
    { name: "totalSold", type: "number", description: "Total units sold" },
  ],
  sampleValues: {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 245,
    status: "in_stock",
    rating: 4.7,
    totalSold: 1250,
  },
};

// Get all schemas
export const allSchemas: Record<string, DataSchema> = {
  sales: salesSchema,
  users: usersSchema,
  products: productsSchema,
};

// Generate schema description for AI prompt
export function generateSchemaPrompt(): string {
  let prompt = "Available datasets and their fields:\n\n";

  for (const [key, schema] of Object.entries(allSchemas)) {
    prompt += `## ${key.toUpperCase()} Dataset\n`;
    prompt += `Description: ${schema.description}\n`;
    prompt += `Fields:\n`;

    for (const field of schema.fields) {
      prompt += `  - ${field.name} (${field.type}): ${field.description}`;
      if (field.possibleValues) {
        prompt += ` [Values: ${field.possibleValues.join(", ")}]`;
      }
      prompt += "\n";
    }

    if (schema.sampleValues) {
      prompt += `Sample record: ${JSON.stringify(schema.sampleValues)}\n`;
    }
    prompt += "\n";
  }

  return prompt;
}
