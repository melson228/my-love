"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Zap,
  Trophy,
  Flame,
  Wand2,
  HeartHandshake,
  Infinity as MonoInfinity,
  Lock,
  CheckCircle2,
  PartyPopper,
  ChevronRight,
  Award,
  Compass,
  HeartCrack,
} from "lucide-react";

// --- ИНТЕРФЕЙСЫ ДАННЫХ ---
interface Particle {
  id: number;
  x: number;
  y: number;
  iconIndex: number;
  colorIndex: number;
  size: number;
  sway: number;
  rotate: number;
  isBg?: boolean;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  count: number;
  icon: React.ComponentType<any>;
  type: "click" | "auto";
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reqClicks: number;
  unlocked: boolean;
  rewardText: string;
}

interface MessageMilestone {
  clicks: number;
  message: string;
  title: string;
}

// --- СПИСКИ РЕСУРСОВ ---
const iconList = [Heart, Sun, Sparkles, Star, Smile, Flower, Gift, Cloud, Moon];

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

const MILESTONES: MessageMilestone[] = [
  {
    clicks: 0,
    title: "Начало тепла",
    message: "Каждый твой клик согревает моё сердечко!",
  },
  {
    clicks: 50,
    title: "Первая искра",
    message:
      "Ты кликаешь так нежно! Моя любовь растёт с каждым твоим нажатием.",
  },
  {
    clicks: 150,
    title: "Тёплый лучик",
    message:
      "Знаешь, твоя улыбка способна затмить абсолютно любое солнце на свете.",
  },
  {
    clicks: 350,
    title: "Дыхание весны",
    message:
      "Ты самое дорогое и ценное, что у меня есть. Помни об этом всегда.",
  },
  {
    clicks: 750,
    title: "Яркое сияние",
    message: "Моё сердце бьётся только ради тебя одной, моя невероятная!",
  },
  {
    clicks: 1500,
    title: "Космический масштаб",
    message:
      "Если бы каждый мой вздох превращался в лучик, они бы заполнили всю вселенную ради тебя!",
  },
  {
    clicks: 3000,
    title: "Бесконечность",
    message:
      "Ты прошла этот кликер! Напиши мне кодовое слово 'ЛУЧИК', и я зацелую тебя! Или играй дальше, ведь моя любовь бесконечна ❤️",
  },
];

