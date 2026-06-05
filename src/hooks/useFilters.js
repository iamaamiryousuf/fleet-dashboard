import { useState, useMemo } from "react";

export const INITIAL_FILTERS = {
  month: "All",
  driverName: "All",
  vehicleNumber: "All",
  vehicleType: "All",
  vendor: "All",
  project: "All",
  sites: "All",
};

export function useFilters(data = []) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // ✅ SAFE DATA HANDLING
  const safeData = Array.isArray(data) ? data : [];

  // Compute unique options for each filter field
  const filterOptions = useMemo(() => {
    const unique = (field) => {
      const vals = [
        ...new Set(
          safeData.map((r) => r?.[field]).filter(Boolean)
        ),
      ].sort();

      return ["All", ...vals];
    };

    return {
      month: unique("month"),
      driverName: unique("driverName"),
      vehicleNumber: unique("vehicleNumber"),
      vehicleType: unique("vehicleType"),
      vendor: unique("vendor"),
      project: unique("project"),
      sites: unique("sites"),
    };
  }, [safeData]);

  // Apply filters to raw data
  const filteredData = useMemo(() => {
    return safeData.filter((row) => {
      return Object.entries(filters).every(([key, val]) => {
        if (val === "All") return true;
        return row?.[key] === val;
      });
    });
  }, [safeData, filters]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "All"
  ).length;

  return {
    filters,
    filterOptions,
    filteredData,
    setFilter,
    resetFilters,
    activeFilterCount,
  };
}