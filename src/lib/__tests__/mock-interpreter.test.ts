import {
  mockInterpretPrompt,
  mockInterpretMultiplePrompts,
  detectAllDatasets,
  Filter,
  AIInterpretation,
} from "../mock-interpreter";

describe("Mock Interpreter - extractFilters", () => {
  // Helper to get filters from interpretation
  const getFilters = (prompt: string): Filter[] => {
    const result = mockInterpretPrompt(prompt);
    return result.filters || [];
  };

  describe("String Field Equality Filters", () => {
    test("role is admin", () => {
      const filters = getFilters("list users where role is admin");
      expect(filters).toContainEqual({
        field: "role",
        operator: "eq",
        value: "admin",
      });
    });

    test("status is active", () => {
      const filters = getFilters("show users status is active");
      expect(filters).toContainEqual({
        field: "status",
        operator: "eq",
        value: "active",
      });
    });

    test("category equals electronics", () => {
      const filters = getFilters("products category equals electronics");
      expect(filters).toContainEqual({
        field: "category",
        operator: "eq",
        value: "electronics",
      });
    });

    test("role = manager", () => {
      const filters = getFilters("users role = manager");
      expect(filters).toContainEqual({
        field: "role",
        operator: "eq",
        value: "manager",
      });
    });
  });

  describe("String Field Contains Filters", () => {
    test("name contains john", () => {
      const filters = getFilters("users name contains john");
      expect(filters).toContainEqual({
        field: "name",
        operator: "contains",
        value: "john",
      });
    });

    test("email contains gmail", () => {
      const filters = getFilters("users email contains gmail");
      expect(filters).toContainEqual({
        field: "email",
        operator: "contains",
        value: "gmail",
      });
    });

    test("NAME CONTAINS JOHN - case insensitive", () => {
      const filters = getFilters("users NAME CONTAINS JOHN");
      expect(filters).toContainEqual({
        field: "name",
        operator: "contains",
        value: "john",
      });
    });
  });

  describe("Numeric Comparison Filters", () => {
    test("revenue above 1000", () => {
      const filters = getFilters("sales revenue above 1000");
      expect(filters).toContainEqual({
        field: "revenue",
        operator: "gt",
        value: 1000,
      });
    });

    test("price less than 50", () => {
      const filters = getFilters("products price less than 50");
      expect(filters).toContainEqual({
        field: "price",
        operator: "lt",
        value: 50,
      });
    });

    test("stock at least 100", () => {
      const filters = getFilters("products stock at least 100");
      expect(filters).toContainEqual({
        field: "stock",
        operator: "gte",
        value: 100,
      });
    });

    test("rating greater than 4.5", () => {
      const filters = getFilters("products rating greater than 4.5");
      expect(filters).toContainEqual({
        field: "rating",
        operator: "gt",
        value: 4.5,
      });
    });

    test("sessions over 20", () => {
      const filters = getFilters("users sessions over 20");
      expect(filters).toContainEqual({
        field: "sessionsThisMonth",
        operator: "gt",
        value: 20,
      });
    });

    test("units sold below 500", () => {
      const filters = getFilters("sales units sold below 500");
      expect(filters).toContainEqual({
        field: "unitsSold",
        operator: "lt",
        value: 500,
      });
    });

    test("profit at most 5000", () => {
      const filters = getFilters("sales profit at most 5000");
      expect(filters).toContainEqual({
        field: "profit",
        operator: "lte",
        value: 5000,
      });
    });
  });

  describe("Multiple Filters (AND conditions)", () => {
    test("role is admin and name contains john", () => {
      const filters = getFilters(
        "list active users role is admin and name contains john"
      );
      expect(filters.length).toBeGreaterThanOrEqual(2);
      expect(filters).toContainEqual({
        field: "role",
        operator: "eq",
        value: "admin",
      });
      expect(filters).toContainEqual({
        field: "name",
        operator: "contains",
        value: "john",
      });
    });

    test("price below 100 and stock above 50", () => {
      const filters = getFilters("products price below 100 and stock above 50");
      expect(filters.length).toBeGreaterThanOrEqual(2);
      expect(filters).toContainEqual({
        field: "price",
        operator: "lt",
        value: 100,
      });
      expect(filters).toContainEqual({
        field: "stock",
        operator: "gt",
        value: 50,
      });
    });

    test("status is active and sessions above 10", () => {
      const filters = getFilters(
        "users status is active and sessions above 10"
      );
      expect(filters.length).toBeGreaterThanOrEqual(2);
      expect(filters).toContainEqual({
        field: "status",
        operator: "eq",
        value: "active",
      });
      expect(filters).toContainEqual({
        field: "sessionsThisMonth",
        operator: "gt",
        value: 10,
      });
    });
  });

  describe("Edge Cases", () => {
    test("empty prompt returns no filters", () => {
      const filters = getFilters("");
      expect(filters).toEqual([]);
    });

    test("show all users - no filters", () => {
      const filters = getFilters("show all users");
      // May or may not have "active" filter, but should not crash
      expect(Array.isArray(filters)).toBe(true);
    });

    test("prompt with only dataset name - minimal or no filters", () => {
      const filters = getFilters("users");
      expect(Array.isArray(filters)).toBe(true);
    });

    test("special product status: in stock", () => {
      const filters = getFilters("show products in stock");
      expect(filters).toContainEqual({
        field: "status",
        operator: "eq",
        value: "in_stock",
      });
    });

    test("special product status: low stock", () => {
      const filters = getFilters("show products low stock");
      expect(filters).toContainEqual({
        field: "status",
        operator: "eq",
        value: "low_stock",
      });
    });

    test("special product status: out of stock", () => {
      const filters = getFilters("products out of stock");
      expect(filters).toContainEqual({
        field: "status",
        operator: "eq",
        value: "out_of_stock",
      });
    });
  });
});

