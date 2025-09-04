import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
}

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  emoji: string;
}

const confettiEmojis = ["🎉", "🎊", "✨", "🎈", "🎁", "⭐", "🌟", "💫"];
const confettiColors = ["#FF8C8C", "#A3D5FF", "#FFE680", "#A8E6CF", "#7FD77F"];

export default function Confetti({ active, onComplete, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: `confetti-${i}`,
          x: Math.random() * window.innerWidth,
          y: -50,
          rotation: Math.random() * 360,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]
        });
      }
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        if (onComplete) onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50" data-testid="confetti-container">
      <AnimatePresence>
        {pieces.map((piece, index) => (
          <motion.div
            key={piece.id}
            className="absolute text-2xl"
            style={{
              left: piece.x,
              color: piece.color,
            }}
            initial={{
              y: piece.y,
              rotate: piece.rotation,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: piece.rotation + 360,
              scale: [0, 1, 1, 0.8],
              opacity: [1, 1, 1, 0],
            }}
            transition={{
              duration: duration / 1000,
              delay: index * 0.02,
              ease: "easeOut",
            }}
            data-testid={`confetti-piece-${index}`}
          >
            {piece.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = () => setIsActive(true);
  const stop = () => setIsActive(false);

  return {
    isActive,
    trigger,
    stop,
    Confetti: (props: Omit<ConfettiProps, 'active'>) => (
      <Confetti active={isActive} onComplete={stop} {...props} />
    ),
  };
}
