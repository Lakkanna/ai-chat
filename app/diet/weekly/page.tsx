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

export default function WeeklyPage() {
  const [weeklyData, setWeeklyData] = useState<
    Array<{
      date: Date;
      dateString: string;
      data: DailyData | null;
      totals: DailyTotals | null;
      hasData: boolean;
    }>
  >([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const loadWeeklyData = useCallback(() => {
    setIsLoading(true);

    // Get the start and end of the selected week
    const startOfWeek = new Date(selectedWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Get all daily data
    const allData = getAllDailyData();

    // Filter data for the selected week
    const weekDays = getDaysInRange(startOfWeek, endOfWeek);
    const weekData = weekDays.map((date) => {
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

    setWeeklyData(weekData);
    setIsLoading(false);
  }, [selectedWeek]);

  useEffect(() => {
    loadWeeklyData();
  }, [loadWeeklyData]);

  const getWeekSummary = () => {
    const daysWithData = weeklyData.filter((day) => day.hasData);

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
    };
  };

  const getWeekProgress = () => {
    const daysWithData = weeklyData.filter((day) => day.hasData);
    return (daysWithData.length / 7) * 100;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const formatWeekRange = () => {
    const startOfWeek = new Date(selectedWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return `${startOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  };

  const summary = getWeekSummary();
  const progress = getWeekProgress();

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
                Weekly Summary
              </h1>
              <p className="text-gray-400 mt-1">{formatWeekRange()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek("prev")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigateWeek("next")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Week Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Week Progress
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
              {weeklyData.filter((day) => day.hasData).length} / 7 days
            </span>
          </div>
        </div>

        {/* Weekly Summary Stats */}
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
              <div className="text-sm text-gray-400">out of 7</div>
            </div>
          </div>
        )}

        {/* Daily Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Daily Breakdown
          </h2>

          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${
                  day.hasData ? "bg-gray-700" : "bg-gray-700/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">
                      {day.date.toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {day.hasData ? (
                      <div className="text-white font-semibold">
                        {day.totals?.netCalories || 0} cal
                      </div>
                    ) : (
                      <div className="text-gray-500">No data</div>
                    )}
                  </div>
                </div>

                {day.hasData && (
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Food</div>
                      <div className="text-white font-medium">
                        {day.totals?.foodCalories || 0} cal
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Exercise</div>
                      <div className="text-white font-medium">
                        -{day.totals?.exerciseCalories || 0} cal
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Carbs</div>
                      <div className="text-white font-medium">
                        {day.totals?.totalCarbs || 0}g
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Protein</div>
                      <div className="text-white font-medium">
                        {day.totals?.totalProtein || 0}g
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Insights */}
        {summary && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Weekly Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Achievements
                </h3>
                <ul className="space-y-2 text-gray-400">
                  {summary.daysTracked >= 5 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Great consistency! Tracked {summary.daysTracked} days this
                      week
                    </li>
                  )}
                  {summary.totalExercise > 1000 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Excellent exercise routine! Burned {
                        summary.totalExercise
                      }{" "}
                      calories
                    </li>
                  )}
                  {summary.avgProtein > 100 && (
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 text-green-400" size={16} />
                      Good protein intake! Averaged{" "}
                      {Math.round(summary.avgProtein)}g per day
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Recommendations
                </h3>
                <ul className="space-y-2 text-gray-400">
                  {summary.daysTracked < 5 && (
                    <li className="flex items-center">
                      <TrendingDown
                        className="mr-2 text-yellow-400"
                        size={16}
                      />
                      Try to track more days for better insights
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
                  {summary.totalExercise < 500 && (
                    <li className="flex items-center">
                      <TrendingDown
                        className="mr-2 text-yellow-400"
                        size={16}
                      />
                      Add more physical activity to your routine
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
