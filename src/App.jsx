import { Navigate, Route, Routes } from "react-router-dom";

const olympicColors = ["#0085c7", "#f4c300", "#111111", "#009f3d", "#df0024"];
const letters = "LORYMPIADE".split("");
const centerImage = `${import.meta.env.BASE_URL}images/lorympiade-center.png`;

function ArcTitle() {
  return (
    <div className="arc-title" aria-label="Lorympiade">
      {letters.map((letter, index) => {
        const angle = -56 + index * 11.2;
        return (
          <span
            key={`${letter}-${index}`}
            className="arc-letter"
            style={{
              color: olympicColors[index % olympicColors.length],
              transform: `translateX(-50%) rotate(${angle}deg) translateY(-174px)`,
            }}
          >
            <span className="arc-letter-inner" style={{ transform: `rotate(${-angle}deg)` }}>
              {letter}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function Poster() {
  return (
    <main className="poster">
      <section className="figure-stage">
        <ArcTitle />
        <img className="figure-image" src={centerImage} alt="Lorympiade portrait" />
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
