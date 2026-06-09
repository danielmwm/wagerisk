import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import careers from '../data/careers.json';
import GradeBadge from '../components/GradeBadge';
import { getGradeColor, adjustedWage } from '../utils/scoring';

const PROVINCE = 'Ontario';

const ROW_CONFIG = [
  { key: 'wageGrade', label: 'Wage grade', fmt: c => c.wageGrade, isBetter: (a, b) => {
    const order = ['A+','A','A−','B+','B','B−','C+','C','C−','D+','D','F'];
    return order.indexOf(a.wageGrade) <= order.indexOf(b.wageGrade) ? 0 : 1;
  }},
  { key: 'securityGrade', label: 'Security grade', fmt: c => c.securityGrade, isBetter: (a, b) => {
    const order = ['A+','A','A−','B+','B','B−','C+','C','C−','D+','D','F'];
    return order.indexOf(a.securityGrade) <= order.indexOf(b.securityGrade) ? 0 : 1;
  }},
  { key: 'wage', label: 'Median hourly wage', fmt: c => `$${adjustedWage(c.medianHourly, PROVINCE)}/hr`, isBetter: (a, b) => a.medianHourly >= b.medianHourly ? 0 : 1 },
  { key: 'unemploymentRate', label: 'Unemployment rate', fmt: c => c.unemploymentRate, isBetter: (a, b) => parseFloat(a.unemploymentRate) <= parseFloat(b.unemploymentRate) ? 0 : 1 },
  { key: 'permanentPercent', label: 'Permanent employment', fmt: c => c.permanentPercent, isBetter: (a, b) => parseFloat(a.permanentPercent) >= parseFloat(b.permanentPercent) ? 0 : 1 },
  { key: 'automationRisk', label: 'AI proof rating', fmt: c => c.automationRisk, isBetter: (a, b) => {
    const order = ['Very Low','Low','Moderate','High','Very High'];
    return order.indexOf(a.automationRisk) <= order.indexOf(b.automationRisk) ? 0 : 1;
  }},
  { key: 'outlook', label: '2024–28 outlook', fmt: c => c.outlook, isBetter: (a, b) => {
    const order = ['Good','Fair','Limited'];
    return order.indexOf(a.outlook) <= order.indexOf(b.outlook) ? 0 : 1;
  }},
  { key: 'wageScore', label: 'Wage score', fmt: c => `${c.wageScore}/100`, isBetter: (a, b) => a.wageScore >= b.wageScore ? 0 : 1 },
  { key: 'securityScore', label: 'Security score', fmt: c => `${c.securityScore}/100`, isBetter: (a, b) => a.securityScore >= b.securityScore ? 0 : 1 },
];

const COLORS = ['#0C3D2E', '#185FA5'];

const CustomDotTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #E2DDD4',
        padding: '9px 12px', fontFamily: 'Inter', fontSize: '12px',
      }}>
        <p style={{ fontWeight: 500, color: '#111827', marginBottom: '3px' }}>{d.name}</p>
        <p style={{ color: '#6B7280' }}>
          W: {d.wageScore} · S: {d.securityScore}
        </p>
      </div>
    );
  }
  return null;
};

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [careerA, setCareerA] = useState(() => {
    const id = searchParams.get('a');
    return careers.find(c => c.id === id) ?? null;
  });
  const [careerB, setCareerB] = useState(() => {
    const id = searchParams.get('b');
    return careers.find(c => c.id === id) ?? null;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = {};
    if (careerA) params.a = careerA.id;
    if (careerB) params.b = careerB.id;
    setSearchParams(params, { replace: true });
  }, [careerA, careerB]);

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const bothSelected = careerA && careerB;

  const selectStyle = {
    border: '1px solid #E2DDD4',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: '13px',
    color: '#111827',
    padding: '10px 30px 10px 12px',
    outline: 'none',
    borderRadius: '0',
    width: '100%',
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Selectors row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <p className="section-label" style={{ marginBottom: '8px' }}>Career one</p>
          <div style={{ position: 'relative' }}>
            {careerA && (
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  backgroundColor: COLORS[0],
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            )}
            <select
              value={careerA?.id ?? ''}
              onChange={e => setCareerA(careers.find(c => c.id === e.target.value) ?? null)}
              style={{ ...selectStyle, paddingLeft: careerA ? '14px' : '12px' }}
            >
              <option value="">Select a career…</option>
              {careers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p className="section-label" style={{ marginBottom: '8px' }}>Career two</p>
          <div style={{ position: 'relative' }}>
            {careerB && (
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  backgroundColor: COLORS[1],
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            )}
            <select
              value={careerB?.id ?? ''}
              onChange={e => setCareerB(careers.find(c => c.id === e.target.value) ?? null)}
              style={{ ...selectStyle, paddingLeft: careerB ? '14px' : '12px' }}
            >
              <option value="">Select a career…</option>
              {careers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleShare}
          style={{
            padding: '10px 18px',
            border: '1px solid #E2DDD4',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Inter',
            fontSize: '12px',
            color: copied ? '#0C3D2E' : '#6B7280',
            cursor: 'pointer',
            borderRadius: '0',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            borderColor: copied ? '#0C3D2E' : '#E2DDD4',
          }}
        >
          {copied ? 'Copied! ✓' : 'Copy shareable link'}
        </button>
      </div>

      {!bothSelected ? (
        /* Empty state */
        <div style={{ display: 'flex', gap: '20px' }}>
          {[0, 1].map(i => (
            <div
              key={i}
              style={{
                flex: 1,
                border: '1px dashed #D1CCC0',
                padding: '48px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px dashed #D1CCC0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1CCC0',
                  fontSize: '20px',
                }}
              >
                +
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF' }}>
                {i === 0 ? 'Select Career one above' : 'Select Career two above'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Scatter plot */}
          <div style={{ marginBottom: '24px' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>
              Positioning — wage vs. security
            </p>
            <div style={{ position: 'relative', height: '260px' }}>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart
                  margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                  style={{ backgroundColor: '#F5F2EC', border: '1px solid #E2DDD4' }}
                >
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
                  <Tooltip content={<CustomDotTooltip />} cursor={false} />
                  {/* All careers as background */}
                  <Scatter
                    data={careers.filter(c => c.id !== careerA?.id && c.id !== careerB?.id)}
                  >
                    {careers
                      .filter(c => c.id !== careerA?.id && c.id !== careerB?.id)
                      .map(c => (
                        <Cell key={c.id} fill="rgba(156,163,175,0.35)" stroke="none" r={4} />
                      ))
                    }
                  </Scatter>
                  {/* Career A */}
                  <Scatter data={[careerA]} fill={COLORS[0]} r={10}>
                    <LabelList
                      dataKey="name"
                      position="top"
                      style={{ fontFamily: 'Inter', fontSize: '11px', fill: COLORS[0], fontWeight: 500 }}
                    />
                  </Scatter>
                  {/* Career B */}
                  <Scatter data={[careerB]} fill={COLORS[1]} r={10}>
                    <LabelList
                      dataKey="name"
                      position="top"
                      style={{ fontFamily: 'Inter', fontSize: '11px', fill: COLORS[1], fontWeight: 500 }}
                    />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>

              {/* Quadrant lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: '10px',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              >
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed #D1CCC0' }} />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #D1CCC0' }} />
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div style={{ border: '1px solid #E2DDD4', overflow: 'hidden', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F2EC', borderBottom: '1px solid #E2DDD4' }}>
                  <th
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '10px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.09em',
                      color: '#9CA3AF',
                      width: '30%',
                      borderRight: '1px solid #E2DDD4',
                    }}
                  >
                    Metric
                  </th>
                  {[careerA, careerB].map((career, ci) => (
                    <th
                      key={ci}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'center',
                        borderRight: ci === 0 ? '1px solid #E2DDD4' : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: COLORS[ci],
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'Inter',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#111827',
                          }}
                        >
                          {career.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROW_CONFIG.map(({ key, label, fmt, isBetter }, rowIdx) => {
                  const betterIdx = isBetter(careerA, careerB);
                  return (
                    <tr
                      key={key}
                      style={{
                        borderBottom: rowIdx < ROW_CONFIG.length - 1 ? '1px solid #F0EDE8' : 'none',
                      }}
                    >
                      <td
                        style={{
                          padding: '9px 14px',
                          fontSize: '12px',
                          color: '#6B7280',
                          borderRight: '1px solid #E2DDD4',
                        }}
                      >
                        {label}
                      </td>
                      {[careerA, careerB].map((career, ci) => (
                        <td
                          key={ci}
                          style={{
                            padding: '9px 14px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#111827',
                            backgroundColor: betterIdx === ci ? '#F0FDF4' : 'transparent',
                            borderRight: ci === 0 ? '1px solid #E2DDD4' : 'none',
                          }}
                        >
                          {fmt(career)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Verdict blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[careerA, careerB].map((career, ci) => (
              <div
                key={career.id}
                style={{
                  borderLeft: `2px solid ${COLORS[ci]}`,
                  paddingLeft: '12px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                }}
              >
                <p
                  style={{
                    fontSize: '9px',
                    fontFamily: 'Inter',
                    textTransform: 'uppercase',
                    letterSpacing: '0.09em',
                    color: COLORS[ci],
                    marginBottom: '5px',
                  }}
                >
                  {career.name} — Verdict
                </p>
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    color: '#374151',
                    lineHeight: '1.6',
                  }}
                >
                  {career.verdict}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
