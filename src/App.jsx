import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const olympicColors = ["#0085c7", "#f4c300", "#111111", "#009f3d", "#df0024"];
const letters = "LORYMPIADE".split("");
const centerImage = `${import.meta.env.BASE_URL}images/lorympiade-center.png`;
const inviteText =
  "To honor 100 continuous weeks of Strava activities, the Lorympic Comitee is organizing the first Lorympic Games. The date is April 30th, the location is the Sportanlage Sihlhölzli. Athletes are encouraged to register by texting Lorin or Frido. Bring athletic wear.";
const mutedWordColor = "#2b2118";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function mixColors(fromHex, toHex, amount) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  const progress = clamp(amount, 0, 1);
  const mixChannel = (start, end) => Math.round(start + (end - start) * progress);

  return `rgb(${mixChannel(from.r, to.r)}, ${mixChannel(from.g, to.g)}, ${mixChannel(from.b, to.b)})`;
}

function ArcTitle({ explodeProgress }) {
  const motionProgress = easeOutCubic(explodeProgress);

  return (
    <div className="arc-title" aria-label="Lorympiade">
      {letters.map((letter, index) => {
        const baseAngle = -40 + index * 8;
        const burstAngle = -120 + index * 24;
        const angle = baseAngle + (burstAngle - baseAngle) * motionProgress;
        const radius = 236 + 164 * motionProgress;
        const spread = 1 + motionProgress * 1.12;
        const scale = 1 + motionProgress * 0.68;
        const opacity = 1 - motionProgress * 0.14;
        return (
          <span
            key={`${letter}-${index}`}
            className="arc-letter"
            style={{
              color: olympicColors[index % olympicColors.length],
              opacity,
              filter: `drop-shadow(0 10px 18px rgba(0, 0, 0, ${0.06 + motionProgress * 0.08}))`,
              transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radius}px) scale(${scale})`,
            }}
          >
            <span
              className="arc-letter-inner"
              style={{
                letterSpacing: `${0.08 + motionProgress * 0.09}em`,
                transform: `rotate(${-angle}deg) scaleX(${spread})`,
              }}
            >
              {letter}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function Poster() {
  const [flipped, setFlipped] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stageRef = useRef(null);
  const words = inviteText.split(" ");

  useEffect(() => {
    let frameId = 0;
    let currentProgress = 0;
    let targetProgress = 0;
    let isAnimating = false;

    const readTargetProgress = () => {
      if (!stageRef.current) {
        return 0;
      }

      const rect = stageRef.current.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const totalTravel = Math.max(rect.height - viewport, 1);
      return clamp(-rect.top / totalTravel, 0, 1);
    };

    const animate = () => {
      isAnimating = true;
      targetProgress = readTargetProgress();
      currentProgress += (targetProgress - currentProgress) * 0.14;

      if (Math.abs(targetProgress - currentProgress) < 0.0015) {
        currentProgress = targetProgress;
      }

      setScrollProgress((previous) => (Math.abs(previous - currentProgress) > 0.0005 ? currentProgress : previous));

      if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      isAnimating = false;
      frameId = 0;
    };

    const syncProgress = () => {
      targetProgress = readTargetProgress();

      if (!frameId && !isAnimating) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    syncProgress();
    window.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress);

    return () => {
      window.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", syncProgress);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const explodeProgress = easeOutCubic(clamp(scrollProgress / 0.42, 0, 1));
  const revealProgress = easeOutCubic(clamp((scrollProgress - 0.28) / 0.6, 0, 1));

  return (
    <main className="poster">
      <section ref={stageRef} className="scroll-stage">
        <div className="sticky-stage">
          <section className="figure-stage">
            <ArcTitle explodeProgress={explodeProgress} />
            <button
              type="button"
              className={flipped ? "figure-button is-flipped" : "figure-button"}
              onClick={() => setFlipped((value) => !value)}
              aria-pressed={flipped}
              aria-label={flipped ? "Show front of Lorin" : "Flip Lorin for invitation details"}
            >
              <span className="flip-card">
                <span className="flip-face flip-front">
                  <img className="figure-image" src={centerImage} alt="Lorympiade portrait" />
                </span>
                <span className="flip-face flip-back">
                  <img className="figure-image figure-image-back" src={centerImage} alt="" aria-hidden="true" />
                  <span className="invite-copy">
                    <strong>Lorympiade</strong>
                    <span>Birthday Olympics for the 100th Strava anniversary streak.</span>
                    <span>Tap back to return to Lorin.</span>
                  </span>
                </span>
              </span>
            </button>
          </section>
        </div>
      </section>
      <section className="story-section">
        <p className="scroll-paragraph" aria-label={inviteText}>
          {words.map((word, index) => (
            (() => {
              const wordProgress = clamp(revealProgress * (words.length + 5) - index + 0.5, 0, 1);
              const easedWordProgress = easeOutCubic(wordProgress);
              return (
                <span
                  key={`${word}-${index}`}
                  className="word"
                  style={{
                    color: mixColors(mutedWordColor, olympicColors[index % olympicColors.length], easedWordProgress),
                    opacity: 0.2 + easedWordProgress * 0.8,
                    transform: `translateY(${(1 - easedWordProgress) * 0.28}em)`,
                  }}
                >
                  {word}{" "}
                </span>
              );
            })()
          ))}
        </p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Poster />} />
      <Route path="/1" element={<Poster />} />
      <Route path="/2" element={<Poster />} />
      <Route path="/3" element={<Poster />} />
      <Route path="/4" element={<Poster />} />
      <Route path="/5" element={<Poster />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
