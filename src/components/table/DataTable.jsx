import React, { useState, useMemo } from "react";
import {
  Search, Download, ChevronUp, ChevronDown,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  FileSpreadsheet, FileText
} from "lucide-react";
import { formatCurrency, formatNumber, exportToCSV, exportToExcel } from "../../utils/helpers";

const COLUMNS = [
  { key: "date",           label: "Date",        sortable: true },
  { key: "month",          label: "Month",       sortable: true },
  { key: "driverName",     label: "Driver",      sortable: true },
  { key: "vehicleNumber",  label: "Vehicle #",   sortable: true },
  { key: "vehicleType",    label: "Type",        sortable: true },
  { key: "vendor",         label: "Vendor",      sortable: true },
  { key: "fixedSalary",    label: "Fixed Salary",sortable: true, numeric: true, format: formatCurrency },
  { key: "fuelCost",       label: "Fuel Cost",   sortable: true, numeric: true, format: formatCurrency },
  { key: "otAmount",       label: "OT Amount",   sortable: true, numeric: true, format: formatCurrency },
  { key: "outOfCityAmount",label: "OOC Amount",  sortable: true, numeric: true, format: formatCurrency },
  { key: "km",             label: "KM",          sortable: true, numeric: true, format: (v) => formatNumber(v) },
  { key: "totalCost",      label: "Total Cost",  sortable: true, numeric: true, format: formatCurrency },
];

const PAGE_SIZES = [10, 25, 50, 100];

export function DataTable({ data }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Search filter
  const searched = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...searched].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const numA = typeof av === "number";
      const cmp = numA ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [searched, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col.key) return <ChevronUp className="w-3 h-3 text-slate-300" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-fleet-500" />
      : <ChevronDown className="w-3 h-3 text-fleet-500" />;
  };

  return (
    <div className="card flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-sm">Fleet Records</h3>
          <p className="text-xs text-slate-400 mt-0.5">{sorted.length} records found</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fleet-400 focus:border-transparent"
            />
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportToCSV(sorted, "fleet-data.csv")}
              className="btn-secondary py-1.5 px-3 text-xs"
              title="Export CSV"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => exportToExcel(sorted, "fleet-data.xlsx")}
              className="btn-secondary py-1.5 px-3 text-xs"
              title="Export Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`table-header ${col.numeric ? "text-right" : ""}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.numeric ? "justify-end" : ""}`}>
                    {col.label}
                    {col.sortable && <SortIcon col={col} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-12 text-slate-400 text-sm">
                  No records match your search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {COLUMNS.map((col) => (
                    <td key={col.key} className={`table-cell ${col.numeric ? "text-right font-mono text-xs" : ""}`}>
                      {col.format ? col.format(row[col.key]) : (row[col.key] || "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-fleet-400"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span>
            {Math.min((currentPage - 1) * pageSize + 1, sorted.length)}–
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {[
            { icon: ChevronsLeft, action: () => setPage(1),           disabled: currentPage === 1 },
            { icon: ChevronLeft,  action: () => setPage(p => p - 1),  disabled: currentPage === 1 },
            { icon: ChevronRight, action: () => setPage(p => p + 1),  disabled: currentPage === totalPages },
            { icon: ChevronsRight,action: () => setPage(totalPages),  disabled: currentPage === totalPages },
          ].map(({ icon: Icon, action, disabled }, i) => (
            <button
              key={i}
              onClick={action}
              disabled={disabled}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-2 hidden sm:block">
            Page {currentPage} / {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}
