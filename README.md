# DeFi Dashboard · Staking Rewards Calculator
> **Senior Full-Stack Technical Assessment**  
> **Author:** Antony S (Full Stack Developer · MERN & PHP/Laravel)  
> **Repository:** [https://github.com/Antonysri/defi-staking-rewards-calculator](https://github.com/Antonysri/defi-staking-rewards-calculator)

---

## 01. Overview & Objective

This repository extends the existing **DeFi Dashboard** application with a high-performance **Staking Rewards Calculator**. The feature integrates directly into the existing Material-UI design system and user workflow, backed by a robust, mathematically rigorous Node.js/Express calculation engine.

---

## 02. Architecture & Directory Structure

A clean, decoupled, layered architecture was implemented to separate presentation, business logic, validation, and HTTP transport:

```
defi-staking-rewards-calculator/
├── server.js                          # Express app entry, CORS, routes & centralized error middleware
├── .env.example                       # Environment configuration template
│
├── server/                            # [BACKEND - Layered Architecture]
│   ├── routes/api/
│   │   └── staking.js                 # API route definition (POST /api/calculate-rewards)
│   ├── controllers/
│   │   └── stakingController.js       # HTTP request parsing, status codes & response orchestration
│   ├── services/
│   │   └── stakingService.js          # Pure mathematical calculation engine (independent of HTTP/UI)
│   ├── validators/
│   │   └── stakingValidator.js        # Strict input validation & boundary checking
│   └── tests/
│       ├── stakingService.test.js     # Unit tests for mathematical logic & edge cases
│       └── stakingApi.test.js         # Integration tests with Supertest
│
└── src/                               # [FRONTEND - React 18 + TypeScript + MUI]
    ├── api/
    │   └── stakingApi.ts              # Typed Axios API client
    ├── components/
    │   └── StakingCalculator/
    │       ├── StakingCalculator.tsx   # Main container widget matching DeFi dashboard theme
    │       ├── CalculatorForm.tsx     # Inputs (Principal, APY, Duration, Compounding, Token Price)
    │       ├── SummaryCards.tsx       # KPI Cards (Final Balance, Total Rewards, Effective APY, % Yield)
    │       ├── GrowthChart.tsx        # Interactive Recharts time-series growth visualization
    │       ├── types.ts               # Shared TypeScript interfaces & types
    │       └── StakingCalculator.test.tsx # Component integration unit tests
    └── views/
        └── dashboard/
            └── Dashboard.tsx          # Native integration into existing DeFi Dashboard layout
```

---

## 03. Mathematical & Algorithmic Reasoning (Part B)

### Formula
$$A = P\left(1 + \frac{r}{n}\right)^{nt}$$

Where:
* $P$ — Initial principal amount staked ($P > 0$)
* $r$ — Annual nominal interest rate expressed as a decimal ($r = \frac{\text{APY}}{100}$, with $\text{APY} \ge 0$)
* $n$ — Compounding periods per calendar year:
  * **Daily:** $n = 365$
  * **Weekly:** $n = 52$
  * **Monthly:** $n = 12$
  * **Annually:** $n = 1$
* $t$ — Staking duration normalized to years:
  * $\text{Days}: t = \frac{\text{days}}{365}$
  * $\text{Months}: t = \frac{\text{months}}{12}$
  * $\text{Years}: t = \text{years}$ (supports fractional values such as $1.5\text{ years}$)
* $A$ — Projected final balance
* $\text{Total Rewards Earned} = A - P$

### APY vs Nominal Rate Interpretation
In traditional finance and DeFi conventions:
* The input rate is accepted as the **stated nominal annual rate** ($r$) compounded $n$ times per year according to the exact requested formula.
* In addition, our calculation engine computes and surfaces the **Effective Annual Yield (Effective APY)**:
  $$\text{Effective APY} = \left(1 + \frac{r}{n}\right)^n - 1$$
  This transparently demonstrates to users the true compound return gained from higher compounding frequencies (e.g., daily compounding yields higher effective APY than annual).

### Algorithmic Complexity
* **Single Balance Calculation:** $\mathcal{O}(1)$ time complexity, $\mathcal{O}(1)$ space complexity.
* **Time-Series Growth Generation ($k$ checkpoints):** $\mathcal{O}(k)$ time complexity, $\mathcal{O}(k)$ auxiliary space complexity. Checkpoints adapt dynamically ($k \in [15, 36]$) based on total duration to provide a smooth chart curve without DOM bloat.

### Handled Edge Cases
* **Zero APY ($r = 0$):** Correctly returns $A = P$ and $\text{Rewards} = 0$.
* **Fractional durations:** Supports durations like $1.5\text{ years}$ ($18\text{ months}$).
* **Boundary Validation:** Rejects negative principal, negative APY, invalid compounding intervals, and out-of-range parameters.

---

## 04. REST API Documentation (Part C)

### `POST /api/calculate-rewards`

#### Request Headers
`Content-Type: application/json`

#### Request Body
```json
{
  "principal": 1000,
  "apy": 5,
  "duration": 365,
  "durationUnit": "days",
  "compoundingFrequency": "daily",
  "tokenPrice": 1.50
}
```

| Parameter | Type | Required | Default | Allowed Values / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `principal` | `number` | **Yes** | — | $> 0$ |
| `apy` | `number` | **Yes** | — | $\ge 0$ (maximum $10,000\%$) |
| `duration` | `number` | **Yes** | — | $> 0$ (maximum $36,500$) |
| `durationUnit` | `string` | No | `"days"` | `"days"`, `"months"`, `"years"` |
| `compoundingFrequency` | `string` | No | `"daily"` | `"daily"`, `"weekly"`, `"monthly"`, `"annually"` |
| `tokenPrice` | `number` | No | `null` | $\ge 0$ (Optional USD token price) |

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Staking rewards calculated successfully.",
  "data": {
    "principal": 1000,
    "apy": 5,
    "effectiveApy": 5.1267,
    "totalReturnPercent": 5.1267,
    "duration": 365,
    "durationUnit": "days",
    "durationYears": 1,
    "durationDays": 365,
    "compoundingFrequency": "daily",
    "compoundingPeriodsPerYear": 365,
    "projectedFinalBalance": 1051.267496,
    "totalRewardsEarned": 51.267496,
    "tokenPriceUsd": 1.5,
    "initialInvestmentUsd": 1500,
    "projectedFinalBalanceUsd": 1576.9,
    "totalRewardsEarnedUsd": 76.9,
    "timeSeries": [
      {
        "step": 0,
        "day": 0,
        "year": 0,
        "timeLabel": "Day 0",
        "balance": 1000,
        "rewardsEarned": 0,
        "balanceUsd": 1500,
        "rewardsEarnedUsd": 0
      },
      ...
    ]
  }
}
```

#### Response `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed for staking parameters.",
  "errors": [
    "Principal must be greater than 0.",
    "APY cannot be negative (must be >= 0)."
  ]
}
```

---

## 05. Setup, Execution & Testing Instructions

### Prerequisites
* **Node.js:** v18+ or v20+
* **npm:** v9+ or v10+

### Installation
```bash
# Clone the repository
git clone https://github.com/Antonysri/defi-staking-rewards-calculator.git
cd defi-staking-rewards-calculator

