import React, { useState } from "react";
import { Layout } from "./components/layout/Layout";
import { KPISection } from "./components/kpi/KPISection";
import { FilterPanel } from "./components/filters/FilterPanel";
import { ExpenseBreakdownChart } from "./components/charts/ExpenseBreakdownChart";
import { MonthlyTrendChart } from "./components/charts/MonthlyTrendChart";
import { VehicleTypeChart } from "./components/charts/VehicleTypeChart";
import { DriverPerformanceChart } from "./components/charts/DriverPerformanceChart";
import { TopVehiclesChart } from "./components/charts/TopVehiclesChart";
import { VendorExpenseChart } from "./components/charts/VendorExpenseChart";
import { DataTable } from "./components/table/DataTable";
import { LoadingSkeleton } from "./components/layout/LoadingStates";

import { useFleetData } from "./hooks/useFleetData";
import { useFilters } from "./hooks/useFilters";

// ---------------- Banner ----------------
function DemoBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-sm">
      <span className="text-amber-500 mt-0.5 flex-shrink-0">ℹ️</span>
      <div>
        <p className="font-medium text-amber-800">Running with demo data</p>
        <p className="text-amber-700 text-xs mt-0.5">
          Connect Google Sheet in <code>src/config.js</code>
        </p>
      </div>
    </div>
  );
}

// ---------------- Views ----------------
function DashboardView({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyTrendChart data={data} />
        <ExpenseBreakdownChart data={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <VehicleTypeChart data={data} />
        <div className="lg:col-span-2">
          <DriverPerformanceChart data={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopVehiclesChart data={data} />
        <VendorExpenseChart data={data} />
      </div>
    </div>
  );
}

function AnalyticsView({ data }) {
  return (
    <div className="space-y-4">
      <ExpenseBreakdownChart data={data} />
      <MonthlyTrendChart data={data} />
    </div>
  );
}

function VehiclesView({ data }) {
  return (
    <div className="space-y-4">
      <VehicleTypeChart data={data} />
      <TopVehiclesChart data={data} />
    </div>
  );
}

// ---------------- APP ----------------
export default function App() {
  const { data, loading, error, lastUpdated, isDemo, refetch } = useFleetData();

  // ✅ SAFE DATA
  const safeData = Array.isArray(data) ? data : [];

  const {
    filters,
    filterOptions,
    filteredData,
    setFilter,
    resetFilters,
    activeFilterCount
  } = useFilters(safeData);

  const [activeSection, setActiveSection] = useState("dashboard");

  if (loading) return <LoadingSkeleton />;

  return (
    <Layout
      lastUpdated={lastUpdated}
      isDemo={isDemo}
      onRefresh={refetch}
      loading={loading}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div className="space-y-5">
        {isDemo && <DemoBanner />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <KPISection data={filteredData} loading={loading} />

        <FilterPanel
          filters={filters}
          filterOptions={filterOptions}
          setFilter={setFilter}
          resetFilters={resetFilters}
          activeFilterCount={activeFilterCount}
          loading={loading}
        />

        {activeSection === "dashboard" && <DashboardView data={filteredData} />}
        {activeSection === "analytics" && <AnalyticsView data={filteredData} />}
        {activeSection === "vehicles" && <VehiclesView data={filteredData} />}
        {activeSection === "data-table" && <DataTable data={filteredData} />}
      </div>
    </Layout>
  );
}