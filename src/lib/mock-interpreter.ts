// Component types for AI interpretation
export type ComponentType = "chart" | "table" | "card";
export type DatasetType = "sales" | "users" | "products";
export type ChartType = "bar" | "line" | "area";
export type FilterOperator =
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "eq"
  | "neq"
  | "contains";

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string | number;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface AIInterpretation {
  componentType: ComponentType;
  datasetType: DatasetType;
  chartType?: ChartType;
  filters?: Filter[];
  sort?: SortConfig;
  limit?: number;
  title: string;
  description: string;
}

// Field name mappings (user-friendly terms to actual field names)
const fieldMappings: Record<string, { field: string; dataset: DatasetType }> = {
  // Sales fields
  "units sold": { field: "unitsSold", dataset: "sales" },
  unitssold: { field: "unitsSold", dataset: "sales" },
  units: { field: "unitsSold", dataset: "sales" },
  sold: { field: "unitsSold", dataset: "sales" },
  revenue: { field: "revenue", dataset: "sales" },
  profit: { field: "profit", dataset: "sales" },
  month: { field: "month", dataset: "sales" },

  // User fields
  sessions: { field: "sessionsThisMonth", dataset: "users" },
  session: { field: "sessionsThisMonth", dataset: "users" },
  role: { field: "role", dataset: "users" },
  status: { field: "status", dataset: "users" },
  name: { field: "name", dataset: "users" },
  email: { field: "email", dataset: "users" },

  // Product fields
  price: { field: "price", dataset: "products" },
  stock: { field: "stock", dataset: "products" },
  rating: { field: "rating", dataset: "products" },
  totalsold: { field: "totalSold", dataset: "products" },
  "total sold": { field: "totalSold", dataset: "products" },
  category: { field: "category", dataset: "products" },
};

// Keywords for dataset detection
const datasetKeywords: Record<string, DatasetType> = {
  sales: "sales",
  revenue: "sales",
  profit: "sales",
  income: "sales",
  earnings: "sales",
  monthly: "sales",

  users: "users",
  user: "users",
  members: "users",
  people: "users",
  accounts: "users",

  products: "products",
  product: "products",
  inventory: "products",
  items: "products",
};

// Keywords for component type detection
const componentKeywords: Record<string, ComponentType> = {
  chart: "chart",
  graph: "chart",
  visualization: "chart",
  visualize: "chart",
  plot: "chart",

  table: "table",
  list: "table",
  show: "table",
  display: "table",

  card: "card",
  summary: "card",
  overview: "card",
  stats: "card",
  statistics: "card",
};

// Keywords for chart type detection
const chartKeywords: Record<string, ChartType> = {
  bar: "bar",
  column: "bar",
  line: "line",
  trend: "line",
  area: "area",
  filled: "area",
};

// Operator patterns for filter extraction
interface OperatorPattern {
  patterns: RegExp[];
  operator: FilterOperator;
}

