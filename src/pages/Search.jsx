import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import careers from '../data/careers.json';
import GradeBadge from '../components/GradeBadge';
import { getGradeColor, adjustedWage, PROVINCE_MULTIPLIERS } from '../utils/scoring';

const PROVINCES = Object.keys(PROVINCE_MULTIPLIERS);

const QUICK_PICKS = [
  'software-developer', 'registered-nurse', 'physician', 'electrician',
  'data-scientist', 'accountant', 'elementary-teacher', 'journalist',
];

function fuzzyMatch(name, query) {
  if (!query) return true;
  return name.toLowerCase().includes(query.toLowerCase());
}

function OutlookDot({ outlook }) {
  const colors = { Good: '#15803D', Fair: '#D97706', Limited: '#B91C1C' };
  return (
    <span style={{ color: colors[outlook] ?? '#6B7280', fontWeight: 500 }}>
      {outlook}
    </span>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2DDD4',
          padding: '9px 12px',
          fontFamily: 'Inter',
          fontSize: '12px',
          maxWidth: '180px',
        }}
      >
        <p style={{ fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{d.name}</p>
        <p style={{ color: '#6B7280' }}>
          <span style={{ color: getGradeColor(d.wageGrade) }}>W: {d.wageGrade}</span>
          {' · '}
          <span style={{ color: getGradeColor(d.securityGrade) }}>S: {d.securityGrade}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('Ontario');
  const [selected, setSelected] = useState(() => {
    const id = searchParams.get('career');
    return careers.find(c => c.id === id) ?? careers[0];
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const id = searchParams.get('career');
    if (id) {
      const c = careers.find(c => c.id === id);
      if (c) setSelected(c);
    }
  }, [searchParams]);

  const filtered = query
    ? careers.filter(c => fuzzyMatch(c.name, query))
    : [];

  const wage = adjustedWage(selected.medianHourly, province);

  const similarCareers = careers
    .filter(c => c.id !== selected.id)
    .sort((a, b) => {
      const distA = Math.abs(a.wageScore - selected.wageScore) + Math.abs(a.securityScore - selected.securityScore);
      const distB = Math.abs(b.wageScore - selected.wageScore) + Math.abs(b.securityScore - selected.securityScore);
      return distA - distB;
    })
    .slice(0, 4);

  function selectCareer(career) {
    setSelected(career);
    setQuery('');
    setShowDropdown(false);
    navigate(`/search?career=${career.id}`, { replace: true });
  }

  return (
    <div>
      {/* ── Search Bar Row ── */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          padding: '16px 24px',
          borderBottom: '1px solid #E2DDD4',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Search input */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            border: '1.5px solid #111827',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
          }}
        >
          {/* Search icon */}
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Search any Canadian occupation — nurse, software developer, electrician…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: 'Inter',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'transparent',
              padding: '10px 0',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setShowDropdown(false); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9CA3AF',
                fontSize: '16px',
                padding: '0',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && filtered.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '-1.5px',
                right: '-1.5px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #111827',
                borderTop: 'none',
                zIndex: 100,
                maxHeight: '240px',
                overflowY: 'auto',
              }}
            >
              {filtered.map(c => (
                <div
                  key={c.id}
                  onMouseDown={() => selectCareer(c)}
                  style={{
                    padding: '9px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #F0EDE8',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    color: '#111827',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F2EC'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: '#9CA3AF', marginLeft: '8px', fontSize: '11px' }}>{c.sector}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Province selector */}
        <select
          value={province}
          onChange={e => setProvince(e.target.value)}
          style={{
            border: '1px solid #E2DDD4',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Inter',
            fontSize: '12px',
            color: '#374151',
            padding: '10px 30px 10px 12px',
            outline: 'none',
            borderRadius: '0',
            minWidth: '160px',
          }}
        >
          {PROVINCES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          borderBottom: '1px solid #E2DDD4',
        }}
      >
        {/* ── Left: Scatter Plot ── */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #E2DDD4' }}>
          <p className="section-label" style={{ marginBottom: '14px' }}>
            Career landscape — wage vs. security
          </p>

          <div style={{ position: 'relative' }}>
            {/* Y-axis labels */}
            <div
              style={{
                position: 'absolute',
                left: '-2px',
                top: '0',
                bottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingRight: '6px',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              {['High', 'Med', 'Low'].map(l => (
                <span key={l} style={{ fontSize: '10px', color: '#B5AFA3', fontFamily: 'Inter' }}>{l}</span>
              ))}
            </div>

            <div style={{ marginLeft: '28px' }}>
              <div style={{ position: 'relative' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
                    style={{ backgroundColor: '#F5F2EC', border: '1px solid #E2DDD4' }}
                  >
                    <CartesianGrid
                      strokeDasharray="none"
                      stroke="#E2DDD4"
                      strokeWidth={0}
                    />
                    {/* Custom reference lines via a simple overlay approach */}
                    <XAxis
                      dataKey="securityScore"
                      type="number"
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="wageScore"
                      type="number"
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Scatter
                      data={careers}
                      onClick={(d) => selectCareer(careers.find(c => c.id === d.id))}
                    >
                      {careers.map(c => (
                        <Cell
                          key={c.id}
                          fill={c.id === selected.id ? '#0C3D2E' : 'rgba(156,163,175,0.45)'}
                          stroke={c.id === selected.id ? '#0C3D2E' : 'rgba(156,163,175,0.6)'}
                          strokeWidth={1}
                          r={c.id === selected.id ? 9 : 5}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>

                {/* Quadrant overlays */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '10px 10px 10px 0',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                >
                  {/* Dashed center lines */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      borderLeft: '1px dashed #D1CCC0',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      borderTop: '1px dashed #D1CCC0',
                    }}
                  />
                  {/* Quadrant labels */}
                  <span
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '8px',
                      fontSize: '9px',
                      fontFamily: 'Inter',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#C5BFB7',
                    }}
                  >
                    Sweet spot
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '6px',
                      top: '8px',
                      fontSize: '9px',
                      fontFamily: 'Inter',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#C5BFB7',
                    }}
                  >
                    Risky &amp; rewarding
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      right: '6px',
                      bottom: '12px',
                      fontSize: '9px',
                      fontFamily: 'Inter',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#C5BFB7',
                    }}
                  >
                    Safe &amp; modest
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '6px',
                      bottom: '12px',
                      fontSize: '9px',
                      fontFamily: 'Inter',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#C5BFB7',
                    }}
                  >
                    Tough territory
                  </span>
                </div>
              </div>

              {/* X-axis labels */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '6px',
                  padding: '0 4px',
                }}
              >
                <span style={{ fontSize: '10px', color: '#B5AFA3', fontFamily: 'Inter' }}>Low security</span>
                <span style={{ fontSize: '10px', color: '#B5AFA3', fontFamily: 'Inter' }}>← Job security →</span>
                <span style={{ fontSize: '10px', color: '#B5AFA3', fontFamily: 'Inter' }}>High security</span>
              </div>
            </div>
          </div>

          {/* Quick-select pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
            {QUICK_PICKS.map(id => {
              const c = careers.find(c => c.id === id);
              if (!c) return null;
              const isActive = c.id === selected.id;
              return (
                <button
                  key={id}
                  onClick={() => selectCareer(c)}
                  style={{
                    border: `1px solid ${isActive ? '#0C3D2E' : '#E2DDD4'}`,
                    backgroundColor: isActive ? '#0C3D2E' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#6B7280',
                    padding: '3px 9px',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Rating Card ── */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 18px' }}>
          {/* Title */}
          <h1
            className="font-playfair"
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: '#111827',
              lineHeight: '1.2',
              marginBottom: '4px',
            }}
          >
            {selected.name}
          </h1>
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '14px',
            }}
          >
            {selected.noc} · {selected.sector} · {province}
          </p>

          <div style={{ borderTop: '1px solid #E2DDD4', marginBottom: '14px' }} />

          {/* Grade pair */}
          <div style={{ display: 'flex', gap: '1px', marginBottom: '14px' }}>
            {/* Wage grade */}
            <div
              style={{
                flex: 1,
                border: '1px solid #E2DDD4',
                padding: '11px 12px',
              }}
            >
              <p
                style={{
                  fontSize: '9px',
                  fontFamily: 'Inter',
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color: '#9CA3AF',
                  marginBottom: '5px',
                }}
              >
                Wage Grade
              </p>
              <GradeBadge grade={selected.wageGrade} size="lg" />
              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: '10px',
                  color: '#9CA3AF',
                  marginTop: '5px',
                }}
              >
                ${wage}/hr median
              </p>
            </div>
            {/* Security grade */}
            <div
              style={{
                flex: 1,
                border: '1px solid #E2DDD4',
                borderLeft: 'none',
                padding: '11px 12px',
              }}
            >
              <p
                style={{
                  fontSize: '9px',
                  fontFamily: 'Inter',
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color: '#9CA3AF',
                  marginBottom: '5px',
                }}
              >
                Security Grade
              </p>
              <GradeBadge grade={selected.securityGrade} size="lg" />
              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: '10px',
                  color: '#9CA3AF',
                  marginTop: '5px',
                }}
              >
                {selected.unemploymentRate} unemployment
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2DDD4', marginBottom: '12px' }} />

          {/* Stats table */}
          <div>
            {[
              { label: 'Median hourly wage', value: `$${wage}/hr` },
              { label: '2024–28 outlook', value: <OutlookDot outlook={selected.outlook} />, isComponent: true },
              { label: 'Unemployment rate', value: selected.unemploymentRate },
              { label: 'Permanent employment', value: selected.permanentPercent },
              { label: 'AI proof rating', value: selected.automationRisk },
            ].map(({ label, value, isComponent }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #F0EDE8' : 'none',
                }}
              >
                <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280' }}>{label}</span>
                {isComponent ? (
                  <span style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500 }}>{value}</span>
                ) : (
                  <span style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, color: '#111827' }}>
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div
            style={{
              borderLeft: '2px solid #0C3D2E',
              paddingLeft: '12px',
              paddingTop: '9px',
              paddingBottom: '9px',
              marginTop: '14px',
            }}
          >
            <p
              style={{
                fontSize: '9px',
                fontFamily: 'Inter',
                textTransform: 'uppercase',
                letterSpacing: '0.09em',
                color: '#0C3D2E',
                marginBottom: '5px',
              }}
            >
              Verdict
            </p>
            <p
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                color: '#374151',
                lineHeight: '1.6',
              }}
            >
              {selected.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* ── Similar Careers Row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: '#F5F2EC',
          borderTop: '1px solid #E2DDD4',
          borderBottom: '1px solid #E2DDD4',
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            borderRight: '1px solid #E2DDD4',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <p className="section-label">Similar</p>
        </div>
        <div style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
          {similarCareers.map((c, i) => (
            <div
              key={c.id}
              onClick={() => selectCareer(c)}
              style={{
                padding: '8px 14px',
                borderRight: i < similarCareers.length - 1 ? '1px solid #E2DDD4' : 'none',
                cursor: 'pointer',
                minWidth: '140px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EDE9E0'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#111827',
                  marginBottom: '3px',
                }}
              >
                {c.name}
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#9CA3AF' }}>
                <span style={{ color: getGradeColor(c.wageGrade), fontWeight: 500 }}>W: {c.wageGrade}</span>
                {' · '}
                <span style={{ color: getGradeColor(c.securityGrade), fontWeight: 500 }}>S: {c.securityGrade}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
