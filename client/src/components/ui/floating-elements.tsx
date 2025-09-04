import { motion } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  intensity?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 3, 
  intensity = 10,
  className = ""
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      data-testid="floating-element"
    >
      {children}
    </motion.div>
  );
}

export function DecorativeElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" data-testid="decorative-elements">
      <FloatingElement delay={0} className="absolute top-20 left-10 text-yellow text-3xl opacity-60">
        ✨
      </FloatingElement>
      <FloatingElement delay={1} className="absolute top-32 right-20 text-sky text-2xl opacity-60">
        ⭐
      </FloatingElement>
      <FloatingElement delay={2} className="absolute bottom-20 left-20 text-mint text-4xl opacity-60">
        🎯
      </FloatingElement>
      <FloatingElement delay={0.5} className="absolute top-1/2 right-10 text-coral text-2xl opacity-50">
        🚀
      </FloatingElement>
      <FloatingElement delay={1.5} className="absolute bottom-1/3 right-1/3 text-yellow text-xl opacity-40">
        💡
      </FloatingElement>
    </div>
  );
}

export function CrayonSquiggle({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`crayon-squiggle ${className}`}
      data-testid="crayon-squiggle"
    />
  );
}
