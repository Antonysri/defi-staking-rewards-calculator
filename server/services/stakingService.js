/**
 * Staking Calculation Service
 * 
 * Implements compound interest calculation engine for DeFi Staking Rewards.
 * Formula:
 *   A = P * (1 + r / n) ^ (n * t)
 * 
 * Where:
 *   P = Principal amount
 *   r = Annual interest rate (decimal, APY / 100)
 *   n = Compounding periods per year
 *   t = Staking duration in years
 *   A = Projected final balance
 * 
 * Yield Interpretation Note:
 *   The formula evaluates nominal annual rate r compounded n times per year.
 *   The Effective Annual Yield (Effective APY) realized is:
 *     APY_effective = (1 + r / n)^n - 1
 */

const COMPOUNDING_PERIODS = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  annually: 1,
};

/**
 * Convert user duration into normalized years (t) and days
 * @param {number} duration 
 * @param {string} unit - 'days' | 'months' | 'years'
 * @returns {{ durationYears: number, durationDays: number }}
 */
function normalizeDuration(duration, unit = 'days') {
  const normalizedUnit = (unit || 'days').toLowerCase();
  let durationYears = 0;
  let durationDays = 0;

  switch (normalizedUnit) {
    case 'years':
      durationYears = duration;
      durationDays = duration * 365;
      break;
    case 'months':
      durationYears = duration / 12;
      durationDays = (duration / 12) * 365;
      break;
    case 'days':
    default:
      durationYears = duration / 365;
      durationDays = duration;
      break;
  }

  return { durationYears, durationDays };
}

/**
 * Calculates compound interest balance for a specific elapsed duration (in years)
 * @param {number} P - Principal
 * @param {number} r - Annual interest rate decimal
 * @param {number} n - Compounding periods per year
 * @param {number} t - Duration in years
 * @returns {number}
 */
function calculateBalanceAtTime(P, r, n, t) {
  if (P <= 0) return 0;
  if (r === 0 || t === 0) return P;

  // A = P * (1 + r/n)^(n*t)
  const base = 1 + r / n;
  const exponent = n * t;
  return P * Math.pow(base, exponent);
}

/**
 * Generates an adaptive time-series array of growth points for charting.
 * Complexity: O(k) time and O(k) space where k is the number of checkpoints.
 * 
 * @param {number} P 
 * @param {number} r 
 * @param {number} n 
 * @param {number} totalYears 
 * @param {number} totalDays 
 * @param {number|null} tokenPrice 
 * @returns {Array<object>}
 */
function generateGrowthTimeSeries(P, r, n, totalYears, totalDays, tokenPrice = null) {
  // Target between 12 to 36 checkpoints for smooth, readable charts
  let pointsCount = 20;
  if (totalDays <= 7) {
    pointsCount = Math.max(2, Math.round(totalDays));
  } else if (totalDays <= 30) {
    pointsCount = Math.min(Math.round(totalDays), 15);
  } else if (totalDays <= 90) {
    pointsCount = 18;
  } else if (totalDays <= 365) {
    pointsCount = 24;
  } else {
    pointsCount = Math.min(36, Math.max(24, Math.round(totalYears * 12)));
  }

  const series = [];

  for (let i = 0; i <= pointsCount; i++) {
    const fraction = i / pointsCount;
    const currentYears = totalYears * fraction;
    const currentDays = Math.round(totalDays * fraction);

    const balance = calculateBalanceAtTime(P, r, n, currentYears);
    const rewardsEarned = Math.max(0, balance - P);

    // Format readable time label
    let timeLabel = '';
    if (totalDays <= 60) {
      timeLabel = `Day ${currentDays}`;
    } else if (totalYears < 2) {
      const months = +(currentYears * 12).toFixed(1);
      timeLabel = `Month ${months}`;
    } else {
      timeLabel = `Year ${+currentYears.toFixed(2)}`;
    }

    const point = {
      step: i,
      day: currentDays,
      year: +currentYears.toFixed(4),
      timeLabel,
      balance: +balance.toFixed(6),
      rewardsEarned: +rewardsEarned.toFixed(6),
    };

    if (tokenPrice && tokenPrice > 0) {
      point.balanceUsd = +(balance * tokenPrice).toFixed(2);
      point.rewardsEarnedUsd = +(rewardsEarned * tokenPrice).toFixed(2);
    }

    series.push(point);
  }

  return series;
}

/**
 * Primary calculation handler
 * @param {object} params
 * @param {number} params.principal - Initial stake amount
 * @param {number} params.apy - Stated annual rate in percentage (e.g., 12.5 for 12.5%)
 * @param {number} params.duration - Duration value
 * @param {string} [params.durationUnit='days'] - 'days' | 'months' | 'years'
 * @param {string} [params.compoundingFrequency='daily'] - 'daily' | 'weekly' | 'monthly' | 'annually'
 * @param {number} [params.tokenPrice=null] - Optional current price per token in USD
 * @returns {object}
 */
function calculateStakingRewards({
  principal,
  apy,
  duration,
  durationUnit = 'days',
  compoundingFrequency = 'daily',
  tokenPrice = null,
}) {
  const P = Number(principal);
  const statedApyPercent = Number(apy);
  const r = statedApyPercent / 100; // rate as decimal
  const dur = Number(duration);
  const freq = (compoundingFrequency || 'daily').toLowerCase();
  const n = COMPOUNDING_PERIODS[freq] || 365;

  const { durationYears, durationDays } = normalizeDuration(dur, durationUnit);

  // Final balance calculation (O(1))
  const finalBalance = calculateBalanceAtTime(P, r, n, durationYears);
  const totalRewards = Math.max(0, finalBalance - P);

  // Effective annual yield (if compounding > 1)
  const effectiveApyPercent = r === 0 
    ? 0 
    : (Math.pow(1 + r / n, n) - 1) * 100;

  // Percentage gain over the full staking duration
  const totalReturnPercent = P > 0 ? (totalRewards / P) * 100 : 0;

  // Generate chart data series (O(k))
  const numericTokenPrice = tokenPrice !== null && tokenPrice !== undefined && tokenPrice !== ''
    ? Number(tokenPrice)
    : null;

  const chartData = generateGrowthTimeSeries(
    P,
    r,
    n,
    durationYears,
    durationDays,
    numericTokenPrice
  );

  const result = {
    principal: +P.toFixed(6),
    apy: +statedApyPercent.toFixed(4),
    effectiveApy: +effectiveApyPercent.toFixed(4),
    totalReturnPercent: +totalReturnPercent.toFixed(4),
    duration: dur,
    durationUnit: (durationUnit || 'days').toLowerCase(),
    durationYears: +durationYears.toFixed(4),
    durationDays: Math.round(durationDays),
    compoundingFrequency: freq,
    compoundingPeriodsPerYear: n,
    projectedFinalBalance: +finalBalance.toFixed(6),
    totalRewardsEarned: +totalRewards.toFixed(6),
    timeSeries: chartData,
  };

  if (numericTokenPrice && numericTokenPrice > 0) {
    result.tokenPriceUsd = +numericTokenPrice.toFixed(4);
    result.initialInvestmentUsd = +(P * numericTokenPrice).toFixed(2);
    result.projectedFinalBalanceUsd = +(finalBalance * numericTokenPrice).toFixed(2);
    result.totalRewardsEarnedUsd = +(totalRewards * numericTokenPrice).toFixed(2);
  }

  return result;
}

module.exports = {
  COMPOUNDING_PERIODS,
  normalizeDuration,
  calculateBalanceAtTime,
  generateGrowthTimeSeries,
  calculateStakingRewards,
};
