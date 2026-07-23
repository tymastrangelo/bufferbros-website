// Wheel.jsx — self-contained spinning car-wheel loader (no CSS file needed)
export default function Wheel({ size = 28, className = '' }) {
  const spokes = Array.from({ length: 5 }, (_, i) => i * 72);
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} role="status" aria-label="Loading">
      <style>{`
        .wheel-spin { animation: wheel-turn 0.9s linear infinite; }
        @keyframes wheel-turn { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .wheel-spin { animation: none; } }
      `}</style>
      {/* tire */}
      <circle cx="24" cy="24" r="20.5" fill="none" stroke="#1d2634" strokeWidth="6.5" />
      {/* tread glint */}
      <circle cx="24" cy="24" r="20.5" fill="none" stroke="#3b4c63" strokeWidth="1.4"
        strokeDasharray="10 119" strokeLinecap="round" />
      {/* rim + spokes — this part rotates */}
      <g className="wheel-spin" style={{ transformOrigin: '24px 24px' }}>
        <circle cx="24" cy="24" r="14.5" fill="none" stroke="#c9d3df" strokeWidth="2.4" />
        {spokes.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 24 24)`}>
            <path d="M22.9 24 L21.6 10.6 M25.1 24 L26.4 10.6" stroke="#c9d3df" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ))}
        <circle cx="24" cy="24" r="4.6" fill="#c9d3df" />
        <circle cx="24" cy="24" r="2.2" fill="#2563eb" />
        <circle cx="24" cy="11.4" r="1.5" fill="#8b93a1" />
      </g>
    </svg>
  );
}
