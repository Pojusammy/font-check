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

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity var(--dur-slow) var(--ease-out-expo) ${delay}ms,
                     transform var(--dur-slow) var(--ease-out-expo) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