const operatorPatterns: OperatorPattern[] = [
  // Greater than
  {
    patterns: [
      /above\s+(\d+(?:\.\d+)?)/i,
      /greater\s+than\s+(\d+(?:\.\d+)?)/i,
      /more\s+than\s+(\d+(?:\.\d+)?)/i,
      />\s*(\d+(?:\.\d+)?)/i,
      /over\s+(\d+(?:\.\d+)?)/i,
      /exceeds?\s+(\d+(?:\.\d+)?)/i,
    ],
    operator: "gt",
  },
  // Greater than or equal
  {
    patterns: [
      /at\s+least\s+(\d+(?:\.\d+)?)/i,
      />=\s*(\d+(?:\.\d+)?)/i,
      /minimum\s+(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s+or\s+more/i,
    ],
    operator: "gte",
  },
  // Less than
  {
    patterns: [
      /below\s+(\d+(?:\.\d+)?)/i,
      /less\s+than\s+(\d+(?:\.\d+)?)/i,
      /under\s+(\d+(?:\.\d+)?)/i,
      /<\s*(\d+(?:\.\d+)?)/i,
      /fewer\s+than\s+(\d+(?:\.\d+)?)/i,
    ],
    operator: "lt",
  },
  // Less than or equal
  {
    patterns: [
      /at\s+most\s+(\d+(?:\.\d+)?)/i,
      /<=\s*(\d+(?:\.\d+)?)/i,
      /maximum\s+(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s+or\s+less/i,
      /up\s+to\s+(\d+(?:\.\d+)?)/i,
    ],
    operator: "lte",
  },
  // Equals
  {
    patterns: [
      /equals?\s+(\d+(?:\.\d+)?)/i,
      /equal\s+to\s+(\d+(?:\.\d+)?)/i,
      /=\s*(\d+(?:\.\d+)?)/i,
      /exactly\s+(\d+(?:\.\d+)?)/i,
      /is\s+(\d+(?:\.\d+)?)/i,
    ],
    operator: "eq",
  },
];

// String value patterns for equality checks
const stringEqualityPatterns = [
  /(?:is|equals?|=)\s+["']?(\w+)["']?/i,
  /(?:with|where|having)\s+(\w+)\s+(?:status|role|category)/i,
  /(?:name|email|status|role|category)\s+(?:is|=|equals?)\s+["']?(\w+)["']?/i,
];

/**
 * Extract field name from text near a value pattern
 * Finds the CLOSEST field keyword to the value position
 */
function findFieldNearValue(
  prompt: string,
  valuePosition: number
): { field: string; dataset: DatasetType } | null {
  const beforeValue = prompt
    .substring(Math.max(0, valuePosition - 50), valuePosition)
    .toLowerCase();

  // Find the closest field keyword to the value position
  let closestMatch: { field: string; dataset: DatasetType } | null = null;
  let closestPosition = -1;

  for (const [keyword, mapping] of Object.entries(fieldMappings)) {
    const position = beforeValue.lastIndexOf(keyword);
    if (position !== -1 && position > closestPosition) {
      closestPosition = position;
      closestMatch = mapping;
    }
  }

  return closestMatch;
}

/**
 * Extract filters from natural language prompt
 */
function extractFilters(
  prompt: string,
  detectedDataset: DatasetType
): Filter[] {
  const filters: Filter[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Extract numeric filters
  for (const { patterns, operator } of operatorPatterns) {
    for (const pattern of patterns) {
      const match = lowerPrompt.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const matchIndex = match.index || 0;

        // Find the field this value relates to
        const fieldInfo = findFieldNearValue(lowerPrompt, matchIndex);
        if (fieldInfo) {
          filters.push({
            field: fieldInfo.field,
            operator,
            value,
          });
        }
      }
    }
  }

  // Extract string equality filters (for status, role, category)
  const stringFields = [
    "name",
    "email",
    "status",
    "role",
    "category",
    "price",
    "stock",
    "rating",
    "totalSold",
  ];
  for (const field of stringFields) {
    // Check for equality pattern: "field is value" or "field = value"
    const fieldPattern = new RegExp(
      `${field}\\s+(?:is|=|equals?)\\s+["']?(\\w+)["']?`,
      "i"
    );
    const match = lowerPrompt.match(fieldPattern);
    if (match) {
      filters.push({
        field,
        operator: "eq",
        value: match[1],
      });
    }

    // Check for contains pattern: "field contains value"
    const containsPattern = new RegExp(
      `${field}\\s+contains\\s+["']?(\\w+)["']?`,
      "i"
    );
    const containsMatch = lowerPrompt.match(containsPattern);
    if (containsMatch) {
      filters.push({
        field,
        operator: "contains",
        value: containsMatch[1],
      });
    }
  }

  // Check for "active" as a special keyword for users
  if (
    detectedDataset === "users" &&
    /\bactive\b/i.test(lowerPrompt) &&
    !filters.some((f) => f.field === "status")
  ) {
    // Only add if not just asking for component type
    if (!/active\s+(users?|members?|accounts?)/i.test(lowerPrompt)) {
      filters.push({
        field: "status",
        operator: "eq",
        value: "active",
      });
    }
  }

  // Check for "in stock", "out of stock", "low stock"
  if (detectedDataset === "products") {
    if (/\bin[\s-]?stock\b/i.test(lowerPrompt)) {
      filters.push({ field: "status", operator: "eq", value: "in_stock" });
    } else if (/\bout[\s-]?of[\s-]?stock\b/i.test(lowerPrompt)) {
      filters.push({ field: "status", operator: "eq", value: "out_of_stock" });
    } else if (/\blow[\s-]?stock\b/i.test(lowerPrompt)) {
      filters.push({ field: "status", operator: "eq", value: "low_stock" });
    }
  }

  return filters;
}

/**
 * Extract sort configuration from prompt
 */
function extractSort(prompt: string): SortConfig | undefined {
  const lowerPrompt = prompt.toLowerCase();

  // Check for sorting keywords
  const sortPatterns = [
    {
      pattern: /sort(?:ed)?\s+by\s+(\w+)\s*(asc|desc|ascending|descending)?/i,
      fieldGroup: 1,
      dirGroup: 2,
    },
    {
      pattern: /order(?:ed)?\s+by\s+(\w+)\s*(asc|desc|ascending|descending)?/i,
      fieldGroup: 1,
      dirGroup: 2,
    },
    { pattern: /highest\s+(\w+)/i, fieldGroup: 1, direction: "desc" as const },
    { pattern: /lowest\s+(\w+)/i, fieldGroup: 1, direction: "asc" as const },
    { pattern: /top\s+(\w+)/i, fieldGroup: 1, direction: "desc" as const },
    { pattern: /bottom\s+(\w+)/i, fieldGroup: 1, direction: "asc" as const },
  ];

  for (const { pattern, fieldGroup, dirGroup, direction } of sortPatterns) {
    const match = lowerPrompt.match(pattern);
    if (match) {
      const fieldName = match[fieldGroup];
      const mapping = fieldMappings[fieldName];
      const field = mapping?.field || fieldName;

      let sortDir: "asc" | "desc" = direction || "desc";
      if (dirGroup && match[dirGroup]) {
        const dir = match[dirGroup].toLowerCase();
        sortDir = dir.startsWith("asc") ? "asc" : "desc";
      }

      return { field, direction: sortDir };
    }
  }

  return undefined;
}

/**
 * Extract limit from prompt
 */
function extractLimit(prompt: string): number | undefined {
  const lowerPrompt = prompt.toLowerCase();

  const limitPatterns = [
    /top\s+(\d+)/i,
    /first\s+(\d+)/i,
    /(\d+)\s+(?:results?|items?|records?|rows?)/i,
    /limit\s+(\d+)/i,
    /show\s+(\d+)/i,
  ];

  for (const pattern of limitPatterns) {
    const match = lowerPrompt.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return undefined;
}

/**
 * Detect the dataset from the prompt
 */
function detectDataset(prompt: string): DatasetType {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);

  // First check for explicit dataset keywords
  for (const word of words) {
    if (datasetKeywords[word]) {
      return datasetKeywords[word];
    }
  }

  // Check for field mentions to infer dataset
  for (const [keyword, mapping] of Object.entries(fieldMappings)) {
    if (lowerPrompt.includes(keyword)) {
      return mapping.dataset;
    }
  }

  return "sales"; // default
}

/**
 * Detect component type from prompt
 */
function detectComponentType(prompt: string): ComponentType {
  const lowerPrompt = prompt.toLowerCase();

  // Priority 1: Check for explicit chart keywords
  const chartWords = [
    "chart",
    "graph",
    "visualization",
    "visualize",
    "plot",
    "trend",
  ];
  for (const word of chartWords) {
    if (lowerPrompt.includes(word)) {
      return "chart";
    }
  }

  // Priority 2: Check for card/summary keywords
  const cardWords = [
    "card",
    "cards",
    "summary",
    "overview",
    "stats",
    "statistics",
    "kpi",
    "metric",
  ];
  for (const word of cardWords) {
    if (lowerPrompt.includes(word)) {
      return "card";
    }
  }

  // Priority 3: Check for explicit table keywords
  const tableWords = ["table", "list", "rows", "records"];
  for (const word of tableWords) {
    if (lowerPrompt.includes(word)) {
      return "table";
    }
  }

  // Default based on context - if there are filters, show as table
  if (
    /filter|where|condition|above|below|greater|less|equals?/i.test(lowerPrompt)
  ) {
    return "table";
  }

  // Default to chart for general data requests
  return "chart";
}

/**
 * Detect chart type from prompt
 */
function detectChartType(prompt: string): ChartType {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);

  for (const word of words) {
    if (chartKeywords[word]) {
      return chartKeywords[word];
    }
  }

  return "bar"; // default
}

/**
 * Generate a dynamic title based on interpretation
 */
function generateTitle(interpretation: Partial<AIInterpretation>): string {
  const { datasetType, componentType, filters, sort, limit } = interpretation;

  let title = "";

  // Add limit if present
  if (limit) {
    title += `Top ${limit} `;
  }

  // Add dataset name
  const datasetNames: Record<DatasetType, string> = {
    sales: "Sales",
    users: "Users",
    products: "Products",
  };
  title += datasetNames[datasetType || "sales"];

  // Add filter description
  if (filters && filters.length > 0) {
    title += " (Filtered)";
  }

  // Add component type
  const componentNames: Record<ComponentType, string> = {
    chart: "Chart",
    table: "Data",
    card: "Summary",
  };
  title += ` ${componentNames[componentType || "table"]}`;

  return title;
}

/**
 * Generate a dynamic description based on interpretation
 */
function generateDescription(
  interpretation: Partial<AIInterpretation>
): string {
  const { filters, sort, limit } = interpretation;
  const parts: string[] = [];

  if (filters && filters.length > 0) {
    const filterDescs = filters.map((f) => {
      const opNames: Record<FilterOperator, string> = {
        gt: ">",
        gte: ">=",
        lt: "<",
        lte: "<=",
        eq: "=",
        neq: "!=",
        contains: "contains",
      };
      return `${f.field} ${opNames[f.operator]} ${f.value}`;
    });
    parts.push(`Filtered: ${filterDescs.join(", ")}`);
  }

  if (sort) {
    parts.push(`Sorted by ${sort.field} (${sort.direction})`);
  }

  if (limit) {
    parts.push(`Showing top ${limit} results`);
  }

  return parts.length > 0 ? parts.join(" • ") : "All available data";
}

/**
 * Smart AI interpreter that understands data schema and generates dynamic queries
 */
export function mockInterpretPrompt(prompt: string): AIInterpretation {
  // Detect dataset
  const datasetType = detectDataset(prompt);

  // Detect component type
  const componentType = detectComponentType(prompt);

  // Detect chart type if component is chart
  const chartType =
    componentType === "chart" ? detectChartType(prompt) : undefined;

  // Extract filters
  const filters = extractFilters(prompt, datasetType);

  // Extract sort
  const sort = extractSort(prompt);

  // Extract limit
  const limit = extractLimit(prompt);

  // Build interpretation
  const interpretation: AIInterpretation = {
    componentType,
    datasetType,
    chartType,
    filters: filters.length > 0 ? filters : undefined,
    sort,
    limit,
    title: "",
    description: "",
  };

  // Generate dynamic title and description
  interpretation.title = generateTitle(interpretation);
  interpretation.description = generateDescription(interpretation);

  return interpretation;
}

/**
 * Detect ALL datasets mentioned in the prompt
 * Returns unique array of dataset types
 */
export function detectAllDatasets(prompt: string): DatasetType[] {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);
  const foundDatasets = new Set<DatasetType>();

  // Check for explicit dataset keywords
  for (const word of words) {
    if (datasetKeywords[word]) {
      foundDatasets.add(datasetKeywords[word]);
    }
  }

  // If no explicit datasets found, check for field mentions
  if (foundDatasets.size === 0) {
    for (const [keyword, mapping] of Object.entries(fieldMappings)) {
      if (lowerPrompt.includes(keyword)) {
        foundDatasets.add(mapping.dataset);
      }
    }
  }

  // Default to sales if nothing found
  if (foundDatasets.size === 0) {
    foundDatasets.add("sales");
  }

  return Array.from(foundDatasets);
}

/**
 * Multi-dataset AI interpreter that returns an interpretation for EACH dataset mentioned
 * Use this for prompts like "show products list and users list"
 */
export function mockInterpretMultiplePrompts(
  prompt: string
): AIInterpretation[] {
  const datasets = detectAllDatasets(prompt);

  // Detect shared settings (component type, chart type, sort, limit)
  const componentType = detectComponentType(prompt);
  const chartType =
    componentType === "chart" ? detectChartType(prompt) : undefined;
  const sort = extractSort(prompt);
  const limit = extractLimit(prompt);

  // Create an interpretation for each dataset
  return datasets.map((datasetType) => {
    // Extract dataset-specific filters
    const filters = extractFilters(prompt, datasetType);

    const interpretation: AIInterpretation = {
      componentType,
      datasetType,
      chartType,
      filters: filters.length > 0 ? filters : undefined,
      sort,
      limit,
      title: "",
      description: "",
    };

    // Generate dynamic title and description
    interpretation.title = generateTitle(interpretation);
    interpretation.description = generateDescription(interpretation);

    return interpretation;
  });
}
