import { getGradeColor } from '../utils/scoring';

export default function GradeBadge({ grade, size = 'md', showBg = false }) {
  const color = getGradeColor(grade);

  const sizes = {
    sm: { fontSize: '13px', lineHeight: '1' },
    md: { fontSize: '18px', lineHeight: '1' },
    lg: { fontSize: '36px', lineHeight: '1' },
    xl: { fontSize: '52px', lineHeight: '1' },
  };

  return (
    <span
      className="font-playfair tabular"
      style={{
        fontWeight: 600,
        color,
        ...sizes[size],
      }}
    >
      {grade}
    </span>
  );
}