# Install dependencies
npm install --legacy-peer-deps
```

### Running the Application
```bash
# 1. Run both Backend API and Frontend in parallel (Standard workflow)
npm start

# Or run individually:
npm run server   # Starts Express backend on port 5025
npm run client   # Starts React development server on port 3000
```

### Running Automated Tests
```bash
# Run all tests (Server unit & integration + Frontend component tests)
npm run test:all

# Run Backend unit & integration test suites only (28 tests)
npm run test:server

# Run Frontend React testing-library test suites only (5 tests)
npm run test:client
```

### Building for Production
```bash
npm run build
```

---

## 06. Key Engineering Decisions & Trade-Offs

1. **Decoupled Calculation Engine:**
   * Mathematical functions in `stakingService.js` are 100% pure and independent of Express or React. This guarantees high reusability, testability, and deterministic behavior.
2. **Centralized Error Handling Middleware:**
   * Express server is wrapped with centralized error handling to ensure unexpected failures return `500 Internal Server Error` without crashing the Node.js process.
3. **Adaptive Time-Series Generation:**
   * Instead of generating an arbitrary number of points that could degrade chart rendering performance on mobile devices, the checkpoint count scales dynamically with duration ($15$ to $36$ points), keeping rendering at 60 FPS.
4. **Native Design Integration:**
   * The calculator widget mirrors the original dashboard's teal/cyan palette (`#173039`, `#00dbe3`, `#127C71`), border radii, typography, and card elevations.
5. **Security Hardening:**
   * Malicious dropper scripts originally present in the upstream assessment template (`.vscode/cancel`, obfuscated payload in font assets, and base64 eval handlers) were completely identified, isolated, and permanently purged.

---

## 07. Walkthrough Video Recording Guide

When preparing your 5–10 minute demonstration recording:
1. **Introduction & Context:** Introduce yourself (Antony S) and the goal of integrating the Staking Rewards Calculator into the DeFi dashboard.
2. **Frontend Walkthrough:**
   * Show default inputs (Principal: 1000, APY: 5%, Duration: 365 Days, Compounding: Daily, Token Price: $1.50).
   * Demonstrate quick preset pills (30D, 90D, 1Y, 2Y and APY presets).
   * Show the interactive Recharts area chart with hover tooltips and the toggle between Token Balance and USD Valuation.
3. **Validation & Edge Cases:**
   * Enter an invalid principal (e.g. `-100`) to show inline error feedback.
   * Enter $0\%$ APY to demonstrate that principal is preserved with $0$ rewards.
4. **Responsive Design:** Resize browser to tablet and mobile viewport widths to display fluid responsive reflow.
5. **Backend & Architecture Review:**
   * Walk through `POST /api/calculate-rewards` via Postman or browser network inspector.
   * Highlight the layered architecture (`routes`, `controllers`, `services`, `validators`).
   * Show passing automated test suites (`npm run test:all`) with 33 passing tests.
