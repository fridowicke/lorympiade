import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const olympicColors = ["#0085c7", "#f4c300", "#111111", "#009f3d", "#df0024"];
const sportanlageUrl = "https://maps.app.goo.gl/WT8BjwKDj1sTnunn7";
const sportanlagePhraseWords = ["sportanlage", "sihlhölzli"];
const highlightedPhrases = [
  "thirtieth of April",
  "sportanlage Sihlhölzli",
  "six o'clock",
  "games of youth",
  "text Frido or Lorin",
];
const highlightedPhraseWords = highlightedPhrases.map((phrase) => phrase.toLowerCase().split(" "));
const arcTitle = "LORYMPIC GAMES";
const letters = arcTitle.split("");
const centerImage = `${import.meta.env.BASE_URL}images/lorympiade-center.png`;
const inviteText = `Lorympian flame immortal

Whose beacon lights our way

Emblaze our hearts with the fires of fun

This thirtieth of April

As now we gather at Sportanlage Sihlhölzli

When six o'clock rings true

To share these playful Games of youth

In all we say and do

Text Frido or Lorin now

To claim your place in line

Step forth and join the Lorympians

Before the day divine

Sing out, Lorympians, voices strong

Rise up in harmony

All hail our brave Lorympians

With strains of victory

For prizes wait the bold at heart

Who dare to laugh and play

Lorympic light burn on and on`;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getArcMotion() {
  if (typeof window === "undefined") {
    return { usesOvalPath: false };
  }

  if (window.matchMedia("(max-width: 640px)").matches) {
    return { usesOvalPath: true, radiusX: 150, radiusY: 300 };
  }

  if (window.matchMedia("(max-width: 900px)").matches) {
    return { usesOvalPath: true, radiusX: 154, radiusY: 216 };
  }

  return { usesOvalPath: false };
}

