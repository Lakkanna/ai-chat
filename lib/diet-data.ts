// Data models and utilities for diet tracking

export interface DailyGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  quantity: string;
  timestamp: Date;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  caloriesBurned: number;
  duration: number; // in minutes
  timestamp: Date;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: Date;
}

export interface DailyData {
  date: string; // YYYY-MM-DD format
  goals: DailyGoals;
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
  weight?: number;
}

export interface DailyTotals {
  foodCalories: number;
  exerciseCalories: number;
  netCalories: number;
  remainingCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  carbsProgress: number;
  proteinProgress: number;
  fatProgress: number;
}

// Default daily goals
export const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  carbs: 250,
  protein: 150,
  fat: 65,
};

// Mock data for demonstration
export const MOCK_DAILY_DATA: DailyData[] = [
  {
    date: new Date().toISOString().split("T")[0],
    goals: DEFAULT_GOALS,
    foodEntries: [
      {
        id: "1",
        name: "Oatmeal with berries",
        calories: 300,
        carbs: 45,
        protein: 12,
        fat: 8,
        quantity: "1 bowl",
        timestamp: new Date(new Date().setHours(8, 0, 0, 0)),
      },
      {
        id: "2",
        name: "Grilled chicken salad",
        calories: 450,
        carbs: 15,
        protein: 35,
        fat: 20,
        quantity: "1 large bowl",
        timestamp: new Date(new Date().setHours(13, 0, 0, 0)),
      },
    ],
    exerciseEntries: [
      {
        id: "1",
        name: "Morning jog",
        caloriesBurned: 300,
        duration: 30,
        timestamp: new Date(new Date().setHours(7, 0, 0, 0)),
      },
    ],
    weight: 70,
  },
];

// Utility functions
export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return getDateString(date) === getDateString(today);
}

export function getDaysInRange(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

export function calculateDailyTotals(data: DailyData): DailyTotals {
  const foodCalories = data.foodEntries.reduce(
    (sum, entry) => sum + entry.calories,
    0
  );
  const exerciseCalories = data.exerciseEntries.reduce(
    (sum, entry) => sum + entry.caloriesBurned,
    0
  );
  const netCalories = foodCalories - exerciseCalories;
  const remainingCalories = data.goals.calories - netCalories;

  const totalCarbs = data.foodEntries.reduce(
    (sum, entry) => sum + entry.carbs,
    0
  );
  const totalProtein = data.foodEntries.reduce(
    (sum, entry) => sum + entry.protein,
    0
  );
  const totalFat = data.foodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  return {
    foodCalories,
    exerciseCalories,
    netCalories,
    remainingCalories,
    totalCarbs,
    totalProtein,
    totalFat,
    carbsProgress: (totalCarbs / data.goals.carbs) * 100,
    proteinProgress: (totalProtein / data.goals.protein) * 100,
    fatProgress: (totalFat / data.goals.fat) * 100,
  };
}

// Local storage utilities
export function saveDailyData(data: DailyData) {
  if (typeof window !== "undefined") {
    const existingData = getDailyData(data.date);
    if (existingData) {
      // Update existing data
      const allData = getAllDailyData();
      const updatedData = allData.map((d) => (d.date === data.date ? data : d));
      localStorage.setItem("dietData", JSON.stringify(updatedData));
    } else {
      // Add new data
      const allData = getAllDailyData();
      allData.push(data);
      localStorage.setItem("dietData", JSON.stringify(allData));
    }
  }
}

export function getDailyData(date: string): DailyData | null {
  if (typeof window !== "undefined") {
    const allData = getAllDailyData();
    return allData.find((d) => d.date === date) || null;
  }
  return null;
}

export function getAllDailyData(): DailyData[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("dietData");
    if (data) {
      return JSON.parse(data).map((d: DailyData) => ({
        ...d,
        foodEntries: d.foodEntries.map((fe: FoodEntry) => ({
          ...fe,
          timestamp: new Date(fe.timestamp),
        })),
        exerciseEntries: d.exerciseEntries.map((ee: ExerciseEntry) => ({
          ...ee,
          timestamp: new Date(ee.timestamp),
        })),
      }));
    }
  }
  return MOCK_DAILY_DATA;
}

export function saveWeightEntry(weight: number, date: Date) {
  if (typeof window !== "undefined") {
    const weightEntries = getWeightEntries();
    const dateString = getDateString(date);
    const existingIndex = weightEntries.findIndex(
      (entry) => getDateString(entry.date) === dateString
    );

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      date,
    };

    if (existingIndex >= 0) {
      weightEntries[existingIndex] = newEntry;
    } else {
      weightEntries.push(newEntry);
    }

    localStorage.setItem("weightEntries", JSON.stringify(weightEntries));
  }
}

export function getWeightEntries(): WeightEntry[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("weightEntries");
    if (data) {
      return JSON.parse(data).map((entry: WeightEntry) => ({
        ...entry,
        date: new Date(entry.date),
      }));
    }
  }
  return [];
}
