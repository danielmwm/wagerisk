const SOURCES = [
  {
    name: 'Job Bank — Government of Canada',
    description: 'Wage data and 2024–2028 employment outlooks by NOC code. Updated annually.',
    url: 'jobbank.gc.ca',
    href: 'https://www.jobbank.gc.ca',
  },
  {
    name: 'Statistics Canada Labour Force Survey',
    description: 'Unemployment rates, permanent vs. temporary employment ratios, and wage trends by occupation.',
    url: 'statcan.gc.ca',
    href: 'https://www150.statcan.gc.ca',
  },
  {
    name: 'Canadian Occupational Projection System (COPS)',
    description: '10-year employment projections by occupation. Used for growth and trend scoring.',
    url: 'esdc.gc.ca',
    href: 'https://www.canada.ca/en/employment-social-development.html',
  },
  {
    name: 'Oxford / McKinsey automation risk data',
    description: 'Occupation-level automation probability, adapted for the Canadian labour market context.',
    url: 'oxfordmartin.ox.ac.uk',
    href: 'https://www.oxfordmartin.ox.ac.uk',
  },
  {
    name: 'Canada Open Data Portal',
    description: 'All underlying datasets are publicly available.',
    url: 'open.canada.ca',
    href: 'https://open.canada.ca',
  },
];

export default function Sources() {
  return (
    <div style={{ padding: '32px 24px', maxWidth: '540px' }}>
      {/* Heading */}
      <h1
        className="font-playfair"
        style={{
          fontSize: '20px',
          fontWeight: 500,
          color: '#111827',
          marginBottom: '20px',
        }}
      >
        Data sources
      </h1>

      {/* Source entries */}
      <div>
        {SOURCES.map((source, i) => (
          <div
            key={source.name}
            style={{
              padding: '14px 0',
              borderBottom: i < SOURCES.length - 1 ? '1px solid #F0EDE8' : 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: 500,
                color: '#111827',
                marginBottom: '5px',
              }}
            >
              {source.name}
            </p>
            <p
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                color: '#6B7280',
                lineHeight: '1.5',
                marginBottom: '5px',
              }}
            >
              {source.description}
            </p>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                color: '#0C3D2E',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.target.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.target.style.textDecoration = 'none'; }}
            >
              {source.url} ↗
            </a>
          </div>
        ))}
      </div>

      {/* Methodology note */}
      <div
        style={{
          borderTop: '1px solid #E2DDD4',
          marginTop: '28px',
          paddingTop: '16px',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: '11px',
            color: '#6B7280',
            lineHeight: '1.5',
            marginBottom: '16px',
          }}
        >
          <strong style={{ fontWeight: 500 }}>Scoring methodology:</strong> Wage and security scores
          (0–100) are calculated using a combination of median hourly wage relative to the Canadian
          occupational median, unemployment rate, permanent employment ratio, 2024–28 outlook, credit
          risk (automation exposure), and projected growth. Letter grades follow a standard scale
          where A+ is ≥93, down to F for scores below 50.
        </p>
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: '11px',
            color: '#9CA3AF',
            lineHeight: '1.5',
          }}
        >
          Data is reviewed and updated annually. WageRisk is an independent tool and is not
          affiliated with any government agency.
        </p>
      </div>
    </div>
  );
}
