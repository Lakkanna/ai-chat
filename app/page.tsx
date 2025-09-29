"use client";

import React from "react";
import { MessageCircle, Utensils, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Your Health Hub
          </h1>
          <p className="text-gray-400 text-lg">
            Choose what you&apos;d like to do today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Chat Card */}
          <Link href="/chat" className="group">
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600 h-full">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-500 p-4 rounded-full group-hover:bg-blue-400 transition-colors">
                  <MessageCircle size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                Chat
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Start a conversation with your AI assistant. Get help, ask
                questions, or just chat about anything on your mind.
              </p>
              <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="mr-2">Start Chatting</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>

          {/* Track My Diet Card */}
          <Link href="/diet" className="group">
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600 h-full">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-500 p-4 rounded-full group-hover:bg-green-400 transition-colors">
                  <Utensils size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                Track My Diet
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Monitor your daily nutrition, set goals, track calories and
                macros, and maintain a healthy lifestyle with detailed insights.
              </p>
              <div className="flex items-center justify-center text-green-400 group-hover:text-green-300 transition-colors">
                <span className="mr-2">Start Tracking</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Your health journey starts here. Choose your path and let&apos;s
            make progress together.
          </p>
        </div>
      </div>
    </div>
  );
}
