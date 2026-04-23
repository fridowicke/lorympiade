import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const olympicColors = ["#0085c7", "#f4c300", "#111111", "#009f3d", "#df0024"];
const arcTitle = "LORYMPIC GAMES";
const letters = arcTitle.split("");
const centerImage = `${import.meta.env.BASE_URL}images/lorympiade-center.png`;
const inviteText =
  "To honor 100 continuous weeks of Strava activities, the Lorympic Comitee is organizing the first Lorympic Games. The date is April 30th, the location is the Sportanlage Sihlhölzli. Athletes are encouraged to register by texting Lorin or Frido. Bring athletic wear.";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function ArcTitle({ explodeProgress }) {
  const spreadCount = Math.max(letters.length - 1, 1);

  return (
    <div className="arc-title" aria-label={arcTitle}>
      {letters.map((letter, index) => {
        const baseAngle = -52 + index * (104 / spreadCount);
        const burstAngle = -132 + index * (264 / spreadCount);
        const angle = baseAngle + (burstAngle - baseAngle) * explodeProgress;
        const radius = 236 + 150 * explodeProgress;
        const spread = 1 + explodeProgress * 1.1;
        const scale = 1 + explodeProgress * 0.6;
        const opacity = 1 - explodeProgress * 0.18;
        return (
          <span
            key={`${letter}-${index}`}
            className="arc-letter"
            style={{
              color: olympicColors[index % olympicColors.length],
              opacity,
              transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radius}px) scale(${scale})`,
            }}
          >
            <span
              className="arc-letter-inner"
              style={{
                letterSpacing: `${0.08 + explodeProgress * 0.08}em`,
                transform: `rotate(${-angle}deg) scaleX(${spread})`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function Poster() {
  const [flipped, setFlipped] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const storyRef = useRef(null);
  const words = inviteText.split(" ");

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const viewport = typeof window === "undefined" ? 900 : window.innerHeight || 900;
  const explodeProgress = clamp(scrollY / (viewport * 0.75), 0, 1);
  const storyTop = storyRef.current?.getBoundingClientRect().top ?? viewport;
  const storyHeight = storyRef.current?.getBoundingClientRect().height ?? viewport * 0.45;
  const revealRange = Math.max(viewport * 0.9, storyHeight * 1.1);
  const revealProgress = clamp((viewport * 0.5 - storyTop) / revealRange, 0, 1);
  const revealedWords = Math.floor(revealProgress * words.length);

  return (
    <main className="poster">
      <section className="scroll-stage">
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
                    <strong>Lorympic Games</strong>
                    <span>Birthday Olympics for the 100th Strava anniversary streak.</span>
                    <span>Tap back to return to Lorin.</span>
                  </span>
                </span>
              </span>
            </button>
          </section>
        </div>
      </section>
      <section ref={storyRef} className="story-section">
        <p className="scroll-paragraph" aria-label={inviteText}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={index < revealedWords ? "word is-visible" : "word"}
              style={{ "--word-color": olympicColors[index % olympicColors.length] }}
            >
              {word}{" "}
            </span>
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
