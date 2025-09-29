"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import {
  WeightEntry,
  saveWeightEntry,
  getWeightEntries,
} from "../../../lib/diet-data";

export default function WeightPage() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWeightEntries();
    loadTargetWeight();
  }, []);

  const loadWeightEntries = () => {
    const entries = getWeightEntries();
    setWeightEntries(
      entries.sort((a, b) => a.date.getTime() - b.date.getTime())
    );
  };

  const loadTargetWeight = () => {
    if (typeof window !== "undefined") {
      const target = localStorage.getItem("targetWeight");
      if (target) {
        setTargetWeight(target);
      }
    }
  };

  const saveTargetWeight = (weight: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("targetWeight", weight);
    }
  };

  const handleAddWeight = async () => {
    if (!currentWeight || isLoading) return;

    setIsLoading(true);
    try {
      const weight = parseFloat(currentWeight);
      if (isNaN(weight) || weight <= 0) {
        alert("Please enter a valid weight");
        return;
      }

      saveWeightEntry(weight, new Date());
      loadWeightEntries();
      setCurrentWeight("");
      setShowAddWeight(false);
    } catch (error) {
      console.error("Error adding weight:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTargetWeightChange = (weight: string) => {
    setTargetWeight(weight);
    saveTargetWeight(weight);
  };

  const getWeightProgress = () => {
    if (weightEntries.length < 2 || !targetWeight) return null;

    const latestWeight = weightEntries[weightEntries.length - 1].weight;
    const target = parseFloat(targetWeight);
    const startWeight = weightEntries[0].weight;

    const totalChange = target - startWeight;
    const currentChange = latestWeight - startWeight;
    const progress = (currentChange / totalChange) * 100;

    return {
      progress: Math.min(Math.max(progress, 0), 100),
      currentChange,
      totalChange,
      latestWeight,
      target,
      startWeight,
    };
  };

  const getWeeklyChange = () => {
    if (weightEntries.length < 2) return null;

    const latest = weightEntries[weightEntries.length - 1];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekAgoEntry = weightEntries.find(
      (entry) => entry.date <= oneWeekAgo
    );

    if (!weekAgoEntry) return null;

    return {
      change: latest.weight - weekAgoEntry.weight,
      percentage:
        ((latest.weight - weekAgoEntry.weight) / weekAgoEntry.weight) * 100,
    };
  };

  const progress = getWeightProgress();
  const weeklyChange = getWeeklyChange();

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
                Weight Tracker
              </h1>
              <p className="text-gray-400 mt-1">Monitor your weight progress</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddWeight(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Weight
          </button>
        </div>

        {/* Current Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Current Weight */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Current Weight
            </h3>
            <div className="text-3xl font-bold text-white">
              {weightEntries.length > 0
                ? `${weightEntries[weightEntries.length - 1].weight} kg`
                : "--"}
            </div>
            <div className="text-sm text-gray-400">
              {weightEntries.length > 0 &&
                weightEntries[
                  weightEntries.length - 1
                ].date.toLocaleDateString()}
            </div>
          </div>

          {/* Target Weight */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Target Weight
            </h3>
            <div className="flex items-center">
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => handleTargetWeightChange(e.target.value)}
                placeholder="Set target"
                className="text-3xl font-bold text-white bg-transparent border-none outline-none w-24"
              />
              <span className="text-3xl font-bold text-white ml-2">kg</span>
            </div>
            <div className="text-sm text-gray-400">
              {progress && (
                <span
                  className={
                    progress.currentChange >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {progress.currentChange >= 0 ? "+" : ""}
                  {progress.currentChange.toFixed(1)} kg from start
                </span>
              )}
            </div>
          </div>

          {/* Weekly Change */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Weekly Change
            </h3>
            <div className="text-3xl font-bold text-white flex items-center">
              {weeklyChange ? (
                <>
                  {weeklyChange.change >= 0 ? (
                    <TrendingUp className="mr-2 text-red-400" size={32} />
                  ) : (
                    <TrendingDown className="mr-2 text-green-400" size={32} />
                  )}
                  {weeklyChange.change >= 0 ? "+" : ""}
                  {weeklyChange.change.toFixed(1)} kg
                </>
              ) : (
                "--"
              )}
            </div>
            <div className="text-sm text-gray-400">
              {weeklyChange && `${weeklyChange.percentage.toFixed(1)}% change`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Progress to Goal
            </h3>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Start: {progress.startWeight} kg</span>
              <span>{progress.progress.toFixed(1)}% complete</span>
              <span>Goal: {progress.target} kg</span>
            </div>
          </div>
        )}

        {/* Weight History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Weight History
          </h3>
          {weightEntries.length > 0 ? (
            <div className="space-y-3">
              {weightEntries
                .slice(-10)
                .reverse()
                .map((entry, index) => {
                  const previousEntry =
                    weightEntries[weightEntries.length - 2 - index];
                  const change = previousEntry
                    ? entry.weight - previousEntry.weight
                    : 0;

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
                    >
                      <div>
                        <div className="text-white font-semibold">
                          {entry.weight} kg
                        </div>
                        <div className="text-gray-400 text-sm">
                          {entry.date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        {change !== 0 && (
                          <div
                            className={`text-sm font-medium ${
                              change > 0 ? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {change > 0 ? "+" : ""}
                            {change.toFixed(1)} kg
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No weight entries yet</p>
              <p className="text-gray-500 text-sm">
                Add your first weight entry to start tracking
              </p>
            </div>
          )}
        </div>

        {/* Add Weight Dialog */}
        {showAddWeight && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Add Weight Entry
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="Enter your weight"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowAddWeight(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWeight}
                  disabled={!currentWeight || isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={20} className="mr-2" />
                      Add Weight
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
