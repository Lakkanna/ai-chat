"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Target } from "lucide-react";
import Link from "next/link";
import {
  DailyGoals,
  DEFAULT_GOALS,
  getDailyData,
  saveDailyData,
  getDateString,
} from "../../../lib/diet-data";

export default function GoalsPage() {
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load current goals from today's data
    const today = new Date();
    const todayData = getDailyData(getDateString(today));
    if (todayData) {
      setGoals(todayData.goals);
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Update goals for today
      const today = new Date();
      const todayData = getDailyData(getDateString(today));

      if (todayData) {
        const updatedData = { ...todayData, goals };
        saveDailyData(updatedData);
      } else {
        // Create new daily data with the goals
        const newData = {
          date: getDateString(today),
          goals,
          foodEntries: [],
          exerciseEntries: [],
        };
        saveDailyData(newData);
      }

      setMessage("Goals saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error saving goals. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalChange = (field: keyof DailyGoals, value: number) => {
    setGoals((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const presetGoals = [
    { name: "Weight Loss", calories: 1500, carbs: 150, protein: 120, fat: 50 },
    { name: "Maintenance", calories: 2000, carbs: 250, protein: 150, fat: 65 },
    { name: "Weight Gain", calories: 2500, carbs: 300, protein: 180, fat: 80 },
    { name: "High Protein", calories: 2000, carbs: 150, protein: 200, fat: 60 },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/diet"
              className="text-white hover:text-gray-300 transition-colors mr-4"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Target className="mr-3" size={32} />
                Daily Goals
              </h1>
              <p className="text-gray-400 mt-1">
                Set your daily nutrition targets
              </p>
            </div>
          </div>
        </div>

        {/* Preset Goals */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Presets
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {presetGoals.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setGoals(preset)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-lg p-4 text-left transition-colors"
              >
                <h3 className="text-white font-medium mb-2">{preset.name}</h3>
                <div className="text-sm text-gray-400">
                  <div>{preset.calories} cal</div>
                  <div>{preset.carbs}g carbs</div>
                  <div>{preset.protein}g protein</div>
                  <div>{preset.fat}g fat</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Goals */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Custom Goals
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Calories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Calories
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={goals.calories}
                  onChange={(e) =>
                    handleGoalChange("calories", parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-gray-400">
                  cal
                </span>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Carbohydrates
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={goals.carbs}
                  onChange={(e) =>
                    handleGoalChange("carbs", parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-gray-400">g</span>
              </div>
            </div>

            {/* Protein */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Protein
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={goals.protein}
                  onChange={(e) =>
                    handleGoalChange("protein", parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-gray-400">g</span>
              </div>
            </div>

            {/* Fat */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fat
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={goals.fat}
                  onChange={(e) =>
                    handleGoalChange("fat", parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
                <span className="absolute right-4 top-3 text-gray-400">g</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <p>
                Macro breakdown:{" "}
                {Math.round(
                  ((goals.carbs * 4 + goals.protein * 4 + goals.fat * 9) /
                    goals.calories) *
                    100
                )}
                % of calories
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Save Goals
                </>
              )}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.includes("Error")
                  ? "bg-red-900 text-red-200"
                  : "bg-green-900 text-green-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Goal Setting Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="text-white font-medium mb-2">
                Calorie Guidelines
              </h4>
              <ul className="space-y-1">
                <li>• Weight loss: 500-1000 cal deficit daily</li>
                <li>• Maintenance: Match your TDEE</li>
                <li>• Weight gain: 300-500 cal surplus daily</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Macro Ratios</h4>
              <ul className="space-y-1">
                <li>• Carbs: 45-65% of calories</li>
                <li>• Protein: 10-35% of calories</li>
                <li>• Fat: 20-35% of calories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