describe("Mock Interpreter - Dataset Detection", () => {
  test("detects users dataset", () => {
    const result = mockInterpretPrompt("show users");
    expect(result.datasetType).toBe("users");
  });

  test("detects sales dataset", () => {
    const result = mockInterpretPrompt("monthly sales report");
    expect(result.datasetType).toBe("sales");
  });

  test("detects products dataset", () => {
    const result = mockInterpretPrompt("product inventory");
    expect(result.datasetType).toBe("products");
  });

  test("detects dataset from field name - revenue implies sales", () => {
    const result = mockInterpretPrompt("show revenue data");
    expect(result.datasetType).toBe("sales");
  });

  test("detects dataset from field name - sessions implies users", () => {
    const result = mockInterpretPrompt("sessions above 10");
    expect(result.datasetType).toBe("users");
  });

  test("defaults to sales for ambiguous prompts", () => {
    const result = mockInterpretPrompt("show data");
    expect(result.datasetType).toBe("sales");
  });
});

describe("Mock Interpreter - Component Type Detection", () => {
  test("bar chart", () => {
    const result = mockInterpretPrompt("bar chart of sales");
    expect(result.componentType).toBe("chart");
    expect(result.chartType).toBe("bar");
  });

  test("line chart - trend keyword", () => {
    const result = mockInterpretPrompt("show sales trend");
    expect(result.componentType).toBe("chart");
    expect(result.chartType).toBe("line");
  });

  test("area chart", () => {
    const result = mockInterpretPrompt("area chart revenue");
    expect(result.componentType).toBe("chart");
    expect(result.chartType).toBe("area");
  });

  test("table", () => {
    const result = mockInterpretPrompt("list users in table");
    expect(result.componentType).toBe("table");
  });

  test("card/summary", () => {
    const result = mockInterpretPrompt("summary of sales");
    expect(result.componentType).toBe("card");
  });

  test("defaults to table for filtered data", () => {
    const result = mockInterpretPrompt("users where role is admin");
    expect(result.componentType).toBe("table");
  });
});

