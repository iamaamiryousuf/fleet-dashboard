const config = {
  SHEET_ID: "1ADwK-mCsv-LamwKlJDQ5vkBIIyCQoJTl686VIsN3wG0",

  SHEET_NAME: "Fixed & Variable",

  REFRESH_INTERVAL: 300000,

  // IMPORTANT: EXACT MATCH WITH GOOGLE SHEET HEADERS
  COLUMN_MAP: {
    "Date": "date",
    "Month": "month",

    "DRIVERS NAME": "driverName",

    // ⚠️ FIXED HERE (typo corrected match)
    "VEHCILES NO": "vehicleNumber",

    "Vehicle Type": "vehicleType",

    "VENDOR": "vendor",
    "PROJECT": "project",
    "SITES": "sites",

    "Fixed Salary": "fixedSalary",
    "Fuel Cost": "fuelCost",
    "OT Amount": "otAmount",
    "Out of City Amount": "outOfCityAmount",
    "KM": "km",
    "Monthly Billing Amount": "monthlyBilling",
    "ID": "id",
  },
};

export default config;