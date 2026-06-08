import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background — cream
ctx.fillStyle = '#FAFAF6';
ctx.fillRect(0, 0, W, H);

// Subtle grid lines
ctx.strokeStyle = 'rgba(0,0,0,0.04)';
ctx.lineWidth = 1;
for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

// Left green accent strip
ctx.fillStyle = '#0C3D2E';
ctx.fillRect(0, 0, 12, H);

// Top accent bar (green)
ctx.fillStyle = '#0C3D2E';
ctx.fillRect(60, 90, 80, 4);

// Main title
ctx.font = 'bold 86px serif';
ctx.fillStyle = '#111827';
ctx.fillText('WageRisk', 60, 220);
const titleWidth = ctx.measureText('WageRisk').width;

// .io suffix
ctx.font = '24px sans-serif';
ctx.fillStyle = '#9CA3AF';
ctx.fillText('.io', 60 + titleWidth + 10, 220);

// Tagline
ctx.font = '32px sans-serif';
ctx.fillStyle = '#6B7280';
ctx.fillText("Canada's Career Intelligence Tool", 60, 290);

// Divider
ctx.strokeStyle = '#E2DDD4';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(60, 340); ctx.lineTo(W - 60, 340); ctx.stroke();

// Stats row
const stats = [
  { value: '23+', label: 'Occupations' },
  { value: '12+', label: 'Major Companies' },
  { value: '6', label: 'Provinces' },
  { value: '100%', label: 'Free' },
];
const colW = (W - 120) / stats.length;
stats.forEach(({ value, label }, i) => {
  const x = 60 + i * colW;
  ctx.font = 'bold 48px serif';
  ctx.fillStyle = '#0C3D2E';
  ctx.fillText(value, x, 430);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(label, x, 466);
});

// Bottom bar
ctx.fillStyle = '#F0EDE8';
ctx.fillRect(0, H - 80, W, 80);
ctx.font = '22px sans-serif';
ctx.fillStyle = '#9CA3AF';
ctx.fillText('wagerisk.io', 60, H - 28);

writeFileSync('public/og-image.png', canvas.toBuffer('image/png'));
console.log('og-image.png written to public/');
