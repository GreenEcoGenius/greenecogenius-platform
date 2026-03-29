'use client';

import { BarChart3, Globe, Leaf, Recycle, Shield, Zap } from 'lucide-react';

const orbitNodes = [
  { icon: Recycle, label: 'Recycler', color: '#34D399', angle: 0 },
  { icon: Shield, label: 'Tracer', color: '#2DD4BF', angle: 60 },
  { icon: BarChart3, label: 'Mesurer', color: '#6EE7B7', angle: 120 },
  { icon: Leaf, label: 'Réduire', color: '#A7F3D0', angle: 180 },
  { icon: Zap, label: 'Optimiser', color: '#5EEAD4', angle: 240 },
  { icon: Globe, label: 'Connecter', color: '#99F6E4', angle: 300 },
];

function posOnCircle(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    left: `${50 + radiusPct * Math.cos(rad)}%`,
    top: `${50 + radiusPct * Math.sin(rad)}%`,
  };
}

export function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Central glow */}
      <div className="absolute h-[300px] w-[300px] rounded-full bg-emerald-400/20 blur-[100px] sm:h-[400px] sm:w-[400px]" />

      {/* Outer orbit — spins forward, carries the 6 labelled nodes */}
      <div className="animate-spin-orbit absolute h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] lg:h-[800px] lg:w-[800px]">
        <div className="absolute inset-0 rounded-full border border-emerald-500/10" />

        {orbitNodes.map((node) => {
          const pos = posOnCircle(node.angle, 46);
          return (
            <div
              key={node.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              {/* Counter-rotate so icons stay upright */}
              <div className="animate-counter-orbit flex flex-col items-center gap-1">
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
                  className="hidden whitespace-nowrap text-[10px] font-medium tracking-wide sm:block"
                  style={{ color: node.color }}
                >
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle orbit ring — spins in reverse with 4 small dots */}
      <div className="animate-spin-orbit-reverse absolute h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]">
        <div className="absolute inset-0 rounded-full border border-dashed border-teal-400/15" />

        {[0, 90, 180, 270].map((deg) => {
          const pos = posOnCircle(deg, 50);
          return (
            <div
              key={deg}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-teal-400/40" />
            </div>
          );
        })}
      </div>

      {/* Inner orbit ring (static) */}
      <div className="absolute h-[160px] w-[160px] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px]">
        <div className="absolute inset-0 rounded-full border border-emerald-300/10" />
      </div>

      {/* Decorative dashed arcs */}
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
        />
        <circle
          cx="400"
          cy="400"
          r="250"
          stroke="url(#grad2)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
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
