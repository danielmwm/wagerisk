import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import careers from '../data/careers.json';
import GradeBadge from '../components/GradeBadge';
import { calculateWeightedScore, getLetterGrade, getGradeColor } from '../utils/scoring';

const SECTORS = [
  'Any sector', 'Technology', 'Healthcare', 'Finance', 'Skilled Trades',
  'Education', 'Engineering', 'Media', 'Business', 'Creative',
  'Social Services', 'Hospitality', 'Transportation', 'Manufacturing', 'Trades',
];

const SLIDERS = [
  { key: 'security', label: 'Job Security', default: 80 },
  { key: 'wage', label: 'Wage / Salary', default: 70 },
  { key: 'growth', label: 'Growth Potential', default: 60 },
  { key: 'workLife', label: 'Work-Life Balance', default: 50 },
  { key: 'automation', label: 'Future-Proof (Hard to Automate)', default: 55 },
];

const inputStyle = {
  width: '100%',
  border: '1px solid #E2DDD4',
  borderRadius: '0',
  padding: '10px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  color: '#111827',
  backgroundColor: '#FFFFFF',
  outline: 'none',
};

export default function Personalized() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('Any sector');
  const [weights, setWeights] = useState(
    Object.fromEntries(SLIDERS.map(s => [s.key, s.default]))
  );
  const [results, setResults] = useState(null);

  function handleFind() {
    let pool = [...careers];
    if (sector !== 'Any sector') {
      pool = pool.filter(c => c.sector === sector);
    }
    const scored = pool.map(c => ({
      ...c,
      weightedScore: calculateWeightedScore(c, weights),
    }));
    scored.sort((a, b) => b.weightedScore - a.weightedScore);
    setResults(scored.slice(0, 5));
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
        }}
      >
        {/* ── Left column ── */}
        <div style={{ paddingRight: '28px' }}>
          {/* Section label */}
          <p className="section-label" style={{ marginBottom: '10px' }}>
            Your current path or education
          </p>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Computer Science student, or Marketing professional…"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#0C3D2E'; }}
            onBlur={e => { e.target.style.borderColor = '#E2DDD4'; }}
          />

          <p className="section-label" style={{ marginTop: '18px', marginBottom: '10px' }}>
            Target sector
          </p>
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            style={{ ...inputStyle, backgroundColor: '#FFFFFF' }}
          >
            {SECTORS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #E2DDD4', margin: '22px 0 18px' }} />

          <p className="section-label" style={{ marginBottom: '16px' }}>
            What do you value most? Drag to adjust
          </p>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SLIDERS.map(({ key, label }) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#374151' }}>{label}</span>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#0C3D2E',
                    }}
                  >
                    {weights[key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[key]}
                  onChange={e => setWeights(w => ({ ...w, [key]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleFind}
            style={{
              marginTop: '24px',
              width: '100%',
              backgroundColor: '#0C3D2E',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              borderRadius: '0',
            }}
            onMouseEnter={e => { e.target.style.backgroundColor = '#1B6B4E'; }}
            onMouseLeave={e => { e.target.style.backgroundColor = '#0C3D2E'; }}
          >
            Find My Careers →
          </button>
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            borderLeft: '1px solid #E2DDD4',
            paddingLeft: '28px',
          }}
        >
          <p className="section-label" style={{ marginBottom: '16px' }}>
            Recommended careers
          </p>

          {results === null ? (
            <p
              style={{
                fontFamily: 'Inter',
                fontSize: '13px',
                color: '#9CA3AF',
                lineHeight: '1.6',
                marginTop: '8px',
              }}
            >
              Adjust the sliders to reflect what matters most to you, then click{' '}
              <strong style={{ fontWeight: 500, color: '#6B7280' }}>Find My Careers</strong> to see
              your top-matched occupations ranked by a weighted score across wage, security, growth,
              work-life balance, and how hard the job is to automate.
            </p>
          ) : results.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF', lineHeight: '1.6' }}>
              No careers found in that sector. Try selecting "Any sector".
            </p>
          ) : (
            <div>
              {results.map((career, i) => {
                const overallGrade = getLetterGrade(career.weightedScore);
                return (
                  <div
                    key={career.id}
                    onClick={() => navigate(`/search?career=${career.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 0',
                      borderBottom: '1px solid #F0EDE8',
                      cursor: 'pointer',
                      gap: '14px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FAFAF6'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Rank */}
                    <span
                      className="font-playfair"
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#E2DDD4',
                        minWidth: '24px',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: 'Inter',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#111827',
                          marginBottom: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {career.name}
                      </p>
                      <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#9CA3AF' }}>
                        <span style={{ color: getGradeColor(career.wageGrade), fontWeight: 500 }}>
                          W: {career.wageGrade}
                        </span>
                        {' · '}
                        <span style={{ color: getGradeColor(career.securityGrade), fontWeight: 500 }}>
                          S: {career.securityGrade}
                        </span>
                        {' · '}
                        {career.sector}
                      </p>
                    </div>

                    {/* Score */}
                    <span
                      className="font-playfair tabular"
                      style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#0C3D2E',
                        flexShrink: 0,
                      }}
                    >
                      {career.weightedScore}
                    </span>
                  </div>
                );
              })}

              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: '11px',
                  color: '#9CA3AF',
                  marginTop: '14px',
                  lineHeight: '1.5',
                }}
              >
                Scores are weighted composites. Click any career to view full wage and security data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
