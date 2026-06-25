"use client";

import React, { createContext, useContext, useState } from "react";
import LenisProvider from "./LenisProvider";
import Cursor from "./Cursor";
import Navigation from "./Navigation";
import Preloader from "./Preloader";

const PreloaderContext = createContext<boolean>(false);

export const usePreloader = () => useContext(PreloaderContext);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preloaded, setPreloaded] = useState(false);

  return (
    <PreloaderContext.Provider value={preloaded}>
      <LenisProvider>
        {/* Custom cursor active everywhere */}
        <Cursor />

        {/* Floating navigation appears after preloader curtain wipe */}
        {preloaded && <Navigation />}

        {!preloaded && (
          <Preloader onComplete={() => setPreloaded(true)} />
        )}

        {/* Page content wrapper */}
        <div
          className="relative w-full min-h-screen"
          style={{
            visibility: preloaded ? "visible" : "hidden",
            opacity: preloaded ? 1 : 0,
            transition: "opacity 0.6s ease-out, visibility 0.6s ease-out",
          }}
        >
          {children}
        </div>
      </LenisProvider>
    </PreloaderContext.Provider>
  );
}
