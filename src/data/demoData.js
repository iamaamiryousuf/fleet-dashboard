// Demo data — used when Google Sheets is not yet configured
// This mirrors the exact structure your real data will have.

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DRIVERS = [
  "Muhammad Ali", "Ahmed Hassan", "Khalid Mehmood", "Tariq Iqbal",
  "Usman Farooq", "Bilal Raza", "Asif Nawaz", "Imran Shah",
  "Zubair Ahmed", "Faisal Khan"
];

const VEHICLES = [
  { num: "KHI-001", type: "Pickup" },
  { num: "KHI-002", type: "Sedan" },
  { num: "KHI-003", type: "SUV" },
  { num: "KHI-004", type: "Van" },
  { num: "KHI-005", type: "Truck" },
  { num: "KHI-006", type: "Pickup" },
  { num: "KHI-007", type: "Sedan" },
  { num: "KHI-008", type: "SUV" },
  { num: "KHI-009", type: "Van" },
  { num: "KHI-010", type: "Pickup" },
];

const VENDORS = ["Al-Faisal Motors", "City Transport", "Pak Logistics", "Metro Fleet"];
const PROJECTS = ["North Zone", "South Zone", "Industrial Hub", "Port Operations", "City Distribution"];
const SITES = ["Site A", "Site B", "Site C", "Site D", "Main Office"];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let idCounter = 1001;

export const DEMO_DATA = [];

// Generate 2 years of monthly records (each driver/vehicle pair per month)
const currentYear = 2024;
[2023, 2024].forEach((year) => {
  MONTHS.forEach((month, mi) => {
    // Only go up to current period
    if (year === 2024 && mi > 8) return;

    DRIVERS.forEach((driver, di) => {
      const vehicle = VEHICLES[di % VEHICLES.length];
      const fixedSalary = rand(25000, 45000);
      const fuelCost = rand(8000, 20000);
      const otAmount = rand(0, 8000);
      const outOfCityAmount = rand(0, 12000);
      const km = rand(800, 4500);
      const monthlyBilling = fixedSalary + fuelCost + otAmount + outOfCityAmount + rand(2000, 8000);

      DEMO_DATA.push({
        id: String(idCounter++),
        date: `${year}-${String(mi + 1).padStart(2, "0")}-01`,
        month: `${month} ${year}`,
        driverName: driver,
        vehicleNumber: vehicle.num,
        vehicleType: vehicle.type,
        vendor: VENDORS[di % VENDORS.length],
        project: PROJECTS[di % PROJECTS.length],
        sites: SITES[di % SITES.length],
        fixedSalary,
        fuelCost,
        otAmount,
        outOfCityAmount,
        km,
        monthlyBilling,
        totalCost: fixedSalary + fuelCost + otAmount + outOfCityAmount,
      });
    });
  });
});
