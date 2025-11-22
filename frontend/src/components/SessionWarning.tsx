import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SessionWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Show warning 5 minutes before session expires (25 minutes after login)
    const warningTimer = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(5 * 60); // 5 minutes in seconds
    }, 25 * 60 * 1000); // 25 minutes

    // Auto logout after 30 minutes
    const logoutTimer = setTimeout(() => {
      navigate('/admin/login');
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [navigate]);

  useEffect(() => {
    if (showWarning && timeLeft > 0) {
      const countdown = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            navigate('/admin/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [showWarning, timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-600 animate-pulse">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl">schedule</span>
        <div>
          <p className="font-bold text-sm">Sessiya Bitir</p>
          <p className="text-xs">Qalan vaxt: {formatTime(timeLeft)}</p>
        </div>
      </div>
    </div>
  );
};