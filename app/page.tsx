"use client";

import React from "react";
import { MessageCircle, Utensils, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <ThemeToggle />
        </div>

        <div className="text-center mb-8 sm:mb-12">
          {/* App Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-dank-mono title-glow glow-text mb-2">
              Noobs Today
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>

          {/* Welcome Message */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Welcome to Your Health Hub
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose what you&apos;d like to do today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Chat Card */}
          <Link href="/chat" className="group">
            <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 hover:bg-accent transition-all duration-300 border border-border hover:border-primary/20 h-full card-hover shadow-soft">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="bg-blue-500 p-3 sm:p-4 rounded-full group-hover:bg-blue-400 transition-colors">
                  <MessageCircle
                    size={24}
                    className="sm:w-8 sm:h-8 text-white"
                  />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-3 sm:mb-4 text-center">
                Chat
              </h2>
              <p className="text-muted-foreground text-center mb-4 sm:mb-6 text-sm sm:text-base">
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
            <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 hover:bg-accent transition-all duration-300 border border-border hover:border-primary/20 h-full card-hover shadow-soft">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="bg-green-500 p-3 sm:p-4 rounded-full group-hover:bg-green-400 transition-colors">
                  <Utensils size={24} className="sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-3 sm:mb-4 text-center">
                Track My Diet
              </h2>
              <p className="text-muted-foreground text-center mb-4 sm:mb-6 text-sm sm:text-base">
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
          <p className="text-muted-foreground text-sm">
            Your health journey starts here. Choose your path and let&apos;s
            make progress together.
          </p>
        </div>
      </div>
    </div>
  );
}
