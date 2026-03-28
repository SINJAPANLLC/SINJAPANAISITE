const LOGOS = [
  {
    src: "https://s3-ap-northeast-1.amazonaws.com/s3.peraichi.com/userData/5b45aaad-02a4-4454-911d-14fb0a0000c5/img/1c9b1920-d996-013e-3faf-0a58a9feac02/70617d441cf711e88062963aecd2c947.jpg",
    alt: "日本工業出版",
  },
  {
    src: "https://s3-ap-northeast-1.amazonaws.com/s3.peraichi.com/userData/5b45aaad-02a4-4454-911d-14fb0a0000c5/img/095c3f70-d994-013e-82c3-0a58a9feac02/m_logo.png",
    alt: "PR TIMES",
  },
  {
    src: "https://s3-ap-northeast-1.amazonaws.com/s3.peraichi.com/userData/5b45aaad-02a4-4454-911d-14fb0a0000c5/img/0f974c20-d994-013e-82c4-0a58a9feac02/nikko-logo.jpg",
    alt: "テレビプラス",
  },
  {
    src: "https://s3-ap-northeast-1.amazonaws.com/s3.peraichi.com/userData/5b45aaad-02a4-4454-911d-14fb0a0000c5/img/1412ad40-d994-013e-82c6-0a58a9feac02/tmp-75613e906c3e5ab6ea00c4f39150e44f-cff486a9ddccba3a97b5c4297fb3c057.jpg",
    alt: "毎日新聞社",
  },
];

const SLIDE_W = 200;
const SLIDE_H = 120;

const BASE_MIN_PX = 2400;
const reps = Math.ceil(BASE_MIN_PX / (LOGOS.length * SLIDE_W));
const baseSet = Array.from({ length: reps }, () => LOGOS).flat();
const track = [...baseSet, ...baseSet];
const translatePx = baseSet.length * SLIDE_W;
const SPEED = `${Math.round(translatePx / 40)}s`;

export function LogoSlider() {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <style>{`
        @keyframes sin-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${translatePx}px); }
        }
        .sin-slide-track {
          display: flex;
          width: ${track.length * SLIDE_W}px;
          animation: sin-scroll ${SPEED} linear infinite;
          will-change: transform;
        }
      `}</style>

      <div
        style={{
          height: `${SLIDE_H}px`,
          overflow: "hidden",
          width: "100%",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div className="sin-slide-track">
          {track.map((logo, i) => (
            <div
              key={i}
              style={{
                width: `${SLIDE_W}px`,
                height: `${SLIDE_H}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  maxWidth: "160px",
                  maxHeight: "80px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
