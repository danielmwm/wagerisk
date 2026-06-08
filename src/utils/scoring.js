export function calculateWeightedScore(career, weights) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;
  const score = (
    career.securityScore * weights.security +
    career.wageScore * weights.wage +
    career.growthScore * weights.growth +
    career.workLifeScore * weights.workLife +
    career.automationResistance * weights.automation
  ) / totalWeight;
  return Math.round(score);
}

export function getLetterGrade(score) {
  if (score >= 93) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 87) return 'A−';
  if (score >= 83) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 77) return 'B−';
  if (score >= 73) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 67) return 'C−';
  if (score >= 60) return 'D+';
  if (score >= 50) return 'D';
  return 'F';
}

export function getGradeColor(grade) {
  if (!grade) return '#9CA3AF';
  if (grade.startsWith('A')) return '#15803D';
  if (grade.startsWith('B')) return '#1D4ED8';
  if (grade.startsWith('C')) return '#D97706';
  return '#B91C1C';
}

export function getGradeBg(grade) {
  if (!grade) return '#F5F2EC';
  if (grade.startsWith('A')) return '#F0FDF4';
  if (grade.startsWith('B')) return '#EFF6FF';
  if (grade.startsWith('C')) return '#FFFBEB';
  return '#FEF2F2';
}

export const PROVINCE_MULTIPLIERS = {
  Ontario: 1.0,
  'British Columbia': 1.05,
  Alberta: 1.08,
  Quebec: 0.94,
  Saskatchewan: 0.97,
  Manitoba: 0.95,
};

export function adjustedWage(medianHourly, province) {
  const multiplier = PROVINCE_MULTIPLIERS[province] ?? 1.0;
  return Math.round(medianHourly * multiplier);
}

export function formatWage(hourly) {
  return `$${hourly}/hr`;
}
