import { NavLink, Navigate, Route, Routes } from "react-router-dom";

const olympicColors = ["ring-blue", "ring-yellow", "ring-black", "ring-green", "ring-red"];
const lorympiadeLetters = "LORYMPIADE".split("");
const centerImage = `${import.meta.env.BASE_URL}images/lorympiade-center.jpg`;

const designs = [
  {
    path: "/1",
    number: "01",
    name: "Grand Entrance",
    theme: "The official invitation to an extremely unofficial birthday olympiad.",
    copy:
      "For the 100th Strava anniversary streak, we gather not for sport, but for tiny acts of birthday glory judged with frightening sincerity.",
    panels: [
      "Cake-table tension. Podium posture. Competitive whimsy.",
      "The disciplines remain classified until the ceremonial reveal.",
      "Victory will be measured in nerve, elegance, and absolute commitment to silliness.",
    ],
  },
  {
    path: "/2",
    number: "02",
    name: "House Rules",
    theme: "A bracket for people who look excellent in a paper crown.",
    copy:
      "The Lorympiade is where childhood birthday energy gets a dark, overdesigned opening ceremony and adults pretend this is normal.",
    panels: [
      "Arrive ready to compete in things that should never have rankings.",
      "Maintain composure when the judging grows suspiciously official.",
      "Accept that prestige may come from deeply unserious excellence.",
    ],
  },
  {
    path: "/3",
    number: "03",
    name: "Medal Mood",
    theme: "An invitation disguised as a very serious cultural institution.",
    copy:
      "There will be applause, there will be suspense, and there will be at least one moment where everyone agrees this has gone too far in the best way.",
    panels: [
      "The photo is evidence that greatness can, in fact, wear party energy.",
      "Every round will feel tiny and dramatic at the same time.",
      "The podium is emotional before it is practical.",
    ],
  },
  {
    path: "/4",
    number: "04",
    name: "Velvet Committee",
    theme: "A secret society of birthday athletes with no athletic agenda.",
    copy:
      "This is a colorful invitation built on grayscale restraint: only the name gets to show off, because the title already knows it is iconic.",
    panels: [
      "The center image does the talking. The border does the judging.",
      "The name arches overhead like a suspiciously elegant crown.",
      "The games themselves remain unnamed and therefore more powerful.",
    ],
  },
  {
    path: "/5",
    number: "05",
    name: "Closing Ceremony",
    theme: "A final warning before the birthday olympics begin.",
    copy:
      "History may not remember the details, but it will absolutely remember who looked composed under pressure in a room built for childish legends.",
    panels: [
      "Show up brave enough for mystery disciplines.",
      "Show up stylish enough for needless ceremony.",
      "Show up ready for the Lorympiade.",
    ],
  },
];

function ArcTitle() {
  return (
    <div className="arc-title" aria-label="Lorympiade">
      {lorympiadeLetters.map((letter, index) => {
        const offset = -54 + index * 12;
        return (
          <span
            key={`${letter}-${index}`}
            className={`arc-letter ${olympicColors[index % olympicColors.length]}`}
            style={{ transform: `translateX(-50%) rotate(${offset}deg) translateY(-232px)` }}
          >
            <span className="arc-letter-inner" style={{ transform: `rotate(${-offset}deg)` }}>
              {letter}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ImageHero({ design }) {
  return (
    <section className="hero-stage frame">
      <div className="hero-center">
        <ArcTitle />
        <div className="portrait-wrap">
          <img className="portrait" src={centerImage} alt="Lorympiade invitation portrait" />
        </div>
      </div>
      <div className="hero-text">
        <p className="eyebrow">{design.name}</p>
        <p className="theme-line">{design.theme}</p>
        <p className="lede">{design.copy}</p>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <main className="app-shell">
      <section className="home-intro frame">
        <ImageHero design={designs[0]} />
        <div className="route-list">
          {designs.map((design) => (
            <NavLink key={design.path} className="route-card frame" to={design.path}>
              <span className={`route-number ${olympicColors[(Number(design.number) - 1) % olympicColors.length]}`}>
                {design.number}
              </span>
              <strong>{design.name}</strong>
              <p>{design.theme}</p>
            </NavLink>
          ))}
        </div>
      </section>
    </main>
  );
}

function DesignPage({ design }) {
  return (
    <main className="app-shell">
      <nav className="top-nav frame">
        <NavLink className="brand" to="/">
          Lorympiade
        </NavLink>
        <div className="nav-links">
          {designs.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? `mini-link active ${olympicColors[index % olympicColors.length]}` : "mini-link"
              }
            >
              {item.number}
            </NavLink>
          ))}
        </div>
      </nav>
      <ImageHero design={design} />
      <section className="panel-grid">
        {design.panels.map((panel, index) => (
          <article className="frame info-panel" key={panel}>
            <span className={`panel-index ${olympicColors[index % olympicColors.length]}`}>0{index + 1}</span>
            <p>{panel}</p>
          </article>
        ))}
      </section>
      <footer className="footer-note">
        <p>
          100th Strava anniversary streak. Birthday party logic. Olympic ceremony manners.
        </p>
        <p>Specific games remain classified.</p>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      {designs.map((design) => (
        <Route key={design.path} path={design.path} element={<DesignPage design={design} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
