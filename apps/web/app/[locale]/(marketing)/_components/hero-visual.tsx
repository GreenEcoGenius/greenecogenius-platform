'use client';

import { BarChart3, Globe, Leaf, Recycle, Shield, Zap } from 'lucide-react';

const orbitNodes = [
  { icon: Recycle, label: 'Recycler', color: '#34D399', delay: '0s' },
  { icon: Shield, label: 'Tracer', color: '#2DD4BF', delay: '-5s' },
  { icon: BarChart3, label: 'Mesurer', color: '#6EE7B7', delay: '-10s' },
  { icon: Leaf, label: 'Réduire', color: '#A7F3D0', delay: '-15s' },
  { icon: Zap, label: 'Optimiser', color: '#5EEAD4', delay: '-20s' },
  { icon: Globe, label: 'Connecter', color: '#99F6E4', delay: '-25s' },
];

export function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Central glow */}
      <div className="absolute h-[300px] w-[300px] rounded-full bg-emerald-400/20 blur-[100px] sm:h-[400px] sm:w-[400px]" />

      {/* Outer orbit */}
      <div className="animate-spin-orbit absolute h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] lg:h-[800px] lg:w-[800px]">
        <div className="absolute inset-0 rounded-full border border-emerald-500/10" />
        {orbitNodes.map((node, i) => {
          const angle = (i * 360) / orbitNodes.length;
          return (
            <div
              key={node.label}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateX(50%) rotate(-${angle}deg)`,
                transformOrigin: '0 0',
              }}
            >
              <div
                className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                style={{ animationDelay: node.delay }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 backdrop-blur-md sm:h-12 sm:w-12"
                  style={{ backgroundColor: `${node.color}15` }}
                >
                  <node.icon
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    style={{ color: node.color }}
                  />
                </div>
                <span
                  className="hidden text-[10px] font-medium tracking-wide sm:block"
                  style={{ color: node.color }}
                >
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle orbit ring */}
      <div className="animate-spin-orbit-reverse absolute h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]">
        <div className="absolute inset-0 rounded-full border border-dashed border-teal-400/15" />
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${deg}deg) translateX(50%) rotate(-${deg}deg)`,
              transformOrigin: '0 0',
            }}
          >
            <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/40" />
          </div>
        ))}
      </div>

      {/* Inner orbit ring */}
      <div className="absolute h-[160px] w-[160px] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px]">
        <div className="absolute inset-0 rounded-full border border-emerald-300/10" />
      </div>

      {/* Connecting lines (decorative arcs) */}
      <svg
        className="absolute h-[500px] w-[500px] opacity-20 sm:h-[650px] sm:w-[650px] lg:h-[800px] lg:w-[800px]"
        viewBox="0 0 800 800"
        fill="none"
      >
        <circle
          cx="400"
          cy="400"
          r="350"
          stroke="url(#grad1)"
          strokeWidth="0.5"
          strokeDasharray="8 12"
          className="animate-spin-orbit"
        />
        <circle
          cx="400"
          cy="400"
          r="250"
          stroke="url(#grad2)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          className="animate-spin-orbit-reverse"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
