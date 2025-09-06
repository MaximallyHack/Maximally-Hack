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
      <FloatingElement delay={0} className="absolute top-20 left-10 text-[#e6a500] dark:text-yellow text-3xl opacity-70 dark:opacity-60">
        ✨
      </FloatingElement>
      <FloatingElement delay={1} className="absolute top-32 right-20 text-[#4a90e2] dark:text-sky text-2xl opacity-70 dark:opacity-60">
        ⭐
      </FloatingElement>
      <FloatingElement delay={2} className="absolute bottom-20 left-20 text-[#5cb85c] dark:text-mint text-4xl opacity-70 dark:opacity-60">
        🎯
      </FloatingElement>
      <FloatingElement delay={0.5} className="absolute top-1/2 right-10 text-[#d9534f] dark:text-coral text-2xl opacity-60 dark:opacity-50">
        🚀
      </FloatingElement>
      <FloatingElement delay={1.5} className="absolute bottom-1/3 right-1/3 text-[#e6a500] dark:text-yellow text-xl opacity-50 dark:opacity-40">
        💡
      </FloatingElement>
    </div>
  );
}

export function CrayonSquiggle({ className = "" }: { className?: string }) {
  return (
    <div 
      className="crayon-squiggle mx-auto mb-6 text-[#a6e3bc]"
      data-testid="crayon-squiggle"
    />
  );
}
