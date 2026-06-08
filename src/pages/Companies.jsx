import { useState, useRef } from 'react';
import companies from '../data/companies.json';
import { getGradeColor } from '../utils/scoring';

const FILTERS = [
  { key: 'all', label: 'All companies' },
  { key: 'wage', label: 'Best wage' },
  { key: 'security', label: 'Best security' },
  { key: 'balance', label: 'Best balance' },
  { key: 'growth', label: 'Best growth' },
];

function sortCompanies(list, filter) {
  if (filter === 'all') return list;
  const key = {
    wage: 'wageScore',
    security: 'securityScore',
    balance: 'balanceScore',
    growth: 'growthScore',
  }[filter];
  return [...list].sort((a, b) => b[key] - a[key]);
}

function filterByQuery(list, query) {
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(
    c => c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q)
  );
}

export default function Companies() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const sorted = sortCompanies(companies, activeFilter);
  const visible = filterByQuery(sorted, query);

  return (
    <div style={{ padding: '20px 24px' }}>
      {/* Search bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1.5px solid #111827',
          backgroundColor: '#FFFFFF',
          padding: '0 12px',
          marginBottom: '16px',
          maxWidth: '420px',
        }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by company name or sector…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontFamily: 'Inter', fontSize: '14px', color: '#111827',
            backgroundColor: 'transparent', padding: '10px 0',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9CA3AF', fontSize: '16px', padding: '0', lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(({ key, label }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                padding: '6px 14px',
                border: `1px solid ${isActive ? '#0C3D2E' : '#E2DDD4'}`,
                backgroundColor: isActive ? '#0C3D2E' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#6B7280',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.borderColor = '#0C3D2E';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.borderColor = '#E2DDD4';
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Result count when searching */}
      {query && (
        <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF', marginBottom: '14px' }}>
          {visible.length === 0
            ? 'No companies match that search.'
            : `${visible.length} company${visible.length !== 1 ? 'ies' : 'y'} found`}
        </p>
      )}

      {/* Company grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {visible.map(company => {
          const showPositions = company.positions.slice(0, 3);
          const remaining = company.positions.length - 3;

          return (
            <div
              key={company.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2DDD4',
                padding: '14px',
                transition: 'border-color 0.15s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0C3D2E'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DDD4'; }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    flexShrink: 0,
                    backgroundColor: company.accentBg,
                    color: company.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  {company.initials}
                </div>
                {/* Name + sector */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                      marginBottom: '2px',
                      lineHeight: '1.3',
                    }}
                  >
                    {company.name}
                  </p>
                  <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#9CA3AF' }}>
                    {company.sector}
                  </p>
                </div>
              </div>

              {/* Grade row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { label: 'Wage', value: company.wageGrade },
                  { label: 'Security', value: company.securityGrade },
                  { label: 'Balance', value: `${company.balanceRating}/10` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B7280' }}>
                      {label}{' '}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: label !== 'Balance' ? getGradeColor(value) : '#111827',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Positions */}
              <div
                style={{
                  borderTop: '1px solid #F0EDE8',
                  paddingTop: '8px',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {showPositions.map(pos => (
                    <span
                      key={pos}
                      style={{
                        backgroundColor: '#F5F2EC',
                        padding: '2px 7px',
                        fontFamily: 'Inter',
                        fontSize: '10px',
                        color: '#6B7280',
                        borderRadius: '2px',
                        display: 'inline-block',
                      }}
                    >
                      {pos}
                    </span>
                  ))}
                  {remaining > 0 && (
                    <span
                      style={{
                        backgroundColor: '#F5F2EC',
                        padding: '2px 7px',
                        fontFamily: 'Inter',
                        fontSize: '10px',
                        color: '#9CA3AF',
                        borderRadius: '2px',
                        display: 'inline-block',
                      }}
                    >
                      +{remaining} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
