import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];

    const createParticle = () => {
      const p = document.createElement('div');
      p.className = 'particle';
      const colors = ['#f5c842', '#ff8c00', '#ff6b35', '#ffd700', '#c9950c'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.width = `${Math.random() * 4 + 2}px`;
      p.style.height = p.style.width;
      p.style.animationDuration = `${Math.random() * 8 + 6}s`;
      p.style.animationDelay = `${Math.random() * 4}s`;
      container.appendChild(p);
      particles.push(p);

      setTimeout(() => {
        if (container.contains(p)) container.removeChild(p);
        const idx = particles.indexOf(p);
        if (idx > -1) particles.splice(idx, 1);
      }, 15000);
    };

    const interval = setInterval(createParticle, 800);
    for (let i = 0; i < 10; i++) createParticle();

    return () => {
      clearInterval(interval);
      particles.forEach(p => {
        if (container.contains(p)) container.removeChild(p);
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
}
