"use client";

import { useEffect, useRef, useState } from "react";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealSection({
  children,
  className = "",
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Release GPU layer after transition finishes
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setDone(true), delay + 420);
    return () => clearTimeout(timer);
  }, [visible, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 380ms cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 380ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: done ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
