"use client";

import React, { useState, useEffect } from "react";
// Импортируем милые векторные иконки из библиотеки Lucide
import {
  Heart,
  Sun,
  Sparkles,
  Star,
  Smile,
  Flower,
  Gift,
  Cloud,
  Moon,
} from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  iconIndex: number; // Индекс иконки из массива
  colorIndex: number; // Индекс цвета из массива
  size: number;
  sway: number;
  rotate: number;
  isBg?: boolean; // Флаг для медленных фоновых частиц
}

// Список компонентов иконок для генерации
const iconList = [Heart, Sun, Sparkles, Star, Smile, Flower, Gift, Cloud, Moon];

// Палитра нежных и романтичных цветов для иконок
const colorList = [
  "text-rose-400 fill-rose-300/40",
  "text-amber-400 fill-amber-300/40",
  "text-yellow-400 fill-yellow-200/40",
  "text-orange-400 fill-orange-300/40",
  "text-pink-400 fill-pink-300/40",
  "text-teal-400 fill-teal-300/40",
  "text-red-400 fill-red-300/40",
  "text-sky-400 fill-sky-300/40",
  "text-purple-400 fill-purple-300/40",
];

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const playMagicSound = () => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.3);
      osc2.frequency.setValueAtTime(830.61, now);
      osc2.frequency.exponentialRampToValueAtTime(1661.22, now + 0.3);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {}
  };

  const createExplosion = (clientX: number, clientY: number) => {
    playMagicSound();
    setClickCount((prev) => prev + 1);

    // Создаем взрыв из 12 случайных векторных иконок
    const newParticles: Particle[] = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      x: clientX,
      y: clientY,
      iconIndex: Math.floor(Math.random() * iconList.length),
      colorIndex: Math.floor(Math.random() * colorList.length),
      size: Math.random() * 16 + 18, // Размеры от 18px до 34px
      sway: (Math.random() - 0.5) * 200,
      rotate: (Math.random() - 0.5) * 180,
      isBg: false,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Появление медленных фоновых элементов
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-45), // Оптимизируем производительность
        {
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          iconIndex: Math.floor(Math.random() * iconList.length),
          colorIndex: Math.floor(Math.random() * colorList.length),
          size: Math.random() * 12 + 14, // Плавные фоновые частицы чуть меньше
          sway: (Math.random() - 0.5) * 120,
          rotate: Math.random() * 360,
          isBg: true,
        },
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={(e) => createExplosion(e.clientX, e.clientY)}
      className="animated-bg relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center select-none overflow-hidden cursor-pointer"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Pacifico&family=Comfortaa:wght@400;700&display=swap');
        
        /* ГЛАВНАЯ АНИМАЦИЯ ФОНА */
        .animated-bg {
          background: linear-gradient(-45deg, #fff1f2, #fff7ed, #fefce8, #f0fdfa);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Мягкое мерцание заднего плана */
        .bg-glow {
          position: absolute;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(253,224,71,0.12) 0%, rgba(255,255,255,0) 70%);
          animation: rotateGlow 20s linear infinite;
          pointer-events: none;
        }

        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .font-pacifico { font-family: 'Pacifico', cursive; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-comfortaa { font-family: 'Comfortaa', sans-serif; }

        @keyframes customHeartbeat {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(251,191,36,0.3)); }
          25% { transform: scale(1.12); filter: drop-shadow(0 0 20px rgba(251,191,36,0.5)); }
          60% { transform: scale(1.16); }
        }

        /* МЕДЛЕННЫЙ ПОЛЕТ ДЛЯ ФОНА */
        @keyframes flyUpSlow {
          0% { transform: translateY(0) scale(0.3) rotate(0deg); opacity: 0; }
          15% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-750px) translateX(var(--sway)) scale(1.2) rotate(var(--rotate)); opacity: 0; }
        }

        /* БЫСТРЫЙ ПОЛЕТ ДЛЯ КЛИКОВ */
        @keyframes flyUpFast {
          0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0.9; }
          100% { transform: translateY(-450px) translateX(var(--sway)) scale(1.5) rotate(var(--rotate)); opacity: 0; }
        }

        .animate-heart { animation: customHeartbeat 1.6s infinite ease-in-out; }
        
        /* Применяем разные скорости анимации */
        .particle-bg { animation: flyUpSlow 8s forwards linear; }
        .particle-click { animation: flyUpFast 1.8s forwards ease-out; }
      `}</style>

      {/* Живой слой фона */}
      <div className="bg-glow" />

      {/* Нежные облака на фоне */}
      <div
        className="absolute top-[12%] left-[-8%] text-6xl opacity-15 animate-pulse pointer-events-none"
        style={{ animationDuration: "7s" }}
      >
        <Cloud size={80} className="text-orange-200 fill-orange-100" />
      </div>
      <div
        className="absolute top-[38%] right-[-5%] text-7xl opacity-10 animate-bounce pointer-events-none"
        style={{ animationDuration: "9s" }}
      >
        <Cloud size={100} className="text-pink-200 fill-pink-100" />
      </div>

      {/* Отрисовка векторных частиц */}
      {particles.map((p) => {
        const IconComponent = iconList[p.iconIndex];
        const colorClasses = colorList[p.colorIndex];
        return (
          <span
            key={p.id}
            className={`absolute pointer-events-none z-50 select-none flex items-center justify-center ${
              p.isBg ? "particle-bg" : "particle-click"
            } ${colorClasses}`}
            style={{
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: `${p.size}px`,
              height: `${p.size}px`,
              ["--sway" as any]: `${p.sway}px`,
              ["--rotate" as any]: `${p.rotate}deg`,
            }}
          >
            <IconComponent
              size={p.size}
              strokeWidth={1.5}
              className="w-full h-full stroke-current"
            />
          </span>
        );
      })}

      <main className="flex flex-col items-center justify-center z-10 pointer-events-none translate-y-[-20px]">
        {/* Главное векторное солнце и сердечко */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-36 h-36 bg-amber-300/20 rounded-full blur-2xl animate-ping" />
          <div className="relative animate-heart drop-shadow-md text-amber-500 flex items-center justify-center">
            <Sun
              size={110}
              strokeWidth={1.5}
              className="fill-amber-200 text-amber-500"
            />
            <div
              className="absolute top-1 right-1 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              <Heart
                size={36}
                strokeWidth={1.5}
                className="fill-rose-400 text-rose-500 drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        <h1 className="font-pacifico text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 drop-shadow-sm leading-tight pb-1">
          Я тебя люблю
        </h1>

        <p className="font-caveat mt-4 text-4xl text-orange-600/90 drop-shadow-sm">
          моему любимому солнышку
        </p>

        <div className="mt-12 space-y-2">
          <p className="font-comfortaa text-[10px] text-orange-400/60 tracking-[0.3em] uppercase">
            нажми на экран
          </p>
          {clickCount > 0 && (
            <p className="font-comfortaa text-xs text-rose-400 font-bold animate-bounce">
              +{clickCount} лучиков любви
            </p>
          )}
        </div>
      </main>

      <footer className="absolute bottom-10 font-comfortaa text-[9px] text-orange-300 tracking-[0.4em] uppercase opacity-80 pointer-events-none">
        свети ярче всех ✨
      </footer>
    </div>
  );
}
