# 🤖 AI-Driven Dynamic Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![LangChain](https://img.shields.io/badge/LangChain-1.2.3-green?style=for-the-badge)

**Transform natural language into beautiful, interactive data visualizations instantly.**

[Getting Started](#-getting-started) • [How It Works](#-how-it-works) • [Examples](#-usage-examples) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 What is This Project?

The **AI-Driven Dynamic Dashboard** is an intelligent web application that converts your plain English questions into dynamic charts, tables, and summary cards. Simply type what you want to see—like *"Show me a sales chart"* or *"List all active users"*—and the AI interprets your request and renders the appropriate visualization.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| � **AI-Powered Interpretation** | Uses Google Gemini AI via LangChain to understand natural language prompts |
| ⚡ **React Server Components** | Server-side rendering with streaming and Suspense for fast initial loads |
| 📊 **Dynamic Visualizations** | Bar, Line, and Area charts powered by Recharts |
| 📋 **Data Tables** | Sortable, filterable tables with status badges |
| 🎴 **Info Cards** | Summary cards displaying KPIs with change indicators |
| 🎨 **Modern Dark UI** | Glassmorphism design with smooth animations |
| 🔄 **Smart Fallback** | Works without an API key using intelligent keyword matching |

---

### The Flow Explained:

1. **User Input** → You type a natural language prompt like *"Show revenue trends"*
2. **AI Interpretation** → The prompt is sent to Google Gemini AI (via LangChain)
3. **Structured Response** → AI returns a JSON object specifying:
   - Component type (chart, table, or card)
   - Dataset to use (sales, users, or products)
   - Chart type (bar, line, or area)
   - Any filters to apply
4. **Server Rendering** → React Server Components fetch the data server-side
5. **Dynamic Rendering** → The appropriate component is rendered with the data

### AI Interpretation Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                        User Prompt                                  │
│              "Show me products with low stock levels"               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     LangChain + Gemini AI                           │
│  • Understands context and intent                                   │
│  • Maps to available datasets and components                        │
│  • Generates structured JSON output                                 │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Structured Output                               │
│  {                                                                  │
│    "componentType": "table",                                        │
│    "datasetType": "products",                                       │
│    "filters": [{ "field": "stock", "operator": "lt", "value": 50 }],│
│    "title": "Low Stock Products",                                   │
│    "description": "Products with stock levels below 50 units"       │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Rendered Component                              │
│  📋 A filterable table showing products where stock < 50            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💡 Usage Examples

Enter prompts in the input field to generate dynamic visualizations:

### 📊 Chart Examples

| Prompt | What You Get |
|--------|--------------|
| `"Show sales chart"` | Bar chart displaying monthly revenue, units sold, and profit |
| `"Display revenue trend as a line chart"` | Line chart showing revenue trends over time |
| `"Show profit area chart"` | Area chart with profit visualization |
| `"Compare monthly sales performance"` | Multi-series chart with sales metrics |

### 📋 Table Examples

| Prompt | What You Get |
|--------|--------------|
| `"List all users"` | Table with user details, roles, and activity status |
| `"Show active users"` | Filtered table showing only active users |
| `"Display product inventory"` | Products table with stock levels and ratings |
| `"Show products with low stock"` | Filtered table for products needing restocking |

### 🎴 Card/Summary Examples

| Prompt | What You Get |
|--------|--------------|
| `"Show sales summary"` | KPI cards with total revenue, units, and profit |
| `"Give me sales overview"` | Summary cards with key metrics |
| `"Show user statistics"` | Cards displaying user counts by status |

### 🔀 Multi-Component Examples

| Prompt | What You Get |
|--------|--------------|
| `"Show users and products tables"` | Both user directory and product inventory tables |
| `"Display sales chart and user list"` | Sales visualization alongside user table |

---

## 🛠 Tech Stack

### Core Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with App Router & Server Components | 16.1.1 |
| **React** | UI library with latest concurrent features | 19.2.3 |
| **TypeScript** | Type-safe JavaScript for better DX | 5.x |
| **TailwindCSS** | Utility-first CSS framework | 4.x |

### AI & Data Processing

| Technology | Purpose |
|-----------|---------|
| **LangChain** | AI orchestration and prompt management |
| **Google Gemini** | Large Language Model for prompt interpretation |
| **Zod** | Schema validation for AI responses |

### Visualization

| Technology | Purpose |
|-----------|---------|
| **Recharts** | Responsive charting library built on D3 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Google API Key** (optional - app works without it using mock interpreter)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```
   
   > 💡 **Note:** Get your API key from [Google AI Studio](https://aistudio.google.com/)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Filter Operators

The AI can apply filters to your data queries:

| Operator | Description | Example |
|----------|-------------|---------|
| `gt` | Greater than | `revenue > 50000` |
| `gte` | Greater than or equal | `stock >= 100` |
| `lt` | Less than | `stock < 50` |
| `lte` | Less than or equal | `price <= 100` |
| `eq` | Equals | `status = "Active"` |
| `contains` | String contains | `name contains "Pro"` |

---

## 🏗 Architecture Highlights

### React Server Components (RSC)
- **Server Components** handle data fetching in `DynamicRenderer.tsx`
- **Client Components** handle interactivity in `DashboardClient.tsx` and `PromptInput.tsx`
- **Suspense boundaries** with skeleton loaders enable streaming UI

### AI Integration Strategy
- **Primary:** LangChain with Google Gemini for natural language understanding
- **Fallback:** Keyword-based mock interpreter when no API key is provided
- **Validation:** Zod schemas ensure structured, type-safe AI responses

### Component Rendering
```typescript
// AI returns interpretation
{
  componentType: "chart",
  datasetType: "sales",
  chartType: "bar",
  title: "Sales Overview"
}

// DynamicRenderer maps to component
switch (interpretation.componentType) {
  case "chart": return <DynamicChart {...props} />
  case "table": return <DataTable {...props} />
  case "card":  return <InfoCard {...props} />
}
```

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run Jest tests
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

