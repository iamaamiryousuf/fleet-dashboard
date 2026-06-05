// ─── Number Formatting ───────────────────────────────────────────────────────

export function formatCurrency(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return formatNumber(value);
}

export function formatCurrencyCompact(value) {
  if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(1)}K`;
  return formatCurrency(value);
}

// ─── Data Aggregation ────────────────────────────────────────────────────────

export function computeKPIs(data) {
  const sum = (field) => data.reduce((acc, r) => acc + (r[field] || 0), 0);
  const uniqueSet = (field) => new Set(data.map((r) => r[field]).filter(Boolean));

  return {
    totalAmount: sum("monthlyBilling"),
    totalFixedSalary: sum("fixedSalary"),
    totalFuelCost: sum("fuelCost"),
    totalOT: sum("otAmount"),
    totalOutOfCity: sum("outOfCityAmount"),
    totalKM: sum("km"),
    totalVehicles: uniqueSet("vehicleNumber").size,
    totalDrivers: uniqueSet("driverName").size,
    totalCost: sum("totalCost"),
  };
}

export function groupBy(data, field) {
  return data.reduce((acc, row) => {
    const key = row[field] || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}

export function aggregateByField(data, groupField, valueFields) {
  const groups = groupBy(data, groupField);
  return Object.entries(groups).map(([key, rows]) => {
    const result = { name: key };
    valueFields.forEach((f) => {
      result[f] = rows.reduce((acc, r) => acc + (r[f] || 0), 0);
    });
    return result;
  });
}

// Month order for sorting
const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function sortByMonth(arr, monthField = "name") {
  return [...arr].sort((a, b) => {
    const ai = MONTH_ORDER.findIndex((m) =>
      a[monthField]?.toString().startsWith(m)
    );
    const bi = MONTH_ORDER.findIndex((m) =>
      b[monthField]?.toString().startsWith(m)
    );
    if (ai === -1 && bi === -1) return a[monthField] < b[monthField] ? -1 : 1;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

// ─── Export Helpers ───────────────────────────────────────────────────────────

export function exportToCSV(data, filename = "fleet-export.csv") {
  if (!data.length) return;

  const headers = Object.keys(data[0]).filter((k) => !k.startsWith("_"));
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? "";
          // Escape commas and quotes
          const str = String(val).replace(/"/g, '""');
          return /[",\n]/.test(str) ? `"${str}"` : str;
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function exportToExcel(data, filename = "fleet-export.xlsx") {
  // Dynamic import to keep bundle smaller
  import("xlsx").then((XLSX) => {
    const exportData = data.map((r) => {
      const obj = {};
      Object.keys(r)
        .filter((k) => !k.startsWith("_"))
        .forEach((k) => (obj[k] = r[k]));
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fleet Data");
    XLSX.writeFile(wb, filename);
  });
}

// ─── Color Palette ────────────────────────────────────────────────────────────

export const CHART_COLORS = {
  primary: "#2563eb",
  secondary: "#0ea5e9",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  teal: "#14b8a6",
  orange: "#f97316",
  indigo: "#6366f1",
};

export const CHART_PALETTE = [
  "#2563eb", "#0ea5e9", "#10b981", "#f59e0b",
  "#8b5cf6", "#ef4444", "#f97316", "#14b8a6",
  "#ec4899", "#6366f1",
];