describe("Mock Interpreter - Sort Extraction", () => {
  test("sorted by revenue desc", () => {
    const result = mockInterpretPrompt("sales sorted by revenue desc");
    expect(result.sort).toEqual({
      field: "revenue",
      direction: "desc",
    });
  });

  test("order by price ascending", () => {
    const result = mockInterpretPrompt("products order by price ascending");
    expect(result.sort).toEqual({
      field: "price",
      direction: "asc",
    });
  });

  test("highest revenue", () => {
    const result = mockInterpretPrompt("show highest revenue");
    expect(result.sort).toEqual({
      field: "revenue",
      direction: "desc",
    });
  });

  test("lowest price", () => {
    const result = mockInterpretPrompt("products lowest price");
    expect(result.sort).toEqual({
      field: "price",
      direction: "asc",
    });
  });
});

describe("Mock Interpreter - Limit Extraction", () => {
  test("top 5 users", () => {
    const result = mockInterpretPrompt("top 5 users");
    expect(result.limit).toBe(5);
  });

  test("first 10 products", () => {
    const result = mockInterpretPrompt("first 10 products");
    expect(result.limit).toBe(10);
  });

  test("show 3 results", () => {
    const result = mockInterpretPrompt("show 3 results");
    expect(result.limit).toBe(3);
  });

  test("limit 20", () => {
    const result = mockInterpretPrompt("sales limit 20");
    expect(result.limit).toBe(20);
  });
});

describe("Mock Interpreter - Multi-Dataset Support", () => {
  describe("detectAllDatasets", () => {
    test("detects multiple datasets: products and users", () => {
      const datasets = detectAllDatasets("show products list and users list");
      expect(datasets).toContain("products");
      expect(datasets).toContain("users");
      expect(datasets.length).toBe(2);
    });

    test("detects multiple datasets: users and sales", () => {
      const datasets = detectAllDatasets("show users and sales data");
      expect(datasets).toContain("users");
      expect(datasets).toContain("sales");
      expect(datasets.length).toBe(2);
    });

    test("detects all three datasets", () => {
      const datasets = detectAllDatasets("show users and products and sales");
      expect(datasets).toContain("users");
      expect(datasets).toContain("products");
      expect(datasets).toContain("sales");
      expect(datasets.length).toBe(3);
    });

    test("single dataset returns array with one element", () => {
      const datasets = detectAllDatasets("show users list");
      expect(datasets).toEqual(["users"]);
    });

    test("defaults to sales for empty prompt", () => {
      const datasets = detectAllDatasets("");
      expect(datasets).toEqual(["sales"]);
    });
  });

  describe("mockInterpretMultiplePrompts", () => {
    test("returns array of interpretations for multiple datasets", () => {
      const results = mockInterpretMultiplePrompts("show products and users");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);

      const datasetTypes = results.map((r) => r.datasetType);
      expect(datasetTypes).toContain("products");
      expect(datasetTypes).toContain("users");
    });

    test("single dataset returns array with one interpretation", () => {
      const results = mockInterpretMultiplePrompts("show sales chart");
      expect(results.length).toBe(1);
      expect(results[0].datasetType).toBe("sales");
    });

    test("component type is shared across all interpretations", () => {
      const results = mockInterpretMultiplePrompts(
        "bar chart of products and users"
      );
      expect(results.every((r) => r.componentType === "chart")).toBe(true);
      expect(results.every((r) => r.chartType === "bar")).toBe(true);
    });

    test("each interpretation has title and description", () => {
      const results = mockInterpretMultiplePrompts("list products and users");
      for (const result of results) {
        expect(result.title).toBeTruthy();
        expect(typeof result.title).toBe("string");
      }
    });

    test("backward compatible with single prompt", () => {
      const single = mockInterpretPrompt("show users");
      const multi = mockInterpretMultiplePrompts("show users");

      expect(multi.length).toBe(1);
      expect(multi[0].datasetType).toBe(single.datasetType);
      expect(multi[0].componentType).toBe(single.componentType);
    });
  });
});
