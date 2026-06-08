import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';

const TABS = [
  { label: 'Personalized', to: '/personalized' },
  { label: 'Search', to: '/search' },
  { label: 'Companies', to: '/companies' },
  { label: 'Compare', to: '/compare' },
  { label: 'Sources', to: '/sources' },
];

export default function Navbar() {
  return (
    <header style={{ borderBottom: '1px solid #E2DDD4', backgroundColor: '#FAFAF6' }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px 12px',
          borderBottom: '2px solid #111827',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <Logo size={28} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0' }}>
            <span
              className="font-playfair"
              style={{ fontSize: '19px', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}
            >
              Wage
            </span>
            <span
              className="font-playfair"
              style={{ fontSize: '19px', fontWeight: 600, color: '#0C3D2E', letterSpacing: '-0.01em' }}
            >
              Risk
            </span>
            <sup
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                color: '#9CA3AF',
                marginLeft: '1px',
                top: '-6px',
                position: 'relative',
              }}
            >
              .io
            </sup>
          </div>
        </Link>

        {/* Tagline */}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            color: '#9CA3AF',
          }}
        >
          Canada's wage & risk intelligence tool
        </span>
      </div>

      {/* Tab navigation */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {TABS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'inline-block',
              padding: '11px 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              color: isActive ? '#0C3D2E' : '#9CA3AF',
              borderBottom: isActive ? '2px solid #0C3D2E' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'color 0.15s ease, border-color 0.15s ease',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = '#374151';
              }
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.color = '#9CA3AF';
              }
            }}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
