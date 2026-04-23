import { NavLink, Navigate, Route, Routes } from "react-router-dom";

const ringColors = ["ring-blue", "ring-yellow", "ring-black", "ring-green", "ring-red"];

const designs = [
  {
    path: "/1",
    number: "01",
    name: "Poster Night",
    theme: "Ceremonial poster with one very serious headline and absolutely unserious stakes.",
    hero: (
      <>
        <p className="eyebrow">Invitation to the</p>
        <h1 className="display">
          <span className="ring-blue">lorym</span>
          <span className="ring-yellow">pic</span>{" "}
          <span className="ring-red">games</span>
        </h1>
        <p className="lede">
          The <span className="ring-green">100th Strava anniversary streak</span> will be honored with
          a birthday-party decathlon for adults who should know better.
        </p>
      </>
    ),
    body: (
      <div className="poster-grid">
        <div className="frame soft">
          <p className="label">Occasion</p>
          <p>Birthday energy. Olympic ceremony. Childhood logic.</p>
        </div>
        <div className="frame badge-frame">
          <div className="badge">
            <span>100</span>
            <small>streak years*</small>
          </div>
          <p className="micro">*emotionally accurate, historically elastic</p>
        </div>
        <div className="frame soft">
          <p className="label">Judging</p>
          <p>Precision, chaos control, commitment to whimsy, and elite cake diplomacy.</p>
        </div>
      </div>
    ),
  },
  {
    path: "/2",
    number: "02",
    name: "Bracket Club",
    theme: "A minimalist tournament board for tiny acts of greatness.",
    hero: (
      <>
        <p className="eyebrow">Opening Ceremony</p>
        <h1 className="display tighter">
          <span className="ring-yellow">Lorympic</span>{" "}
          <span className="ring-blue">Games</span>
        </h1>
        <p className="lede">
          One birthday party. Five mysterious disciplines. Zero respectable athletic metrics.
        </p>
      </>
    ),
    body: (
      <div className="bracket">
        {[
          "Arrival with maximum ceremonial confidence",
          "Rules explained in a voice far too official",
          "Rotating rounds of highly questionable glory",
          "Podium feelings without useful life application",
        ].map((item, index) => (
          <div className="frame bracket-card" key={item}>
            <span className={`chip ${ringColors[index % ringColors.length]}`}>Round {index + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    path: "/3",
    number: "03",
    name: "Ribbon Invite",
    theme: "A layered invitation where the schedule feels more elegant than the event deserves.",
    hero: (
      <>
        <p className="eyebrow">Dress code</p>
        <h1 className="display verticalish">
          <span className="ring-red">Birthday</span>{" "}
          <span className="ring-green">party</span>{" "}
          <span className="ring-blue">Olympics</span>
        </h1>
        <p className="lede">
          Please arrive prepared to be <span className="ring-yellow">briefly legendary</span>.
        </p>
      </>
    ),
    body: (
      <div className="ribbon-stack">
        {[
          "Guests become contenders the second they walk in.",
          "Every event is tiny, theatrical, and wildly over-celebrated.",
          "The medals are symbolic. The bragging rights are immediate.",
        ].map((item, index) => (
          <article className="frame ribbon" key={item} style={{ "--tilt": `${index * 2 - 2}deg` }}>
            <span className={`index ${ringColors[(index + 2) % ringColors.length]}`}>0{index + 1}</span>
            <p>{item}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    path: "/4",
    number: "04",
    name: "Envelope",
    theme: "A formal invitation disguised as a cake-fueled secret society summons.",
    hero: (
      <>
        <p className="eyebrow">By royal-ish decree</p>
        <h1 className="display">
          The <span className="ring-black outline-text">Lorympic</span>{" "}
          <span className="ring-red">Games</span>
        </h1>
        <p className="lede">
          Convening in honor of the <span className="ring-blue">100th anniversary streak</span> of Strava,
          now reinterpreted as a deeply unserious birthday institution.
        </p>
      </>
    ),
    body: (
      <div className="envelope-layout">
        <div className="frame envelope-card">
          <p className="label">What this is</p>
          <p>A tiny gala for people who peak when handed a paper crown.</p>
        </div>
        <div className="frame seal-card">
          <div className="seal">
            <span className="ring-yellow">RSVP</span>
          </div>
          <p>Attendance confirms bravery, curiosity, and a tolerance for ceremonial nonsense.</p>
        </div>
      </div>
    ),
  },
  {
    path: "/5",
    number: "05",
    name: "Scoreboard",
    theme: "A dramatic ledger for evaluating profoundly small accomplishments.",
    hero: (
      <>
        <p className="eyebrow">Closing arguments</p>
        <h1 className="display">
          <span className="ring-green">Lorympic</span>{" "}
          <span className="ring-yellow">birthday</span>{" "}
          <span className="ring-blue">games</span>
        </h1>
        <p className="lede">
          The only competition where childish excellence, comic timing, and vibe management may decide the podium.
        </p>
      </>
    ),
    body: (
      <div className="scoreboard">
        {[
          ["01", "Form", "Can you look astonishingly prepared?"],
          ["02", "Focus", "Can you stay composed while everything gets sillier?"],
          ["03", "Flair", "Can you win the room before anyone knows the rules?"],
        ].map(([rank, title, text], index) => (
          <div className="frame score-card" key={rank}>
            <div className="score-head">
              <span className={`rank ${ringColors[index]}`}>{rank}</span>
              <span>{title}</span>
            </div>
            <p>{text}</p>
          </div>
        ))}
      </div>
    ),
  },
];

function Gallery() {
  return (
    <main className="app-shell">
      <section className="home frame">
        <p className="eyebrow">Choose a route</p>
        <h1 className="display home-title">
          <span className="ring-blue">lorym</span>
          <span className="ring-yellow">pic</span>{" "}
          <span className="ring-red">games</span>
        </h1>
        <p className="lede">
          Five invitation studies for a dark, minimalist, color-on-type-only birthday Olympics.
        </p>
        <div className="route-list">
          {designs.map((design) => (
            <NavLink key={design.path} className="route-card frame" to={design.path}>
              <span className="route-number">{design.number}</span>
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
    <main className={`app-shell variant-${design.number}`}>
      <nav className="top-nav frame">
        <NavLink className="brand" to="/">
          Lorympic Games
        </NavLink>
        <div className="nav-links">
          {designs.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "mini-link active" : "mini-link")}
            >
              {item.number}
            </NavLink>
          ))}
        </div>
      </nav>
      <section className="hero frame">
        <div className="hero-copy">{design.hero}</div>
        <div className="hero-side">
          <p className="label">Theme</p>
          <p>{design.theme}</p>
          <div className="rings-row" aria-hidden="true">
            {ringColors.map((color) => (
              <span key={color} className={`ring-word ${color}`}>
                ●
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="body-section">{design.body}</section>
      <footer className="footer-note">
        <p>
          Birthday party ceremony for the <span className="ring-red">100th Strava anniversary streak</span>.
        </p>
        <p>Specific games remain classified until the grand unveiling.</p>
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
