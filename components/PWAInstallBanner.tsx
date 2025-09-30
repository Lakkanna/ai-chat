"use client";

import React, { useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user previously dismissed
  React.useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    try {
      await installApp();
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store dismissal in localStorage
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Download size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Install Noobs Today
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Install this app on your device for quick access and offline use.
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleInstall}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-md flex items-center space-x-1 transition-colors"
              >
                <Download size={14} />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function PWAStatusIndicator() {
  const { isInstalled, isOnline } = usePWA();

  if (!isInstalled) return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-3 py-2 shadow-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-xs text-muted-foreground">
          {isOnline ? "Online" : "Offline"}
        </span>
        {isInstalled && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Smartphone size={12} />
            <span>App</span>
          </div>
        )}
      </div>
    </div>
  );
}
