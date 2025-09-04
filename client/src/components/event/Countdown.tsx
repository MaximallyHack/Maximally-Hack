import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate, label = "Event starts in:" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-soft-gray" data-testid="countdown-expired">
        <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">Event Started!</h3>
        <p className="text-text-muted">The hackathon is now live. Good luck to all participants!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-soft-gray" data-testid="countdown-timer">
      <div className="text-center">
        <h3 className="font-heading font-semibold text-xl text-text-dark mb-4">{label}</h3>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="bg-coral text-white rounded-xl p-4 min-w-[4rem]" data-testid="countdown-days">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
            </div>
            <div className="text-sm text-text-muted mt-2">Days</div>
          </div>
          <div className="text-center">
            <div className="bg-sky text-white rounded-xl p-4 min-w-[4rem]" data-testid="countdown-hours">
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
            </div>
            <div className="text-sm text-text-muted mt-2">Hours</div>
          </div>
          <div className="text-center">
            <div className="bg-mint text-text-dark rounded-xl p-4 min-w-[4rem]" data-testid="countdown-minutes">
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            </div>
            <div className="text-sm text-text-muted mt-2">Minutes</div>
          </div>
          <div className="text-center">
            <div className="bg-yellow text-text-dark rounded-xl p-4 min-w-[4rem]" data-testid="countdown-seconds">
              <div className="text-2xl font-bold">{timeLeft.seconds}</div>
            </div>
            <div className="text-sm text-text-muted mt-2">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
