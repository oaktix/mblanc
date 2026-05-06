"use client";

import React from "react";

interface LogoProps {
  variant?: "light" | "dark" | "gold";
  layout?: "vertical" | "horizontal";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ 
  variant = "gold", 
  layout = "vertical", 
  className = "",
  size = "md" 
}: LogoProps) {
  const isHorizontal = layout === "horizontal";
  
  const colors = {
    light: {
      text: "text-white",
      subtext: "text-white/70",
      icon: "#FFFFFF",
      flourish: "#D4AF37" // Gold flourish
    },
    dark: {
      text: "text-black",
      subtext: "text-black/70",
      icon: "#000000",
      flourish: "#D4AF37"
    },
    gold: {
      text: variant === "dark" ? "text-black" : "text-ivory",
      subtext: "text-gray-400",
      icon: "url(#gold-gradient)",
      flourish: "#D4AF37"
    }
  };

  const selectedColor = colors[variant];
  
  const sizes = {
    sm: { icon: 24, text: "text-xs", sub: "text-[8px]" },
    md: { icon: 40, text: "text-lg", sub: "text-[10px]" },
    lg: { icon: 60, text: "text-2xl", sub: "text-xs" },
    xl: { icon: 100, text: "text-5xl", sub: "text-sm" }
  };

  const s = sizes[size];

  const Icon = () => (
    <svg 
      width={s.icon} 
      height={s.icon} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FBF5B7" />
          <stop offset="100%" stopColor="#AA771C" />
        </linearGradient>
      </defs>
      {/* Top Triangle */}
      <path 
        d="M50 10L38 30H62L50 10Z" 
        fill={variant === "dark" ? "#000000" : "url(#gold-gradient)"} 
      />
      {/* Middle Chevron */}
      <path 
        d="M50 35L30 65H42L50 50L58 65H70L50 35Z" 
        fill={variant === "dark" ? "#000000" : "url(#gold-gradient)"} 
      />
      {/* Bottom Chevron */}
      <path 
        d="M50 60L20 95H32L50 75L68 95H80L50 60Z" 
        fill={variant === "dark" ? "#000000" : "url(#gold-gradient)"} 
      />
    </svg>
  );

  return (
    <div className={`flex ${isHorizontal ? "flex-row items-center gap-6" : "flex-col items-center gap-4"} ${className}`}>
      <Icon />
      <div className={`flex flex-col ${isHorizontal ? "items-start" : "items-center"}`}>
        <div className="relative">
          <span className={`font-sans font-black tracking-[0.1em] leading-none ${s.text} ${selectedColor.text}`}>
            MBLANC
          </span>
          {/* Flourish on the C */}
          <div className="absolute -right-3 -top-2 w-5 h-5">
             <svg viewBox="0 0 24 24" fill="none">
                <path 
                  d="M2 20C10 20 18 12 22 4C18 6 12 8 8 8C6 8 4 10 2 14" 
                  stroke={selectedColor.flourish} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
             </svg>
          </div>
        </div>
        <span className={`font-sans tracking-[0.6em] uppercase font-bold text-gray-500 ${s.sub} mt-1`}>
          BESPOKE
        </span>
      </div>
    </div>
  );
}
