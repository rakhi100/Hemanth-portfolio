"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
const MotionImage = motion(Image);

const imageCategories = {
  home: [
    "/images/4.jpg",
    "/film/1.jpg",
    "/images/2.jpg",
    "/film/9.jpg",
    "/images/3.jpg",
    "/film/10.jpg",
    "/images/1.jpg",
    "/film/4.jpg",
    "/images/5.jpg",
    "/film/5.jpg",
  ],

  photography: [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
    "/images/7.jpg",
    "/images/8.jpg",
    "/images/9.jpg",
    "/images/10.jpg",
  ],
  filmPhotography: [
    "/film/1.jpg",
    "/film/2.jpg",
    "/film/3.jpg",
    "/film/4.jpg",
    "/film/5.jpg",
    "/film/6.jpg",
    "/film/7.jpg",
    "/film/8.jpg",
    "/film/9.jpg",
    "/film/10.jpg",
  ],
};

export default function Home() {
  const [spawnedImages, setSpawnedImages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("home");
  const [hoveredHomeType, setHoveredHomeType] = useState(null);
  const imageIndex = useRef(0);

  const hoverSoundRef = useRef(null);
  const leaveSoundRef = useRef(null);
  const backgroundMusicRef = useRef(null);

  useEffect(() => {
    hoverSoundRef.current = new Audio("/sounds/click-in.mp3");
    leaveSoundRef.current = new Audio("/sounds/click-out.mp3");

    hoverSoundRef.current.volume = 0.18;
    leaveSoundRef.current.volume = 0.12;

    // BACKGROUND MUSIC
    backgroundMusicRef.current = new Audio(
      "/music/background-music.mp3"
    );

    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.18;

    const startMusic = () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.play().catch(() => {});
      }
    };

    // Browser requires user interaction before autoplay
    window.addEventListener("click", startMusic, {
      once: true,
    });

    // PRELOAD ALL IMAGES
    const allImages = [
      ...imageCategories.home,
      ...imageCategories.photography,
      ...imageCategories.filmPhotography,
    ];

    allImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    return () => {
      window.removeEventListener("click", startMusic);
    };
  }, []);

  const playHoverSound = () => {
    if (!hoverSoundRef.current) return;

    hoverSoundRef.current.currentTime = 0;
    hoverSoundRef.current.play();
  };

  const playLeaveSound = () => {
    if (!leaveSoundRef.current) return;

    leaveSoundRef.current.currentTime = 0;
    leaveSoundRef.current.play();
  };

  const centerTitles = {
    home: "rakhi.j",
    photography: "photography",
    filmPhotography: "film photography",
  };

  const backgroundColors = {
    home: "#ffffff",
    photography: "#fff4ad",
    filmPhotography: "#7f4f24",
  };

  const dynamicBackgroundColor =
    activeCategory === "home"
      ? hoveredHomeType === "photography"
        ? "#fff4ad"
        : hoveredHomeType === "filmPhotography"
        ? "#7f4f24"
        : "#ffffff"
      : backgroundColors[activeCategory];

  const handleClick = (e) => {
    setMenuOpen(false);
    const currentSrc =
      imageCategories[activeCategory][
        imageIndex.current % imageCategories[activeCategory].length
      ];

    const newImage = {
      id: Date.now(),
      src: currentSrc,
      type: currentSrc.includes("/film/")
        ? "filmPhotography"
        : "photography",
      x: e.clientX,
      y: e.clientY,
      rotate: Math.random() * 20 - 10,
      scale: 0.9 + Math.random() * 0.15,
    };

    imageIndex.current += 1;

    setSpawnedImages((prev) => [...prev, newImage]);

    setTimeout(() => {
      setSpawnedImages((prev) =>
        prev.filter((img) => img.id !== newImage.id)
      );
    }, 7000);
  };

  return (
    <main
      onMouseDown={(e) => {
        // Prevent image spawning near menu button/sidebar area
        if (e.clientX < 120 && e.clientY < 120) {
          return;
        }

        handleClick(e);
      }}
      className="relative w-screen h-screen overflow-hidden cursor-crosshair transition-colors duration-700 ease-in-out"
      style={{
        backgroundColor: dynamicBackgroundColor,
      }}
    >
      {/* TOP LEFT MENU BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className="fixed top-5 left-5 z-[999999] w-[26px] h-[26px] flex items-center justify-center"
        >
       <div className="relative w-[16px] h-[16px]">
  <span
    className={`absolute left-0 top-[5px] w-full h-[1.5px] bg-customBlue rounded-full transition-all duration-500 ${
      menuOpen ? "rotate-45 top-[7px]" : ""
    }`}
  ></span>

  <span
    className={`absolute left-0 bottom-[5px] w-full h-[1.5px] bg-customBlue rounded-full transition-all duration-500 ${
      menuOpen ? "-rotate-45 bottom-[7px]" : ""
    }`}
  ></span>
</div>
      </button>

      {/* SLIDE MENU */}
      <motion.div
        initial={false}
        animate={{
          x: menuOpen ? 0 : -320,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed top-0 left-0 z-[999998] w-[320px] h-screen border-r border-customBlue/20 bg-white/50 backdrop-blur-md px-10 flex items-center"
      >
        <div className="flex flex-col gap-[2px] text-[19px] tracking-[0.01em] text-customBlue font-normal w-full">

          <p className="text-[13px] tracking-[0.14em] uppercase text-customBlue opacity-70 mb-[-3px]">
            Navigate
          </p>

          {/* HOME */}
          <div
            className={`flex cursor-pointer transition-opacity duration-300 ${
              activeCategory === "home"
                ? menuOpen
                  ? "opacity-60"
                  : "opacity-100"
                : "opacity-100 hover:opacity-100"
            }`}
            onClick={() => {
              setActiveCategory("home");
              imageIndex.current = 0;
            }}
          >
            {"home".split("").map((letter, index) => (
              <span
                key={index}
                onMouseEnter={(e) => {
                  e.target.innerText = letter.toUpperCase();
                  e.target.style.transform = "scale(1.12)";
                  playHoverSound();
                }}
                onMouseLeave={(e) => {
                  e.target.innerText = letter;
                  e.target.style.transform = "scale(1)";
                  playLeaveSound();
                }}
                className="inline-block transition-all duration-300 ease-in-out"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* PHOTOGRAPHY */}
          <div
            onClick={() => {
              setActiveCategory("photography");
              imageIndex.current = 0;
            }}
            className={`flex cursor-pointer transition-opacity duration-300 ${
              activeCategory === "photography"
                ? menuOpen
                  ? "opacity-60"
                  : "opacity-100"
                : "opacity-100 hover:opacity-100"
            }`}
          >
            {"photography".split("").map((letter, index) => (
              <span
                key={index}
                onMouseEnter={(e) => {
                  e.target.innerText = letter.toUpperCase();
                  e.target.style.transform = "scale(1.12)";
                  playHoverSound();
                }}
                onMouseLeave={(e) => {
                  e.target.innerText = letter;
                  e.target.style.transform = "scale(1)";
                  playLeaveSound();
                }}
                className="inline-block transition-all duration-300 ease-in-out"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* FILM PHOTOGRAPHY */}
          <div
            onClick={() => {
              setActiveCategory("filmPhotography");
              imageIndex.current = 0;
            }}
            className={`flex cursor-pointer transition-opacity duration-300 ${
              activeCategory === "filmPhotography"
                ? menuOpen
                  ? "opacity-60"
                  : "opacity-100"
                : "opacity-100 hover:opacity-100"
            }`}
          >
            {"film photography".split("").map((letter, index) => (
              <span
                key={index}
                onMouseEnter={(e) => {
                  e.target.innerText = letter.toUpperCase();
                  e.target.style.transform = "scale(1.12)";
                  playHoverSound();
                }}
                onMouseLeave={(e) => {
                  e.target.innerText = letter;
                  e.target.style.transform = "scale(1)";
                  playLeaveSound();
                }}
                className="inline-block transition-all duration-300 ease-in-out"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* INSTAGRAM */}
          <div className="flex flex-col gap-[1px] mt-8">
            <p className="text-[13px] tracking-[0.08em] text-customBlue uppercase opacity-70">
              INSTAGRAM
            </p>

            <a
              href="https://www.instagram.com/hemanthsai_v/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex hover:opacity-100 transition-opacity duration-300"
            >
              {"@hemanthsai_v".split("").map((letter, index) => (
                <span
                  key={index}
                  onMouseEnter={(e) => {
                    e.target.innerText = letter.toUpperCase();
                    e.target.style.transform = "scale(1.12)";
                    playHoverSound();
                  }}
                  onMouseLeave={(e) => {
                    e.target.innerText = letter;
                    e.target.style.transform = "scale(1)";
                    playLeaveSound();
                  }}
                  className="inline-block transition-all duration-300 ease-in-out"
                >
                  {letter}
                </span>
              ))}
            </a>
          </div>

          {/* MAIL */}
          <div className="flex flex-col gap-[1px] mt-1">
            <p className="text-[13px] tracking-[0.08em] text-customBlue uppercase opacity-70">
              MAIL
            </p>

            <a
              href="mailto:hemanthsai0708@gmail.com"
              className="flex hover:opacity-100 transition-opacity duration-300"
            >
              {"hemanthsai0708@gmail.com".split("").map((letter, index) => (
                <span
                  key={index}
                  onMouseEnter={(e) => {
                    e.target.innerText = letter.toUpperCase();
                    e.target.style.transform = "scale(1.12)";
                    playHoverSound();
                  }}
                  onMouseLeave={(e) => {
                    e.target.innerText = letter;
                    e.target.style.transform = "scale(1)";
                    playLeaveSound();
                  }}
                  className="inline-block transition-all duration-300 ease-in-out"
                >
                  {letter}
                </span>
              ))}
            </a>
          </div>

          {/* ENQUIRY */}
          <div className="flex flex-col gap-[1px] mt-2">
            <p className="text-[12px] tracking-[0.14em] uppercase text-customBlue opacity-70">
              Enquiry
            </p>

            <a
              href="mailto:hemanthsai0708@gmail.com"
              className="flex hover:opacity-100 transition-opacity duration-300"
            >
              {"+918919856147".split("").map((letter, index) => (
                <span
                  key={index}
                  onMouseEnter={(e) => {
                    e.target.innerText = letter.toUpperCase();
                    e.target.style.transform = "scale(1.39)";
                    playHoverSound();
                  }}
                  onMouseLeave={(e) => {
                    e.target.innerText = letter;
                    e.target.style.transform = "scale(1)";
                    playLeaveSound();
                  }}
                  className="inline-block transition-all duration-300 ease-in-out"
                >
                  {letter}
                </span>
              ))}
            </a>
          </div>

        </div>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <h1
          className="text-[24px] tracking-[0.01em] font-coolveticaflex gap-0 text-customBlue"
        >
          {centerTitles[activeCategory].split("").map((letter, index) => (
            <span
              key={index}
              onMouseEnter={(e) => {
                e.target.innerText = letter.toUpperCase();
                e.target.style.transform = "scale(1.15)";
                playHoverSound();
              }}
              onMouseLeave={(e) => {
                e.target.innerText = letter;
                e.target.style.transform = "scale(1)";
                playLeaveSound();
              }}
              className="inline-block transition-all duration-300 ease-in-out cursor-pointer pointer-events-auto"
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="text-[11px] tracking-[0.18em] uppercase text-customBlue opacity-70">
          Click Any Where
        </p>
      </div>

      <AnimatePresence>
        {spawnedImages.map((img) => (
          <MotionImage
            key={img.id}
            src={img.src}
            alt="portfolio image"
            width={240}
            height={320}
            quality={85}
            priority={true}
            unoptimized={false}
            initial={{
              opacity: 0,
              scale: 0.7,
              x: img.x - 120,
              y: img.y - 160,
              rotate: img.rotate,
            }}
            animate={{
              opacity: 1,
              scale: img.scale,
              x: img.x - 120,
              y: img.y - 160,
              rotate: img.rotate,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: img.scale * 1.03,
            }}
            onMouseEnter={() => {
              if (activeCategory === "home") {
                setHoveredHomeType(img.type);
              }
            }}
            onMouseLeave={() => {
              if (activeCategory === "home") {
                setHoveredHomeType(null);
              }
            }}
            className="absolute z-[20] w-[210px] md:w-[240px] object-cover select-none pointer-events-auto hover:z-[30] will-change-transform will-change-opacity"
            draggable={false}
          />
        ))}
      </AnimatePresence>
    </main>
  );
}