function useArcMotion() {
  const [arcMotion, setArcMotion] = useState(getArcMotion);

  useEffect(() => {
    const onResize = () => {
      setArcMotion(getArcMotion());
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return arcMotion;
}

function isHighlightedWord(line, wordIndex) {
  const lowerLine = line.map((word) => word.toLowerCase());

  return highlightedPhraseWords.some((phrase) =>
    lowerLine.some((_, startIndex) => {
      if (startIndex + phrase.length > lowerLine.length) {
        return false;
      }

      const wordIsInPhrase = wordIndex >= startIndex && wordIndex < startIndex + phrase.length;

      return wordIsInPhrase && phrase.every((word, index) => lowerLine[startIndex + index] === word);
    }),
  );
}

function matchesPhraseAt(line, phrase, startIndex) {
  if (startIndex + phrase.length > line.length) {
    return false;
  }

  return phrase.every((word, index) => line[startIndex + index].toLowerCase() === word);
}

function isInsidePhraseAfterStart(line, phrase, wordIndex) {
  return phrase.some((_, phraseIndex) => {
    const startIndex = wordIndex - phraseIndex;

    return startIndex < wordIndex && startIndex >= 0 && matchesPhraseAt(line, phrase, startIndex);
  });
}

function ArcTitle({ explodeProgress }) {
  const spreadCount = Math.max(letters.length - 1, 1);
  const arcMotion = useArcMotion();

  return (
    <div className="arc-title" aria-label={arcTitle}>
      {letters.map((letter, index) => {
        const baseAngle = -52 + index * (104 / spreadCount);
        const burstAngle = -132 + index * (264 / spreadCount);
        const angle = baseAngle + (burstAngle - baseAngle) * explodeProgress;
        const angleRadians = (angle * Math.PI) / 180;
        const radius = 236 + 150 * explodeProgress;
        const ovalX = arcMotion.usesOvalPath ? Math.sin(angleRadians) * arcMotion.radiusX : 0;
        const ovalY = arcMotion.usesOvalPath ? -Math.cos(angleRadians) * arcMotion.radiusY : 0;
        const spread = 1 + explodeProgress * 1.1;
        const scale = 1 + explodeProgress * 0.6;
        const opacity = 1 - explodeProgress * 0.18;
        const transform = arcMotion.usesOvalPath
          ? `translateX(-50%) translate(${ovalX}px, ${ovalY}px) scale(${scale})`
          : `translateX(-50%) rotate(${angle}deg) translateY(-${radius}px) scale(${scale})`;
        const letterRotation = arcMotion.usesOvalPath ? 0 : -angle;
        return (
          <span
            key={`${letter}-${index}`}
            className="arc-letter"
            style={{
              color: olympicColors[index % olympicColors.length],
              opacity,
              transform,
            }}
          >
            <span
              className="arc-letter-inner"
              style={{
                letterSpacing: `${0.08 + explodeProgress * 0.08}em`,
                transform: `rotate(${letterRotation}deg) scaleX(${spread})`,
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
  const lines = inviteText.split("\n");
  const lineWords = lines.map((line) => line.split(" ").filter(Boolean));
  const lineStartIndexes = lineWords.map((_, lineIndex) =>
    lineWords.slice(0, lineIndex).reduce((count, item) => count + item.length, 0),
  );
  const words = lineWords.flat();

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setFlipped(false);
    };

    setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const viewport = typeof window === "undefined" ? 900 : window.innerHeight || 900;
  const explodeProgress = clamp(scrollY / (viewport * 0.75), 0, 0.6);
  const storyTop = storyRef.current?.getBoundingClientRect().top ?? viewport;
  const maxScroll =
    typeof document === "undefined"
      ? viewport
      : Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const storyOffsetTop = scrollY + storyTop;
  const revealStart = storyOffsetTop - viewport * 0.5;
  const revealEnd = Math.max(maxScroll, revealStart + 1);
  const revealProgress =
    scrollY >= maxScroll - 1 ? 1 : clamp((scrollY - revealStart) / (revealEnd - revealStart), 0, 1);
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
                    <span className="invite-teaser">Birthday Olympics for the 100th Strava anniversary streak.</span>
                    <span className="invite-teaser">Tap back to return to Lorin.</span>
                    <span className="invite-detail">30th April</span>
                    <span className="invite-detail">18h</span>
                    <a
                      className="invite-detail invite-link"
                      href={sportanlageUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Sportanlage Sihlhölzli
                    </a>
                    <span className="invite-detail">Text Frido or Lorin</span>
                  </span>
                </span>
              </span>
            </button>
          </section>
        </div>
      </section>
      <section ref={storyRef} className="story-section">
        <p className="scroll-paragraph" aria-label={inviteText}>
          {lineWords.map((line, lineIndex) => {
            return (
              <span key={`line-${lineIndex}`} className={line.length === 0 ? "poem-line poem-line-spacer" : "poem-line"}>
                {line.length === 0
                  ? "\u00A0"
                  : line.map((word, wordIndex) => {
                    const index = lineStartIndexes[lineIndex] + wordIndex;

                    if (matchesPhraseAt(line, sportanlagePhraseWords, wordIndex)) {
                      return (
                        <a
                          key={`sportanlage-${lineIndex}-${wordIndex}`}
                          className="word-link"
                          href={sportanlageUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {sportanlagePhraseWords.map((_, phraseIndex) => {
                            const phraseWordIndex = wordIndex + phraseIndex;
                            const phraseGlobalIndex = lineStartIndexes[lineIndex] + phraseWordIndex;

                            return (
                              <span
                                key={`${line[phraseWordIndex]}-${lineIndex}-${phraseWordIndex}`}
                                className={[
                                  "word",
                                  phraseGlobalIndex < revealedWords ? "is-visible" : "",
                                  "word-highlight",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                style={{ "--word-color": olympicColors[phraseGlobalIndex % olympicColors.length] }}
                              >
                                {line[phraseWordIndex]}
                                {phraseIndex < sportanlagePhraseWords.length - 1 ? " " : ""}
                              </span>
                            );
                          })}
                        </a>
                      );
                    }

                    if (isInsidePhraseAfterStart(line, sportanlagePhraseWords, wordIndex)) {
                      return null;
                    }

                    return (
                      <span
                        key={`${word}-${lineIndex}-${wordIndex}`}
                        className={[
                          "word",
                          index < revealedWords ? "is-visible" : "",
                          isHighlightedWord(line, wordIndex) ? "word-highlight" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{ "--word-color": olympicColors[index % olympicColors.length] }}
                      >
                        {word}
                        {wordIndex < line.length - 1 ? " " : ""}
                      </span>
                    );
                  })}
              </span>
            );
          })}
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
