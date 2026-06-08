# CareerLens

Canada's career intelligence tool — wage and job security data for any occupation.

## Overview

CareerLens provides data-driven career intelligence for the Canadian labour market. Built with an editorial design aesthetic inspired by the Financial Times, it lets you explore wage grades, security scores, and employment outlooks for 23 occupations across all major sectors.

## Tech Stack

- **React 19** + **Vite** — fast builds and HMR
- **Tailwind CSS v4** — layout utilities only (most styling is custom CSS)
- **Recharts** — scatter plots and charts
- **React Router v7** — client-side tab navigation
- **Google Fonts** — Playfair Display (500, 600) and Inter (400, 500)
- **Hosting** — Vercel (SPA rewrites configured)

## Pages

| Route | Description |
|-------|-------------|
| `/personalized` | Slider-based career matcher with weighted scoring |
| `/search` | Scatter plot + full career rating card, province wage adjustment |
| `/companies` | Grid of 12 major Canadian employers with wage/security grades |
| `/compare` | Side-by-side career comparison with scatter plot and data table |
| `/sources` | Data sources and methodology |

## Scoring Methodology

**Wage Score (0–100):** Derived from median hourly wage relative to the Canadian occupational median.

**Security Score (0–100):** Composite of unemployment rate, permanent employment ratio, and 2024–28 outlook from COPS.

**Weighted Personalization Score:**
```
Score = (securityScore × w₁ + wageScore × w₂ + growthScore × w₃ + workLifeScore × w₄ + automationResistance × w₅) / totalWeight
```

**Letter Grades:** A+ (≥93) through F (<50).

**Province wage multipliers:** Ontario 1.0 · BC 1.05 · Alberta 1.08 · Quebec 0.94 · Saskatchewan 0.97 · Manitoba 0.95

## Data Sources

1. Job Bank — Government of Canada
2. Statistics Canada Labour Force Survey
3. Canadian Occupational Projection System (COPS)
4. Oxford / McKinsey automation risk data
5. Canada Open Data Portal

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```
