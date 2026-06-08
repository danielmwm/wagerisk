import { useState } from 'react';
import companies from '../data/companies.json';

const SAMPLE_REVIEWS = [
  {
    id: 1,
    company: 'Royal Bank of Canada',
    role: 'Software Engineer',
    rating: 4,
    title: 'Great pay, demanding hours',
    pros: 'Competitive salary, strong benefits, good learning opportunities. Management is generally supportive.',
    cons: 'Work-life balance is tough during project cycles. Expect long hours closer to deadlines.',
    recommend: true,
    date: 'May 2026',
    city: 'Toronto, ON',
    anonymous: true,
  },
  {
    id: 2,
    company: 'Government of Canada',
    role: 'Policy Analyst',
    rating: 4,
    title: 'Stable and meaningful work',
    pros: 'Excellent job security, generous pension, good vacation. Work is genuinely impactful.',
    cons: 'Slow career progression. Bureaucracy can be frustrating. Salary lags private sector.',
    recommend: true,
    date: 'Apr 2026',
    city: 'Ottawa, ON',
    anonymous: true,
  },
  {
    id: 3,
    company: 'Shopify',
    role: 'Product Manager',
    rating: 3,
    title: 'Fast-paced but chaotic',
    pros: 'Excellent compensation, smart colleagues, interesting problems to solve.',
    cons: 'Constant re-orgs make it hard to build anything lasting. Remote culture feels isolating.',
    recommend: false,
    date: 'Mar 2026',
    city: 'Remote',
    anonymous: true,
  },
];

const STARS = [1, 2, 3, 4, 5];

function StarRow({ rating, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {STARS.map(s => {
        const filled = interactive ? (hovered ?? rating) >= s : rating >= s;
        return (
          <span
            key={s}
            onClick={() => interactive && onRate(s)}
            onMouseEnter={() => interactive && setHovered(s)}
            onMouseLeave={() => interactive && setHovered(null)}
            style={{
              fontSize: '18px',
              color: filled ? '#0C3D2E' : '#E2DDD4',
              cursor: interactive ? 'pointer' : 'default',
              lineHeight: 1,
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2DDD4',
        padding: '20px',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#111827', marginBottom: '2px' }}>
            {review.role}
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#9CA3AF' }}>
            {review.company} · {review.city} · {review.date}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <StarRow rating={review.rating} />
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: 500,
              color: review.recommend ? '#0C3D2E' : '#9CA3AF',
              backgroundColor: review.recommend ? '#E8F4F0' : '#F5F2EC',
              padding: '2px 7px',
              borderRadius: '2px',
            }}
          >
            {review.recommend ? '✓ Recommends' : '✗ Does not recommend'}
          </span>
        </div>
      </div>

      {/* Title */}
      <p style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '10px' }}>
        "{review.title}"
      </p>

      {/* Pros / Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ borderLeft: '2px solid #0C3D2E', paddingLeft: '10px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 500, color: '#0C3D2E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pros</p>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>{review.pros}</p>
        </div>
        <div style={{ borderLeft: '2px solid #E2DDD4', paddingLeft: '10px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 500, color: '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cons</p>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>{review.cons}</p>
        </div>
      </div>
    </div>
  );
}

function SubmitForm({ onClose }) {
  const [rating, setRating] = useState(0);
  const [recommend, setRecommend] = useState(null);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: '#FAFAF6', border: '1px solid #E2DDD4',
          width: '560px', maxHeight: '85vh', overflowY: 'auto', padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, color: '#111827' }}>Write a Review</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '18px' }}>✕</button>
        </div>

        {/* Fields */}
        {[
          { label: 'Company', placeholder: 'e.g. Royal Bank of Canada' },
          { label: 'Job Title', placeholder: 'e.g. Software Engineer' },
          { label: 'City', placeholder: 'e.g. Toronto, ON' },
          { label: 'Review Title', placeholder: 'Summarize your experience in one line' },
        ].map(({ label, placeholder }) => (
          <div key={label} style={{ marginBottom: '14px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </label>
            <input
              placeholder={placeholder}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid #E2DDD4', backgroundColor: '#FFFFFF',
                padding: '9px 12px', fontFamily: 'Inter', fontSize: '13px',
                color: '#111827', outline: 'none',
              }}
            />
          </div>
        ))}

        {/* Rating */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Overall Rating
          </label>
          <StarRow rating={rating} interactive onRate={setRating} />
        </div>

        {/* Pros */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pros</label>
          <textarea rows={3} placeholder="What did you like about working here?"
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E2DDD4', backgroundColor: '#FFFFFF', padding: '9px 12px', fontFamily: 'Inter', fontSize: '13px', color: '#111827', outline: 'none', resize: 'vertical' }} />
        </div>

        {/* Cons */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cons</label>
          <textarea rows={3} placeholder="What could be improved?"
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E2DDD4', backgroundColor: '#FFFFFF', padding: '9px 12px', fontFamily: 'Inter', fontSize: '13px', color: '#111827', outline: 'none', resize: 'vertical' }} />
        </div>

        {/* Recommend */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Would you recommend this employer?</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[true, false].map(val => (
              <button
                key={String(val)}
                onClick={() => setRecommend(val)}
                style={{
                  padding: '7px 20px', fontFamily: 'Inter', fontSize: '12px', fontWeight: 500,
                  border: `1px solid ${recommend === val ? '#0C3D2E' : '#E2DDD4'}`,
                  backgroundColor: recommend === val ? '#0C3D2E' : '#FFFFFF',
                  color: recommend === val ? '#FFFFFF' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#9CA3AF', marginBottom: '16px' }}>
          All reviews are posted anonymously. We do not collect your name or email.
        </p>

        <button
          style={{
            width: '100%', padding: '11px', backgroundColor: '#0C3D2E',
            color: '#FFFFFF', border: 'none', fontFamily: 'Inter',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}

export default function ReviewsPreview() {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const companyNames = ['all', ...new Set(SAMPLE_REVIEWS.map(r => r.company))];
  const visible = filter === 'all' ? SAMPLE_REVIEWS : SAMPLE_REVIEWS.filter(r => r.company === filter);

  return (
    <div style={{ padding: '20px 24px', maxWidth: '860px' }}>
      {/* Preview banner */}
      <div style={{ backgroundColor: '#FEF9C3', border: '1px solid #FDE68A', padding: '8px 14px', marginBottom: '20px', fontFamily: 'Inter', fontSize: '12px', color: '#92400E' }}>
        Preview only — not live. Navigate to <strong>/reviews-preview</strong> to view.
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>Job Reviews</h1>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF' }}>Anonymous employer reviews from Canadian workers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '9px 18px', backgroundColor: '#0C3D2E', color: '#FFFFFF',
            border: 'none', fontFamily: 'Inter', fontSize: '12px',
            fontWeight: 500, cursor: 'pointer', letterSpacing: '0.03em',
          }}
        >
          + Write a Review
        </button>
      </div>

      {/* Company filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {companyNames.map(name => {
          const isActive = filter === name;
          return (
            <button
              key={name}
              onClick={() => setFilter(name)}
              style={{
                padding: '5px 12px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 500,
                border: `1px solid ${isActive ? '#0C3D2E' : '#E2DDD4'}`,
                backgroundColor: isActive ? '#0C3D2E' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#6B7280',
                cursor: 'pointer', borderRadius: '2px',
              }}
            >
              {name === 'all' ? 'All companies' : name}
            </button>
          );
        })}
      </div>

      {/* Reviews */}
      {visible.map(r => <ReviewCard key={r.id} review={r} />)}

      {showForm && <SubmitForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