export default function Home() {
  // --- СОСТОЯНИЯ (STATES) ---
  const [clicks, setClicks] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [activeTab, setActiveTab] = useState<
    "clicker" | "upgrades" | "achievements"
  >("clicker");

  // Квесты и сюжетные сообщения
  const [currentMilestone, setCurrentMilestone] = useState<MessageMilestone>(
    MILESTONES[0],
  );
  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);

  // Стейты для апгрейдов
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "up1",
      name: "Нежный Взгляд",
      description: "+1 к силе клика",
      cost: 15,
      multiplier: 1,
      count: 0,
      icon: Smile,
      type: "click",
    },
    {
      id: "up2",
      name: "Тёплые Объятия",
      description: "+1 лучик в секунду пассивно",
      cost: 50,
      multiplier: 1,
      count: 0,
      icon: HeartHandshake,
      type: "auto",
    },
    {
      id: "up3",
      name: "Сладкий Поцелуй",
      description: "+5 к силе клика",
      cost: 200,
      multiplier: 5,
      count: 0,
      icon: Flame,
      type: "click",
    },
    {
      id: "up4",
      name: "Забота и Внимание",
      description: "+8 лучиков в секунду пассивно",
      cost: 500,
      multiplier: 8,
      count: 0,
      icon: Zap,
      type: "auto",
    },
    {
      id: "up5",
      name: "Магия Любви",
      description: "+25 лучиков в секунду пассивно",
      cost: 2000,
      multiplier: 25,
      count: 0,
      icon: Wand2,
      type: "auto",
    },
    {
      id: "up6",
      name: "Космическая Связь",
      description: "+100 к силе клика за тап",
      cost: 8000,
      multiplier: 100,
      count: 0,
      icon: MonoInfinity,
      type: "click",
    },
  ]);

  // Достижения
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "ac1",
      title: "Первое признание",
      description: "Собрать 10 лучиков любви",
      reqClicks: 10,
      unlocked: false,
      rewardText: "Ты сделала первый шаг навстречу моим чувствам!",
    },
    {
      id: "ac2",
      title: "Супер Солнышко",
      description: "Собрать 100 лучиков любви",
      reqClicks: 100,
      unlocked: false,
      rewardText: "Твоё тепло начинает согревать всё вокруг.",
    },
    {
      id: "ac3",
      title: "Хранительница Сердца",
      description: "Собрать 500 лучиков любви",
      reqClicks: 500,
      unlocked: false,
      rewardText: "Ты официально владеешь ключом от моего сердца.",
    },
    {
      id: "ac4",
      title: "Ослепительная Красота",
      description: "Собрать 1500 лучиков любви",
      reqClicks: 1500,
      unlocked: false,
      rewardText: "Я ослеплён твоей нежностью и грацией!",
    },
    {
      id: "ac5",
      title: "Королева Моего Мира",
      description: "Собрать 3000 лучиков любви",
      reqClicks: 3000,
      unlocked: false,
      rewardText: "Мы построили целую вселенную любви вместе!",
    },
  ]);

  // Вычисление характеристик
  const clicksPerTap =
    1 +
    upgrades
      .filter((u) => u.type === "click")
      .reduce((acc, u) => acc + u.count * u.multiplier, 0);
  const clicksPerSecond = upgrades
    .filter((u) => u.type === "auto")
    .reduce((acc, u) => acc + u.count * u.multiplier, 0);

  // --- ЭФФЕКТЫ (EFFECTS) ---

  // Инициализация (Загрузка данных из LocalStorage)
  useEffect(() => {
    const savedClicks = localStorage.getItem("love_clicks");
    const savedTotal = localStorage.getItem("love_total");
    const savedLevel = localStorage.getItem("love_level");
    const savedUpgrades = localStorage.getItem("love_upgrades");

    if (savedClicks) setClicks(parseInt(savedClicks));
    if (savedTotal) setTotalEarned(parseInt(savedTotal));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedUpgrades) {
      try {
        const parsed = JSON.parse(savedUpgrades);
        setUpgrades((prev) =>
          prev.map((u, i) =>
            parsed[i]
              ? { ...u, count: parsed[i].count, cost: parsed[i].cost }
              : u,
          ),
        );
      } catch (e) {}
    }
  }, []);

  // Сохранение данных при изменении ключевых стейтов
  useEffect(() => {
    if (totalEarned > 0) {
      localStorage.setItem("love_clicks", clicks.toString());
      localStorage.setItem("love_total", totalEarned.toString());
      localStorage.setItem("love_level", level.toString());
      localStorage.setItem(
        "love_upgrades",
        JSON.stringify(
          upgrades.map((u) => ({ id: u.id, count: u.count, cost: u.cost })),
        ),
      );
    }
  }, [clicks, totalEarned, level, upgrades]);

  // Каждые 1.2 секунды генерируем ленивую фоновую иконку
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-40),
        {
          id: Math.random(),
          x:
            Math.random() *
            (typeof window !== "undefined" ? window.innerWidth : 400),
          y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
          iconIndex: Math.floor(Math.random() * iconList.length),
          colorIndex: Math.floor(Math.random() * colorList.length),
          size: Math.random() * 12 + 14,
          sway: (Math.random() - 0.5) * 120,
          rotate: Math.random() * 360,
          isBg: true,
        },
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Каждую секунду начисляем пассивный доход лучиков
  useEffect(() => {
    if (clicksPerSecond === 0) return;
    const interval = setInterval(() => {
      setClicks((prev) => {
        const next = prev + clicksPerSecond;
        setTotalEarned((t) => t + clicksPerSecond);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [clicksPerSecond]);

  // Динамический расчет Уровня Любви на базе общего количества лучиков
  useEffect(() => {
    const nextLevel = Math.floor(Math.sqrt(totalEarned / 20)) + 1;
    if (nextLevel > level) {
      setLevel(nextLevel);
    }
  }, [totalEarned, level]);

  // Мониторинг ачивок и сюжетных окон
  useEffect(() => {
    // Проверка ачивок
    setAchievements((prev) =>
      prev.map((ach) => {
        if (!ach.unlocked && totalEarned >= ach.reqClicks) {
          return { ...ach, unlocked: true };
        }
        return ach;
      }),
    );

    // Проверка сюжетных вех (Milestones)
    const activeMilestone = [...MILESTONES]
      .reverse()
      .find((m) => totalEarned >= m.clicks);
    if (activeMilestone && activeMilestone.clicks !== currentMilestone.clicks) {
      setCurrentMilestone(activeMilestone);
      setShowMilestoneModal(true);
      playLevelUpSound();
    }
  }, [totalEarned, currentMilestone]);

  // --- МУЗЫКА И ЗВУКИ (WEB AUDIO API) ---
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
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25); // E6

      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {}
  };

  const playLevelUpSound = () => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.4); // D6

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  };

  // --- ОБРАБОТЧИКИ НАЖАТИЙ (HANDLERS) ---
  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Предотвращаем двойной клик по фону

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Начисление валюты
    setClicks((prev) => prev + clicksPerTap);
    setTotalEarned((prev) => prev + clicksPerTap);

    playMagicSound();

    // Создание плавающего текста "+X"
    setFloatingTexts((prev) => [
      ...prev,
      { id: Math.random(), x, y, text: `+${clicksPerTap}` },
    ]);

    // Взрыв милых лучей-иконок
    const newParticles: Particle[] = Array.from({ length: 10 }).map(() => ({
      id: Math.random(),
      x,
      y,
      iconIndex: Math.floor(Math.random() * iconList.length),
      colorIndex: Math.floor(Math.random() * colorList.length),
      size: Math.random() * 15 + 18,
      sway: (Math.random() - 0.5) * 220,
      rotate: (Math.random() - 0.5) * 200,
      isBg: false,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Очистка массивов с анимациями для разгрузки ОЗУ телефона
  useEffect(() => {
    if (floatingTexts.length > 15)
      setFloatingTexts((prev) => prev.slice(prev.length - 10));
  }, [floatingTexts]);

  // Механика покупки апгрейдов
  const buyUpgrade = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpgrades((prev) =>
      prev.map((up) => {
        if (up.id === id && clicks >= up.cost) {
          setClicks((c) => c - up.cost);
          playLevelUpSound();
          return {
            ...up,
            count: up.count + 1,
            cost: Math.floor(up.cost * 1.45), // Каждая покупка делает апгрейд дороже
          };
        }
        return up;
      }),
    );
  };

  // Сброс прогресса (при необходимости начать заново)
  const resetGame = () => {
    if (
      confirm("Солнышко, ты точно хочешь сбросить свои лучики и начать заново?")
    ) {
      localStorage.clear();
      setClicks(0);
      setTotalEarned(0);
      setLevel(1);
      setCurrentMilestone(MILESTONES[0]);
      setUpgrades([
        {
          id: "up1",
          name: "Нежный Взгляд",
          description: "+1 к силе клика",
          cost: 15,
          multiplier: 1,
          count: 0,
          icon: Smile,
          type: "click",
        },
        {
          id: "up2",
          name: "Тёплые Объятия",
          description: "+1 лучик в секунду пассивно",
          cost: 50,
          multiplier: 1,
          count: 0,
          icon: HeartHandshake,
          type: "auto",
        },
        {
          id: "up3",
          name: "Сладкий Поцелуй",
          description: "+5 к силе клика",
          cost: 200,
          multiplier: 5,
          count: 0,
          icon: Flame,
          type: "click",
        },
        {
          id: "up4",
          name: "Забота и Внимание",
          description: "+8 лучиков в секунду пассивно",
          cost: 500,
          multiplier: 8,
          count: 0,
          icon: Zap,
          type: "auto",
        },
        {
          id: "up5",
          name: "Магия Любви",
          description: "+25 лучиков в секунду пассивно",
          cost: 2000,
          multiplier: 25,
          count: 0,
          icon: Wand2,
          type: "auto",
        },
        {
          id: "up6",
          name: "Космическая Связь",
          description: "+100 к силе клика за тап",
          cost: 8000,
          multiplier: 100,
          count: 0,
          icon: MonoInfinity,
          type: "click",
        },
      ]);
      setAchievements((prev) => prev.map((a) => ({ ...a, unlocked: false })));
      setActiveTab("clicker");
    }
  };

  return (
    <div className="animated-bg relative flex min-h-screen w-full flex-col items-center bg-gradient-to-tr px-4 text-center select-none overflow-hidden pb-24">
      {/* КЛИЕНТСКИЕ СТИЛИ АНИМАЦИИ (Tailwind + CSS) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Pacifico&family=Comfortaa:wght@400;600;700&display=swap');
        
        .animated-bg {
          background: linear-gradient(-45deg, #fff1f2, #fff7ed, #fefce8, #f0fdfa);
          background-size: 400% 400%;
          animation: gradientMove 20s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-glow {
          position: absolute;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle, rgba(254,215,170,0.2) 0%, rgba(255,255,255,0) 70%);
          animation: rotateGlow 25s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .font-pacifico { font-family: 'Pacifico', cursive; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-comfortaa { font-family: 'Comfortaa', sans-serif; }

        @keyframes clickerPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 12px rgba(245,158,11,0.2)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 10px 28px rgba(245,158,11,0.4)); }
        }
        .main-sun-btn { animation: clickerPulse 2.5s infinite ease-in-out; }
        
        @keyframes flyUpSlow {
          0% { transform: translateY(0) scale(0.3) rotate(0deg); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateY(-800px) translateX(var(--sway)) scale(1.1) rotate(var(--rotate)); opacity: 0; }
        }
        @keyframes flyUpFast {
          0% { transform: translateY(0) scale(0.6) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-500px) translateX(var(--sway)) scale(1.4) rotate(var(--rotate)); opacity: 0; }
        }
        .particle-bg { animation: flyUpSlow 9s forwards linear; }
        .particle-click { animation: flyUpFast 1.6s forwards cubic-bezier(0.1, 0.8, 0.3, 1); }

        @keyframes textFloat {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-120px) scale(1.3); opacity: 0; }
        }
        .text-float { animation: textFloat 1.2s forwards ease-out; }
      `}</style>

      {/* Интерактивный бэкграунд */}
      <div className="bg-glow" />

      {/* Отрисовка летящих частиц */}
      {particles.map((p) => {
        const IconComponent = iconList[p.iconIndex];
        return (
          <span
            key={p.id}
            className={`absolute pointer-events-none select-none flex items-center justify-center ${
              p.isBg
                ? "particle-bg z-0 text-orange-300/40 fill-orange-200/20"
                : `particle-click z-40 ${colorList[p.colorIndex]}`
            }`}
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

      {/* Вылетающие цифры клика "+X" */}
      {floatingTexts.map((ft) => (
        <span
          key={ft.id}
          className="absolute text-float text-2xl font-extrabold text-orange-500 font-comfortaa pointer-events-none drop-shadow-sm z-50 select-none"
          style={{ left: ft.x - 20, top: ft.y - 20 }}
        >
          {ft.text}
        </span>
      ))}

      {/* ВЕРХНЯЯ СТАТИСТИКА И ИНФОРМАЦИЯ О ЛЕВЕЛЕ */}
      <header className="w-full max-w-md mt-6 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm z-30 border border-orange-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            Lv.{level}
          </div>
          <div className="text-left">
            <p className="font-comfortaa text-[11px] uppercase tracking-wider text-orange-500/80 font-bold">
              Ранг солнышка
            </p>
            <h4 className="font-pacifico text-sm text-gray-700">
              {currentMilestone.title}
            </h4>
          </div>
        </div>
        <div className="text-right">
          <span className="font-comfortaa text-[10px] text-gray-400 block">
            Всего добыто: {totalEarned}
          </span>
          <span className="font-comfortaa text-xs font-bold text-rose-500 flex items-center justify-end gap-1">
            <Flame size={12} className="inline fill-rose-100" />{" "}
            {clicksPerSecond}/сек
          </span>
        </div>
      </header>

      {/* СУММАРНЫЙ БАЛАНС ЛУЧИКОВ */}
      <section className="my-6 z-30">
        <div className="flex items-center justify-center gap-1">
          <h2 className="font-comfortaa text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
            {clicks.toLocaleString()}
          </h2>
          <span className="text-2xl animate-pulse">☀️</span>
        </div>
        <p className="font-caveat text-xl text-orange-600/90 mt-1">
          лучиков любви у моей прекрасной жены
        </p>
      </section>

      {/* ОСНОВНОЙ КОНТЕНТ ПО ВКЛАДКАМ */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-start z-20">
        {/* ВКЛАДКА 1: КЛИКЕР (ГЛАВНЫЙ ЭКРАН) */}
        {activeTab === "clicker" && (
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {/* Кликер-кнопка (Большое солнце) */}
            <div
              onClick={handleMainClick}
              className="main-sun-btn relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform select-none"
            >
              {/* Пульсирующие круги позади */}
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl scale-110 -z-10 animate-pulse" />
              <div
                className="absolute inset-[-15px] border border-orange-300/30 rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
              />

              <div className="flex flex-col items-center text-white pointer-events-none">
                <Sun
                  size={96}
                  strokeWidth={1}
                  className="fill-yellow-100/30 text-white drop-shadow-md animate-spin"
                  style={{ animationDuration: "45s" }}
                />
                <div className="absolute bottom-12 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-comfortaa font-bold tracking-wide">
                  ТАПНИ МЕНЯ!
                </div>
              </div>

              {/* Маленькое летающее сердечко на краю */}
              <div className="absolute top-4 right-4 bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Heart size={20} className="fill-white" />
              </div>
            </div>

            {/* Цитата текущего прогресса */}
            <div className="mt-8 mx-2 bg-white/40 border border-orange-200/50 p-4 rounded-2xl backdrop-blur-sm shadow-inner">
              <p className="font-pacifico text-orange-600 text-lg">
                “Я тебя люблю”
              </p>
              <p className="font-comfortaa text-xs text-gray-600 mt-2 leading-relaxed">
                {currentMilestone.message}
              </p>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: МАГАЗИН УЛУЧШЕНИЙ */}
        {activeTab === "upgrades" && (
          <div className="flex-1 bg-white/50 backdrop-blur-md rounded-3xl p-4 border border-orange-100 shadow-sm overflow-y-auto max-h-[55vh] space-y-3">
            <h3 className="font-comfortaa font-bold text-sm text-left text-gray-500 px-1 uppercase tracking-wider mb-2">
              Наши нежные апгрейды
            </h3>

            {upgrades.map((up) => {
              const IconComp = up.icon;
              const isAffordable = clicks >= up.cost;
              return (
                <div
                  key={up.id}
                  onClick={(e) => isAffordable && buyUpgrade(up.id, e)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all select-none ${
                    isAffordable
                      ? "bg-white border-orange-100 hover:border-orange-300 active:scale-[0.99] cursor-pointer shadow-sm"
                      : "bg-gray-100/70 border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm bg-gradient-to-tr ${
                        up.type === "click"
                          ? "from-rose-400 to-pink-400"
                          : "from-amber-400 to-orange-400"
                      }`}
                    >
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h4 className="font-comfortaa text-sm font-bold text-gray-800">
                        {up.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-comfortaa">
                        {up.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-center items-end">
                    <span className="font-comfortaa text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold mb-1">
                      Куплено: {up.count}
                    </span>
                    <span
                      className={`font-comfortaa text-xs font-bold ${isAffordable ? "text-orange-500" : "text-gray-400"}`}
                    >
                      {up.cost.toLocaleString()} ☀️
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ВКЛАДКА 3: КНИГА ДОСТИЖЕНИЙ */}
        {activeTab === "achievements" && (
          <div className="flex-1 bg-white/50 backdrop-blur-md rounded-3xl p-4 border border-orange-100 shadow-sm overflow-y-auto max-h-[55vh] space-y-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="font-comfortaa font-bold text-sm text-left text-gray-500 uppercase tracking-wider">
                Книга наших достижений
              </h3>
              <button
                onClick={resetGame}
                className="text-[10px] font-comfortaa bg-rose-100 text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-200 transition-colors"
              >
                Сброс игры
              </button>
            </div>

            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`w-full flex items-start gap-4 p-3 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? "bg-white border-green-100 shadow-sm"
                    : "bg-gray-100/50 border-gray-200/60 select-none"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ach.unlocked
                      ? "bg-gradient-to-tr from-green-400 to-emerald-400 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {ach.unlocked ? <Trophy size={18} /> : <Lock size={18} />}
                </div>

                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-comfortaa text-xs font-bold ${ach.unlocked ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {ach.title}
                    </h4>
                    {!ach.unlocked && (
                      <span className="font-comfortaa text-[9px] text-gray-400 bg-gray-200 px-1.5 py-0.2 rounded">
                        прогресс {totalEarned}/{ach.reqClicks}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-comfortaa mt-0.5">
                    {ach.description}
                  </p>

                  {ach.unlocked && (
                    <div className="mt-2 bg-rose-50/70 p-2 rounded-xl border border-rose-100/50">
                      <p className="font-caveat text-sm text-rose-600 leading-tight">
                        💌 {ach.rewardText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* НИЖНЕЕ МЕНЮ НАВИГАЦИИ (ТАБ-БАР ПОД СМАРТФОН) */}
      <nav className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-2xl p-2 flex justify-around items-center shadow-lg border border-orange-100/80 z-50">
        <button
          onClick={() => setActiveTab("upgrades")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl flex-1 transition-all ${
            activeTab === "upgrades"
              ? "bg-orange-500 text-white font-bold"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          <Sparkles size={18} />
          <span className="font-comfortaa text-[10px]">Апгрейды</span>
        </button>

        <button
          onClick={() => setActiveTab("clicker")}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl flex-1 transition-all ${
            activeTab === "clicker"
              ? "bg-gradient-to-tr from-rose-500 to-orange-500 text-white font-bold scale-105 shadow-sm"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          <Heart
            size={18}
            className={activeTab === "clicker" ? "fill-white" : ""}
          />
          <span className="font-comfortaa text-[10px]">Кликер</span>
        </button>

        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl flex-1 transition-all ${
            activeTab === "achievements"
              ? "bg-orange-500 text-white font-bold"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          <Award size={18} />
          <span className="font-comfortaa text-[10px]">Книга любви</span>
        </button>
      </nav>

      {/* МОДАЛЬНОЕ ОКНО СЮЖЕТНЫХ ПОЗДРАВЛЕНИЙ */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 w-full max-w-sm text-center border border-amber-200 shadow-xl space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500 animate-bounce">
              <PartyPopper size={32} />
            </div>
            <div className="space-y-1">
              <span className="font-comfortaa text-[10px] text-orange-500 font-bold tracking-widest uppercase">
                Новая веха: {totalEarned} лучиков!
              </span>
              <h2 className="font-pacifico text-2xl text-gray-800">
                {currentMilestone.title}
              </h2>
            </div>
            <p className="font-comfortaa text-xs text-gray-600 leading-relaxed bg-white/80 p-4 rounded-2xl border border-amber-100/50 shadow-inner">
              {currentMilestone.message}
            </p>
            <button
              onClick={() => setShowMilestoneModal(false)}
              className="w-full font-comfortaa text-sm font-bold bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl active:scale-98 shadow-md hover:opacity-95 transition-all"
            >
              Я тоже тебя люблю ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
