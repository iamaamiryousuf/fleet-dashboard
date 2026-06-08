import { useState, useEffect, useCallback } from "react";
import config from "../config";

export function useFleetData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const url =
        `https://docs.google.com/spreadsheets/d/${config.SHEET_ID}/gviz/tq?tqx=out:json`;

      const res = await fetch(url);
      const text = await res.text();

      const json = JSON.parse(text.substring(47).slice(0, -2));

      const rows = json?.table?.rows || [];
      const cols = json?.table?.cols || [];

      // 🔥 SAFE HEADERS CLEANING
      const headers = cols.map((c) =>
        (c?.label || "").toString().trim().replace(/\s+/g, " ")
      );

      const colMap = config.COLUMN_MAP;

      const parsed = rows
        .map((row) => {
          const record = {
            date: "",
            month: "",
            driverName: "",
            vehicleNumber: "",
            vehicleType: "",
            vendor: "",
            project: "",
            sites: "",
            fixedSalary: 0,
            fuelCost: 0,
            otAmount: 0,
            outOfCityAmount: 0,
            km: 0,
            monthlyBilling: 0,
            id: "",
          };

          row.c?.forEach((cell, i) => {
            const header = headers[i];

            if (!header) return;

            const fieldName = colMap[header];

            if (!fieldName) return;

            const value = cell?.v ?? "";

            const numericFields = [
              "fixedSalary",
              "fuelCost",
              "otAmount",
              "outOfCityAmount",
              "km",
              "monthlyBilling",
            ];

            if (numericFields.includes(fieldName)) {
              const num = parseFloat(String(value).replace(/,/g, ""));
              record[fieldName] = isNaN(num) ? 0 : num;
            } else {
              record[fieldName] = String(value).trim();
            }
          });

          record.totalCost =
            (record.fixedSalary || 0) +
            (record.fuelCost || 0) +
            (record.otAmount || 0) +
            (record.outOfCityAmount || 0);

          return record;
        })
        .filter((r) => r); // 🔥 REMOVE EMPTY ROWS

      setData(parsed);
      setIsDemo(false);
      setLastUpdated(new Date());
      setLoading(false);
      setError(null);
    } catch (e) {
      console.error("Fleet Data Error:", e);

      setError(e.message);
      setData([]);
      setIsDemo(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isDemo,
    refetch: fetchData,
  };
}