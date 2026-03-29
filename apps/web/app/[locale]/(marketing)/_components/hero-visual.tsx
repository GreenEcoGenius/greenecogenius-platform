'use client';

import { useEffect, useRef } from 'react';

import { BarChart3, Globe, Leaf, Recycle, Shield, Zap } from 'lucide-react';

const orbitNodes = [
  { icon: Recycle, label: 'Recycler', color: '#1B9E77', angle: 0, speed: 1.8 },
  { icon: Shield, label: 'Tracer', color: '#3BB54A', angle: 60, speed: 1.4 },
  {
    icon: BarChart3,
    label: 'Mesurer',
    color: '#8DC63F',
    angle: 120,
    speed: 2.0,
  },
  { icon: Leaf, label: 'Réduire', color: '#40916C', angle: 180, speed: 1.6 },
  {
    icon: Zap,
    label: 'Optimiser',
    color: '#3BB54A',
    angle: 240,
    speed: 1.3,
  },
  {
    icon: Globe,
    label: 'Connecter',
    color: '#8DC63F',
    angle: 300,
    speed: 1.7,
  },
];

function posOnCircle(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    left: `${50 + radiusPct * Math.cos(rad)}%`,
    top: `${50 + radiusPct * Math.sin(rad)}%`,
  };
}

/**
 * Computes a direction vector from center for each node angle,
 * so they "fly away" from center on scroll.
 */
function dirFromAngle(angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollY / windowHeight, 1);

        // Move each icon outward from center
        orbitNodes.forEach((node, i) => {
          const el = nodeRefs.current[i];
          if (!el) return;

          const dir = dirFromAngle(node.angle);
          const distance = progress * node.speed * 120;
          const opacity = 1 - progress * 1.5;

          el.style.transform = `translate(-50%, -50%) translate(${dir.x * distance}px, ${dir.y * distance}px)`;
          el.style.opacity = `${Math.max(opacity, 0)}`;
        });

        // Fade the orbit rings
        const container = containerRef.current;
        if (container) {
          const rings = container.querySelectorAll('[data-orbit-ring]');
          rings.forEach((ring) => {
            const el = ring as HTMLElement;
            const ringOpacity = 1 - progress * 2;
            el.style.opacity = `${Math.max(ringOpacity, 0)}`;
          });
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {/* Central glow */}
      <div className="absolute h-[220px] w-[220px] rounded-full bg-[#1B9E77]/20 blur-[80px] sm:h-[300px] sm:w-[300px]" />

      {/* Outer orbit */}
      <div
        data-orbit-ring
        className="animate-spin-orbit absolute h-[340px] w-[340px] sm:h-[440px] sm:w-[440px] lg:h-[560px] lg:w-[560px]"
      >
        <div className="absolute inset-0 rounded-full border border-[#1B9E77]/10" />

        {orbitNodes.map((node, i) => {
          const pos = posOnCircle(node.angle, 44);
          return (
            <div
              key={node.label}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform transition-none"
              style={{ left: pos.left, top: pos.top }}
            >
              {/* Counter-rotate so icons stay upright */}
              <div className="animate-counter-orbit flex flex-col items-center gap-1">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 backdrop-blur-md sm:h-13 sm:w-13 lg:h-14 lg:w-14"
                  style={{ backgroundColor: `${node.color}15` }}
                >
                  <node.icon
                    className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                    style={{ color: node.color }}
                  />
                </div>
                <span
                  className="text-[9px] font-medium tracking-wide whitespace-nowrap sm:text-[11px]"
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
      <div
        data-orbit-ring
        className="animate-spin-orbit-reverse absolute h-[220px] w-[220px] sm:h-[290px] sm:w-[290px] lg:h-[370px] lg:w-[370px]"
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-[#3BB54A]/15" />

        {[0, 90, 180, 270].map((deg) => {
          const pos = posOnCircle(deg, 50);
          return (
            <div
              key={deg}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#3BB54A]/40" />
            </div>
          );
        })}
      </div>

      {/* Inner orbit ring (static) */}
      <div
        data-orbit-ring
        className="absolute h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] lg:h-[200px] lg:w-[200px]"
      >
        <div className="absolute inset-0 rounded-full border border-[#8DC63F]/10" />
      </div>

      {/* Decorative dashed arcs */}
      <svg
        data-orbit-ring
        className="absolute h-[340px] w-[340px] opacity-20 sm:h-[440px] sm:w-[440px] lg:h-[560px] lg:w-[560px]"
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
            <stop offset="0%" stopColor="#1B9E77" />
            <stop offset="100%" stopColor="#3BB54A" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3BB54A" />
            <stop offset="100%" stopColor="#8DC63F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
