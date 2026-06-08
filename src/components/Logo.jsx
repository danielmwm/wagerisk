export default function Logo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Axes */}
      <line x1="4" y1="24" x2="24" y2="24" stroke="#D1CCC0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="24" x2="4" y2="4" stroke="#D1CCC0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gray dots — bottom left */}
      <circle cx="8" cy="19" r="1.8" fill="#B5AFA3" />
      <circle cx="11" cy="22" r="1.8" fill="#B5AFA3" />
      <circle cx="10" cy="16" r="1.8" fill="#B5AFA3" />
      {/* Green dots — top right (sweet spot) */}
      <circle cx="18" cy="9" r="2" fill="#0C3D2E" />
      <circle cx="21" cy="12" r="2" fill="#0C3D2E" />
      {/* Lens circle around sweet spot */}
      <circle cx="19.5" cy="10.5" r="6" stroke="#0C3D2E" strokeWidth="1.8" fill="none" />
    </svg>
  );
}
