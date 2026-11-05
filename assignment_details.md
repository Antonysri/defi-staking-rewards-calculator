# Full-Stack Integration Assignment


Thank you for your interest in joining our team.

## Demo Project

---


### https://bitbucket.org/candidate-test-workplace/assignment/

DeFi Dashboard · Staking Rewards Calculator
Take-Home Technical Assessment | Senior Engineering Level
Estimated completion time: 1–2 hours
Assessment focus: Full-Stack Integration · Mathematical Reasoning · API Architecture · Engineering Quality

---


## 01 — THE MISSION

### Build. Integrate. Calculate. Deliver.
We invite you to extend an existing DeFi Dashboard Demo Project by developing a Staking Rewards Calculator that integrates naturally into its current architecture and user experience.
This challenge is designed to evaluate more than implementation skills. We want to understand how you approach an unfamiliar codebase, translate mathematical requirements into reliable software, design clean interfaces between frontend and backend systems, and make sound engineering decisions under a limited timeframe.
The objective: deliver a functional, well-structured feature that feels like a native part of the existing product.

## 02 — THE CHALLENGE

### Part A · Frontend Integration & Experience
Integrate the calculator directly into the supplied dashboard. Do not create a separate standalone application or replace the existing interface.
Required inputs
  * Principal amount to stake
  * Annual percentage yield (APY)
  * Staking duration in days or years
  * Compounding frequency: daily, weekly, monthly, or annually
  * Optional token price for USD projections
Expected functionality
  * Connect the interface to the backend calculation API.
  * Provide clear idle, loading, success, and error states.
  * Display the projected final balance and total rewards earned.
  * Visualize projected balance growth using an interactive chart.
  * Validate inputs and provide useful feedback for invalid values.
  * Preserve the dashboard's existing design language, styling, and responsive behavior.
Engineering standard: the widget should look and feel as though it was designed as part of the original product.
If the existing template supports dark and light themes, the new component should respect them.

### Part B · Mathematical & Algorithmic Reasoning
Implement a reusable calculation engine based on compound interest.
Formula
[
A=P\left(1+\frac{r}{n}\right)^{nt}
]
Where:
  * (P) — initial principal
  * (r) — annual interest rate as a decimal
  * (n) — compounding periods per year
  * (t) — duration in years
  * (A) — projected final balance
Requirements
  * Support daily, weekly, monthly, and annual compounding.
  * Generate a time-series dataset for the growth chart.
  * Support fractional durations, including 1.5 years.
  * Handle zero APY and reject invalid or out-of-range inputs.
  * Keep mathematical logic independent of UI and HTTP handling.
  * Include unit tests for standard calculations, edge cases, and invalid inputs.
Important: APY conventionally describes effective annual yield. Clearly document whether your implementation accepts effective APY or a nominal annual rate, and use a mathematically consistent formula throughout.
Complexity analysis
  * Single closed-form calculation: (O(1))
  * Generating (k) chart points: (O(k)) time and (O(k)) space when retaining all points
We are interested in both the accuracy of your results and your reasoning behind the implementation.

### Part C · Backend API & Architecture
Build a RESTful API to power the calculator.
Endpoint
POST /api/calculate-rewards
Example request
```Plain Text
{
  "principal": 1000,
  "apy": 5,
  "duration": 365,
  "durationUnit": "days",
  "compoundingFrequency": "daily"
}
```
The API should return the projected balance, rewards earned, normalized duration, and chart data required by the frontend.
Architecture expectations
  * Separate routes, validation, controllers, services, and utilities where appropriate.
  * Keep the calculation service reusable and independently testable.
  * Validate request fields, numeric values, allowed options, and logical boundaries.
  * Return 400 Bad Request with a clear message for invalid requests.
  * Use centralized error handling for unexpected failures, returning 500 Internal Server Error.
  * Ensure errors do not crash the server.
  * Use in-memory storage if needed; no database is required.
You may work within the existing backend stack or choose a suitable lightweight implementation if the supplied project does not already include one.

## 03 — DELIVERABLES

### A. GitHub Repository
Submit a repository containing:
  * The integrated frontend and backend.
  * A clear and maintainable code structure.
  * A README with setup, configuration, and execution instructions.
  * A concise explanation of architectural choices and trade-offs.
  * Mathematical assumptions and complexity analysis.
  * Unit tests and instructions for running them.
  * A meaningful commit history that reflects your development process.

### B. Technical Walkthrough
Record a 5–10 minute demonstration video covering:
  1. The calculator integrated into the existing dashboard.
  1. A working calculation from input to result.
  1. Responsive behavior across different screen sizes.
  1. The API request and response.
  1. The calculation algorithm and validation logic.
  1. Your code structure and key engineering decisions.

### C. Code Quality
We value readable, maintainable code, consistent formatting, meaningful tests, robust error handling, and sensible abstractions.
Within the time limit, prioritize a complete working implementation over unnecessary features. Document any assumptions or limitations clearly.

## 04 — EVALUATION FRAMEWORK

## 05 — THE ENGINEERING STANDARD
We are looking for the qualities expected of a senior engineer and technical leader:
  * Architectural judgment: choosing appropriate abstractions without overengineering.
  * Mathematical precision: understanding the model, validating assumptions, and handling edge cases.
  * Integration discipline: extending the existing system without disrupting its design or behavior.