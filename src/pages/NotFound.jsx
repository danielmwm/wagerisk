import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'Inter',
          fontSize: '10px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
          color: '#9CA3AF',
          marginBottom: '14px',
        }}
      >
        404
      </p>
      <h1
        className="font-playfair"
        style={{
          fontSize: '28px',
          fontWeight: 500,
          color: '#111827',
          marginBottom: '10px',
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontFamily: 'Inter',
          fontSize: '13px',
          color: '#9CA3AF',
          marginBottom: '28px',
          lineHeight: '1.6',
          maxWidth: '320px',
        }}
      >
        The page you're looking for doesn't exist. You may have mistyped the address or the page has moved.
      </p>
      <Link
        to="/search"
        style={{
          backgroundColor: '#0C3D2E',
          color: '#FFFFFF',
          padding: '10px 20px',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1B6B4E'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0C3D2E'; }}
      >
        Go to Search
      </Link>
    </div>
  );
}
