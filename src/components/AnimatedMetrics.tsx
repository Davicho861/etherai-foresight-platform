import React, { useEffect, useState, useRef } from 'react';

interface AnimatedMetricProps {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}

const AnimatedMetric: React.FC<AnimatedMetricProps> = ({ 
  value, 
  suffix = '', 
  duration = 2000, 
  delay = 0 
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setTimeout(() => {
            const startTime = Date.now();
            
            const animateValue = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              
              const current = Math.floor(easeOutQuart * value);
              setCurrentValue(current);
              
              if (progress < 1) {
                requestAnimationFrame(animateValue);
              } else {
                setCurrentValue(value);
              }
            };
            
            animateValue();
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, delay, isVisible]);

  return (
    <span ref={ref} className="font-bold text-3xl md:text-4xl text-etherneon">
      {currentValue}{suffix}
    </span>
  );
};

export default AnimatedMetric;