'use client';

import { useEffect, useRef, useState } from 'react';

import { BarChart3, Globe, Leaf, Recycle, Shield, Zap } from 'lucide-react';

import { SERVICES, ServiceOverlay } from './service-overlay';

const orbitNodes = [
  {
    icon: Recycle,
    label: 'Recycler',
    color: '#3BB54A',
    angle: 0,
    speed: 1.8,
    serviceId: 'recycler',
  },
  {
    icon: Shield,
    label: 'Tracer',
    color: '#8DC63F',
    angle: 60,
    speed: 1.4,
    serviceId: 'tracer',
  },
  {
    icon: BarChart3,
    label: 'Mesurer',
    color: '#87CEEB',
    angle: 120,
    speed: 2.0,
    serviceId: 'mesurer',
  },
  {
    icon: Leaf,
    label: 'Réduire',
    color: '#1B9E77',
    angle: 180,
    speed: 1.6,
    serviceId: 'reduire',
  },
  {
    icon: Zap,
    label: 'Optimiser',
    color: '#F4A261',
    angle: 240,
    speed: 1.3,
    serviceId: 'optimiser',
  },
  {
    icon: Globe,
    label: 'Connecter',
    color: '#87CEEB',
    angle: 300,
    speed: 1.7,
    serviceId: 'connecter',
  },
];

function posOnCircle(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    left: `${50 + radiusPct * Math.cos(rad)}%`,
    top: `${50 + radiusPct * Math.sin(rad)}%`,
  };
}

function dirFromAngle(angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollY / windowHeight, 1);

        orbitNodes.forEach((node, i) => {
          const el = nodeRefs.current[i];
          if (!el) return;

          const dir = dirFromAngle(node.angle);
          const distance = progress * node.speed * 120;
          const opacity = 1 - progress * 1.5;

          el.style.transform = `translate(-50%, -50%) translate(${dir.x * distance}px, ${dir.y * distance}px)`;
          el.style.opacity = `${Math.max(opacity, 0)}`;
        });

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

  const selectedService = activeService
    ? SERVICES.find((s) => s.id === activeService)
    : null;

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {/* Central glow */}
        <div className="absolute h-[220px] w-[220px] rounded-full bg-[#1B9E77]/15 blur-[80px] sm:h-[300px] sm:w-[300px]" />

        {/* Outer orbit */}
        <div
          data-orbit-ring
          className="animate-spin-orbit absolute h-[380px] w-[380px] sm:h-[500px] sm:w-[500px] lg:h-[640px] lg:w-[640px]"
        >
          <div className="absolute inset-0 rounded-full border border-white/10" />

          {orbitNodes.map((node, i) => {
            const pos = posOnCircle(node.angle, 44);
            return (
              <div
                key={node.label}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-none will-change-transform"
                style={{ left: pos.left, top: pos.top }}
              >
                <button
                  type="button"
                  onClick={() => setActiveService(node.serviceId)}
                  className="animate-counter-orbit pointer-events-auto flex cursor-pointer flex-col items-center gap-1.5 transition-transform hover:scale-110"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md sm:h-16 sm:w-16 lg:h-18 lg:w-18">
                    <node.icon
                      className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                      style={{ color: node.color }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-semibold tracking-wide whitespace-nowrap drop-shadow-md sm:text-xs"
                    style={{ color: node.color }}
                  >
                    {node.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Middle orbit ring */}
        <div
          data-orbit-ring
          className="animate-spin-orbit-reverse absolute h-[250px] w-[250px] sm:h-[330px] sm:w-[330px] lg:h-[420px] lg:w-[420px]"
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />

          {[0, 90, 180, 270].map((deg) => {
            const pos = posOnCircle(deg, 50);
            return (
              <div
                key={deg}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                <div className="h-2 w-2 rounded-full bg-white/30" />
              </div>
            );
          })}
        </div>

        {/* Inner orbit ring */}
        <div
          data-orbit-ring
          className="absolute h-[140px] w-[140px] sm:h-[180px] sm:w-[180px] lg:h-[230px] lg:w-[230px]"
        >
          <div className="absolute inset-0 rounded-full border border-white/10" />
        </div>

        {/* Decorative dashed arcs */}
        <svg
          data-orbit-ring
          className="absolute h-[380px] w-[380px] opacity-20 sm:h-[500px] sm:w-[500px] lg:h-[640px] lg:w-[640px]"
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
              <stop offset="0%" stopColor="#8DC63F" />
              <stop offset="100%" stopColor="#87CEEB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Service overlay */}
      {selectedService && (
        <ServiceOverlay
          service={selectedService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}
