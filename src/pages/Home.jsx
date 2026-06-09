import { Link } from 'react-router-dom';
import careers from '../data/careers.json';
import companies from '../data/companies.json';
import { getGradeColor } from '../utils/scoring';

/* ── Scatter SVG – all 79 careers plotted by actual scores ── */
function CareerScatterSVG() {
  const W = 460, H = 310;
  const pad = { t: 24, r: 20, b: 30, l: 20 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  function toX(sec) { return pad.l + (sec / 100) * plotW; }
  function toY(wage) { return pad.t + plotH - (wage / 100) * plotH; }

  const labelCareers = [
    'physician', 'data-scientist', 'journalist', 'chef',
    'registered-nurse', 'real-estate-agent', 'software-developer',
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ display: 'block' }}
      aria-label="Career landscape scatter plot"
    >
      {/* Plot background */}
      <rect x={pad.l} y={pad.t} width={plotW} height={plotH} fill="#1A2A1E" rx="0" />

      {/* Quadrant lines */}
      <line x1={toX(50)} y1={pad.t} x2={toX(50)} y2={pad.t + plotH}
        stroke="#2D4A35" strokeWidth="1" strokeDasharray="4 3" />
      <line x1={pad.l} y1={toY(50)} x2={pad.l + plotW} y2={toY(50)}
        stroke="#2D4A35" strokeWidth="1" strokeDasharray="4 3" />

      {/* Quadrant labels */}
      <text x={toX(75)} y={pad.t + 13} textAnchor="middle"
        fill="#3D6B4A" fontSize="8" fontFamily="Inter" letterSpacing="0.08em" textTransform="uppercase">
        SWEET SPOT
      </text>
      <text x={toX(25)} y={pad.t + 13} textAnchor="middle"
        fill="#3D4A3D" fontSize="8" fontFamily="Inter" letterSpacing="0.08em">
        RISKY &amp; REWARDING
      </text>
      <text x={toX(75)} y={pad.t + plotH - 6} textAnchor="middle"
        fill="#3D4A3D" fontSize="8" fontFamily="Inter" letterSpacing="0.08em">
        SAFE &amp; MODEST
      </text>
      <text x={toX(25)} y={pad.t + plotH - 6} textAnchor="middle"
        fill="#3D4A3D" fontSize="8" fontFamily="Inter" letterSpacing="0.08em">
        TOUGH TERRITORY
      </text>

      {/* All career dots */}
      {careers.map(c => {
        const isLabeled = labelCareers.includes(c.id);
        const x = toX(c.securityScore);
        const y = toY(c.wageScore);
        const color = c.wageGrade.startsWith('A') ? '#22C55E'
          : c.wageGrade.startsWith('B') ? '#60A5FA'
          : c.wageGrade.startsWith('C') ? '#FBBF24'
          : '#F87171';
        return (
          <g key={c.id}>
            {/* Glow ring for labeled */}
            {isLabeled && (
              <circle cx={x} cy={y} r="11" fill={color} opacity="0.12" />
            )}
            <circle
              cx={x} cy={y}
              r={isLabeled ? 6 : 4.5}
              fill={color}
              opacity={isLabeled ? 1 : 0.7}
            />
          </g>
        );
      })}

      {/* Labels for key careers */}
      {careers.filter(c => labelCareers.includes(c.id)).map(c => {
        const x = toX(c.securityScore);
        const y = toY(c.wageScore);
        const offsets = {
          'physician': [8, -9],
          'data-scientist': [8, -9],
          'journalist': [-6, 13],
          'chef': [0, 14],
          'registered-nurse': [8, 4],
          'real-estate-agent': [-6, 13],
          'software-developer': [8, -9],
        };
        const [dx, dy] = offsets[c.id] ?? [8, -8];
        const anchor = dx < 0 ? 'end' : 'start';
        const shortName = {
          'physician': 'Physician',
          'data-scientist': 'Data Scientist',
          'journalist': 'Journalist',
          'chef': 'Chef',
          'registered-nurse': 'Reg. Nurse',
          'real-estate-agent': 'Real Estate',
          'software-developer': 'Software Dev',
        }[c.id] ?? c.name;
        return (
          <text key={c.id}
            x={x + dx} y={y + dy}
            fill="rgba(255,255,255,0.65)"
            fontSize="9"
            fontFamily="Inter"
            fontWeight="500"
            textAnchor={anchor}
          >
            {shortName}
          </text>
        );
      })}

      {/* Axis labels */}
      <text x={pad.l} y={H - 6} fill="#4B6B55" fontSize="9" fontFamily="Inter">Low security</text>
      <text x={W / 2} y={H - 6} textAnchor="middle" fill="#4B6B55" fontSize="9" fontFamily="Inter">Job security →</text>
      <text x={W - pad.r} y={H - 6} textAnchor="end" fill="#4B6B55" fontSize="9" fontFamily="Inter">High security</text>

      {/* Legend */}
      {[
        { color: '#22C55E', label: 'A grade' },
        { color: '#60A5FA', label: 'B grade' },
        { color: '#FBBF24', label: 'C grade' },
        { color: '#F87171', label: 'D/F' },
      ].map(({ color, label }, i) => (
        <g key={label} transform={`translate(${pad.l + i * 84}, ${pad.t + 4})`}>
          <circle cx="5" cy="5" r="4" fill={color} opacity="0.85" />
          <text x="13" y="9" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="Inter">{label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Career grade card ── */
function CareerCard({ career }) {
  const gradeColor = getGradeColor(career.wageGrade);
  const gradeBg = career.wageGrade.startsWith('A') ? '#F0FDF4'
    : career.wageGrade.startsWith('B') ? '#EFF6FF'
    : career.wageGrade.startsWith('C') ? '#FFFBEB'
    : '#FEF2F2';

  return (
    <Link
      to={`/search?career=${career.id}`}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2DDD4',
        padding: '18px',
        textDecoration: 'none',
        display: 'block',
        transition: 'border-color 0.15s, transform 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#0C3D2E';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E2DDD4';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Grade badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '6px',
          backgroundColor: gradeBg,
          padding: '4px 10px',
          marginBottom: '12px',
        }}
      >
        <span
          className="font-playfair"
          style={{ fontSize: '28px', fontWeight: 600, color: gradeColor, lineHeight: 1 }}
        >
          {career.wageGrade}
        </span>
        <span style={{ fontFamily: 'Inter', fontSize: '9px', color: gradeColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          wage
        </span>
      </div>

      <p style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#111827', marginBottom: '4px', lineHeight: '1.3' }}>
        {career.name}
      </p>
      <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#9CA3AF', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {career.sector}
      </p>

      <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B7280' }}>
          ${career.medianHourly}/hr
        </span>
        <span style={{
          fontFamily: 'Inter', fontSize: '11px', fontWeight: 500,
          color: getGradeColor(career.securityGrade),
        }}>
          Security: {career.securityGrade}
        </span>
      </div>
    </Link>
  );
}

/* ── Feature block ── */
function Feature({ icon, title, description, to, cta }) {
  return (
    <div style={{ borderTop: '2px solid #E2DDD4', paddingTop: '20px' }}>
      <div style={{ marginBottom: '14px', color: '#0C3D2E' }}>{icon}</div>
      <h3
        className="font-playfair"
        style={{ fontSize: '17px', fontWeight: 600, color: '#111827', marginBottom: '8px', lineHeight: '1.3' }}
      >
        {title}
      </h3>
      <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280', lineHeight: '1.65', marginBottom: '16px' }}>
        {description}
      </p>
      <Link
        to={to}
        style={{
          fontFamily: 'Inter', fontSize: '12px', fontWeight: 500,
          color: '#0C3D2E', textDecoration: 'none',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}
        onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
        onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
      >
        {cta} →
      </Link>
    </div>
  );
}

/* ── Main ── */
const SHOWCASE_CAREERS = [
  'physician', 'software-developer', 'data-scientist',
  'registered-nurse', 'journalist', 'real-estate-agent',
];

export default function Home() {
  const showcaseCareers = SHOWCASE_CAREERS.map(id => careers.find(c => c.id === id)).filter(Boolean);

  return (
    <div>

      {/* ── 1. HERO ── */}
      <section
        style={{
          backgroundColor: '#111827',
          padding: '72px 48px 64px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '56px',
          alignItems: 'center',
          minHeight: '520px',
        }}
      >
        {/* Left: copy */}
        <div>
          <p
            style={{
              fontFamily: 'Inter', fontSize: '11px', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: '#4ADE80', marginBottom: '20px',
            }}
          >
            WageRisk.com — Canada's wage & risk intelligence tool
          </p>

          <h1
            className="font-playfair"
            style={{
              fontSize: '52px', fontWeight: 600, color: '#FFFFFF',
              lineHeight: '1.08', letterSpacing: '-0.02em', marginBottom: '20px',
            }}
          >
            Know where<br />
            every career<br />
            <span style={{ color: '#4ADE80' }}>stands.</span>
          </h1>

          <p
            style={{
              fontFamily: 'Inter', fontSize: '15px', color: 'rgba(255,255,255,0.55)',
              lineHeight: '1.65', marginBottom: '32px', maxWidth: '400px',
            }}
          >
            Wage grades, job security scores, and employment outlooks
            for 79 Canadian occupations — ranked, compared, and graded A+ to F.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link
              to="/personalized"
              style={{
                backgroundColor: '#0C3D2E', color: '#FFFFFF',
                padding: '13px 24px', fontFamily: 'Inter', fontSize: '13px',
                fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                textDecoration: 'none', display: 'inline-block',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1B6B4E'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0C3D2E'; }}
            >
              Get personalised results →
            </Link>
            <Link
              to="/search"
              style={{
                backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '13px 24px', fontFamily: 'Inter', fontSize: '13px',
                fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                textDecoration: 'none', display: 'inline-block',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              Search occupations
            </Link>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { n: '79', label: 'occupations graded' },
              { n: '97', label: 'top employers' },
              { n: '6', label: 'provinces' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div
                  className="font-playfair tabular"
                  style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1 }}
                >
                  {n}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: scatter SVG */}
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '0',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              padding: '10px 14px 4px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'Inter', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Career landscape — wage vs. security
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
              79 occupations
            </span>
          </div>
          <div style={{ padding: '12px 8px 8px' }}>
            <CareerScatterSVG />
          </div>
        </div>
      </section>

      {/* ── 2. STATS STRIP ── */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2DDD4',
          padding: '28px 48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
        }}
      >
        {[
          { value: 'A+ to F', label: 'Letter grades' },
          { value: '$20–$98', label: 'Hourly wage range' },
          { value: '0.8–9.2%', label: 'Unemployment range' },
          { value: '2024–25', label: 'Data currency' },
        ].map(({ value, label }, i) => (
          <div
            key={label}
            style={{
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid #E2DDD4' : 'none',
              padding: '0 24px',
            }}
          >
            <div
              className="font-playfair tabular"
              style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}
            >
              {value}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* ── 3. CAREER GRADE SHOWCASE ── */}
      <section style={{ backgroundColor: '#F5F2EC', padding: '52px 48px', borderBottom: '1px solid #E2DDD4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '6px' }}>Featured careers</p>
            <h2
              className="font-playfair"
              style={{ fontSize: '26px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}
            >
              Graded A+ to F — based on real data
            </h2>
          </div>
          <Link
            to="/search"
            style={{
              fontFamily: 'Inter', fontSize: '12px', fontWeight: 500,
              color: '#0C3D2E', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            View all 79 →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
          {showcaseCareers.map(c => <CareerCard key={c.id} career={c} />)}
        </div>
      </section>

      {/* ── 4. FEATURES ── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '52px 48px', borderBottom: '1px solid #E2DDD4' }}>
        <p className="section-label" style={{ marginBottom: '36px' }}>What WageRisk does</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          <Feature
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            }
            title="Personalised ranking"
            description="Drag five sliders to weight what matters most to you — security, wage, growth, work-life balance, and how hard the job is to automate — and get your top career matches ranked by a composite score."
            to="/personalized"
            cta="Try the matcher"
          />
          <Feature
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            }
            title="Wage & security intelligence"
            description="Search any Canadian occupation and see its full profile — wage grade, security grade, median hourly wage adjusted for your province, unemployment rate, and a plain-English verdict."
            to="/search"
            cta="Search occupations"
          />
          <Feature
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
                <rect x="7" y="3" width="4" height="4" rx="0" />
              </svg>
            }
            title="Side-by-side comparison"
            description="Put any two careers or employers side by side. A full comparison table highlights the better value in each row, and a shared scatter plot shows where they land in the career landscape."
            to="/compare"
            cta="Compare careers"
          />
        </div>
      </section>

      {/* ── 5. COMPANIES ── */}
      <section style={{ backgroundColor: '#0C3D2E', padding: '52px 48px', borderBottom: '1px solid #0A3326' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
          <div>
            <p
              style={{
                fontFamily: 'Inter', fontSize: '11px', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.09em',
                color: 'rgba(255,255,255,0.4)', marginBottom: '6px',
              }}
            >
              Employer profiles
            </p>
            <h2
              className="font-playfair"
              style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}
            >
              97 of Canada's top employers, graded.
            </h2>
          </div>
          <Link
            to="/companies"
            style={{
              fontFamily: 'Inter', fontSize: '12px', fontWeight: 500,
              color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '8px 16px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            View all employers →
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {companies.map(co => (
            <Link
              key={co.id}
              to="/companies"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '10px 14px',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px', height: '28px', flexShrink: 0,
                  backgroundColor: co.accentBg,
                  color: co.accentColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontSize: '9px', fontWeight: 500,
                }}
              >
                {co.initials}
              </div>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, color: '#FFFFFF', marginBottom: '1px' }}>
                  {co.name}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                  Wage: <span style={{ color: 'rgba(255,255,255,0.65)' }}>{co.wageGrade}</span>
                  {' · '}
                  Security: <span style={{ color: 'rgba(255,255,255,0.65)' }}>{co.securityGrade}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. BOTTOM CTA ── */}
      <section
        style={{
          backgroundColor: '#111827',
          padding: '64px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}
      >
        <div>
          <h2
            className="font-playfair"
            style={{ fontSize: '30px', fontWeight: 600, color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.2 }}
          >
            Where does your career land?
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Use our grading tool to see where any occupation sits in the Canadian labour market.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <Link
            to="/personalized"
            style={{
              backgroundColor: '#0C3D2E', color: '#FFFFFF',
              padding: '13px 24px', fontFamily: 'Inter', fontSize: '13px',
              fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
              textDecoration: 'none', display: 'inline-block',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1B6B4E'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0C3D2E'; }}
          >
            Personalised match →
          </Link>
          <Link
            to="/search"
            style={{
              backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '13px 24px', fontFamily: 'Inter', fontSize: '13px',
              fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
              textDecoration: 'none', display: 'inline-block',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            Search all occupations
          </Link>
        </div>
      </section>

    </div>
  );
}
