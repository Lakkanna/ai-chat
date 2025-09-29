"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import {
  getAllDailyData,
  getDateString,
  getDaysInRange,
  calculateDailyTotals,
  DailyData,
  DailyTotals,
} from "../../../lib/diet-data";

export default function MonthlyPage() {
  const [monthlyData, setMonthlyData] = useState<
    Array<{
      date: Date;
      dateString: string;
      data: DailyData | null;
      totals: DailyTotals | null;
      hasData: boolean;
    }>
  >([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const loadMonthlyData = useCallback(() => {
    setIsLoading(true);

    // Get the start and end of the selected month
    const startOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    );

    // Get all daily data
    const allData = getAllDailyData();

    // Filter data for the selected month
    const monthDays = getDaysInRange(startOfMonth, endOfMonth);
    const monthData = monthDays.map((date) => {
      const dateString = getDateString(date);
      const dayData = allData.find((d) => d.date === dateString);

      if (dayData) {
        const totals = calculateDailyTotals(dayData);
        return {
          date,
          dateString,
          data: dayData,
          totals,
          hasData: true,
        };
      } else {
        return {
          date,
          dateString,
          data: null,
          totals: null,
          hasData: false,
        };
      }
    });

    setMonthlyData(monthData);
    setIsLoading(false);
  }, [selectedMonth]);

  useEffect(() => {
    loadMonthlyData();
  }, [loadMonthlyData]);

  const getMonthSummary = () => {
    const daysWithData = monthlyData.filter((day) => day.hasData);

    if (daysWithData.length === 0) return null;

    const totalCalories = daysWithData.reduce(
      (sum, day) => sum + (day.totals?.netCalories || 0),
      0
    );
    const totalCarbs = daysWithData.reduce(
      (sum, day) => sum + (day.totals?.totalCarbs || 0),
      0
    );
    const totalProtein = daysWithData.reduce(
      (sum, day) => sum + (day.totals?.totalProtein || 0),
      0
    );
    const totalFat = daysWithData.reduce(
      (sum, day) => sum + (day.totals?.totalFat || 0),
      0
    );
    const totalExercise = daysWithData.reduce(
      (sum, day) => sum + (day.totals?.exerciseCalories || 0),
      0
    );

    const avgCalories = totalCalories / daysWithData.length;
    const avgCarbs = totalCarbs / daysWithData.length;
    const avgProtein = totalProtein / daysWithData.length;
    const avgFat = totalFat / daysWithData.length;

    return {
      totalCalories,
      totalCarbs,
      totalProtein,
      totalFat,
      totalExercise,
      avgCalories,
      avgCarbs,
      avgProtein,
      avgFat,
      daysTracked: daysWithData.length,
      totalDays: monthlyData.length,
    };
  };

  const getMonthProgress = () => {
    const daysWithData = monthlyData.filter((day) => day.hasData);
    return (daysWithData.length / monthlyData.length) * 100;
  };

  const getWeeklyBreakdown = () => {
    const weeks: Array<{
      weekNumber: number;
      daysTracked: number;
      totalCalories: number;
      totalExercise: number;
      avgCalories: number;
    }> = [];

    for (let i = 0; i < monthlyData.length; i += 7) {
      const weekDays = monthlyData.slice(i, i + 7);
      const weekData = weekDays.filter((day) => day.hasData);

      if (weekData.length > 0) {
        const weekCalories = weekData.reduce(
          (sum, day) => sum + (day.totals?.netCalories || 0),
          0
        );
        const weekExercise = weekData.reduce(
          (sum, day) => sum + (day.totals?.exerciseCalories || 0),
          0
        );

        weeks.push({
          weekNumber: Math.floor(i / 7) + 1,
          daysTracked: weekData.length,
          totalCalories: weekCalories,
          totalExercise: weekExercise,
          avgCalories: weekCalories / weekData.length,
        });
      }
    }

    return weeks;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setSelectedMonth(newDate);
  };

  const formatMonthYear = () => {
    return selectedMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const summary = getMonthSummary();
  const progress = getMonthProgress();
  const weeklyBreakdown = getWeeklyBreakdown();

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
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
                <BarChart3 className="mr-3" size={32} />
                Monthly Summary
              </h1>
              <p className="text-gray-400 mt-1">{formatMonthYear()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Month Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Month Progress
          </h2>
          <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{Math.round(progress)}% of days tracked</span>
            <span>
              {monthlyData.filter((day) => day.hasData).length} /{" "}
              {monthlyData.length} days
            </span>
          </div>
        </div>

        {/* Monthly Summary Stats */}
        {summary && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Avg Calories
              </h3>
              <div className="text-3xl font-bold text-white">
                {Math.round(summary.avgCalories)}
              </div>
              <div className="text-sm text-gray-400">per day</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Total Exercise
              </h3>
              <div className="text-3xl font-bold text-white">
                {summary.totalExercise}
              </div>
              <div className="text-sm text-gray-400">calories burned</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Avg Protein
              </h3>
              <div className="text-3xl font-bold text-white">
                {Math.round(summary.avgProtein)}g
              </div>
              <div className="text-sm text-gray-400">per day</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Days Tracked
              </h3>
              <div className="text-3xl font-bold text-white">
                {summary.daysTracked}
              </div>
              <div className="text-sm text-gray-400">
                out of {summary.totalDays}
              </div>
            </div>
          </div>
        )}

        {/* Weekly Breakdown */}
        {weeklyBreakdown.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Weekly Breakdown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyBreakdown.map((week) => (
                <div
                  key={week.weekNumber}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <h3 className="text-white font-semibold mb-3">
                    Week {week.weekNumber}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Days Tracked:</span>
                      <span className="text-white">{week.daysTracked}/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Calories:</span>
                      <span className="text-white">
                        {Math.round(week.avgCalories)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Exercise:</span>
                      <span className="text-white">
                        {week.totalExercise} cal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Insights */}
        {summary && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Monthly Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Achievements
                </h3>
                <ul className="space-y-2 text-gray-400">
                  {summary.daysTracked >= 20 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Excellent consistency! Tracked {summary.daysTracked} days
                      this month
                    </li>
                  )}
                  {summary.totalExercise > 5000 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Outstanding exercise routine! Burned{" "}
                      {summary.totalExercise} calories
                    </li>
                  )}
                  {summary.avgProtein > 100 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Great protein intake! Averaged{" "}
                      {Math.round(summary.avgProtein)}g per day
                    </li>
                  )}
                  {progress >= 80 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Amazing tracking consistency! {Math.round(progress)}% of
                      days tracked
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Recommendations
                </h3>
                <ul className="space-y-2 text-gray-400">
                  {summary.daysTracked < 15 && (
                    <li className="flex items-center">
                      <TrendingDown
                        className="mr-2 text-yellow-400"
                        size={16}
                      />
                      Try to track more days for better monthly insights
                    </li>
                  )}
                  {summary.avgCalories < 1500 && (
                    <li className="flex items-center">
                      <TrendingDown
                        className="mr-2 text-yellow-400"
                        size={16}
                      />
                      Consider increasing calorie intake for better nutrition
                    </li>
                  )}
                  {summary.totalExercise < 2000 && (
                    <li className="flex items-center">
                      <TrendingDown
                        className="mr-2 text-yellow-400"
                        size={16}
                      />
                      Add more physical activity to your routine
                    </li>
                  )}
                  {progress < 60 && (
                    <li className="flex items-center">
                      <TrendingDown
                        className="mr-2 text-yellow-400"
                        size={16}
                      />
                      Improve tracking consistency for better data insights
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trends */}
        {summary && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Monthly Trends
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {Math.round(summary.avgCalories)}
                </div>
                <div className="text-gray-400">Average Daily Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {Math.round(summary.totalExercise / summary.daysTracked)}
                </div>
                <div className="text-gray-400">Average Daily Exercise</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {Math.round(summary.avgProtein)}
                </div>
                <div className="text-gray-400">Average Daily Protein (g)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
