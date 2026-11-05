/**
 * Staking Calculation Validator
 * Validates request payload for /api/calculate-rewards
 */

const ALLOWED_UNITS = ['days', 'months', 'years'];
const ALLOWED_FREQUENCIES = ['daily', 'weekly', 'monthly', 'annually'];

/**
 * Validates staking rewards calculation payload
 * @param {object} payload 
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateStakingPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: ['Request body must be a valid JSON object.'],
    };
  }

  const {
    principal,
    apy,
    duration,
    durationUnit,
    compoundingFrequency,
    tokenPrice,
  } = payload;

  // Validate Principal
  if (principal === undefined || principal === null || principal === '') {
    errors.push('Principal amount is required.');
  } else {
    const numPrincipal = Number(principal);
    if (isNaN(numPrincipal)) {
      errors.push('Principal must be a valid number.');
    } else if (numPrincipal <= 0) {
      errors.push('Principal must be greater than 0.');
    } else if (!isFinite(numPrincipal) || numPrincipal > 1e15) {
      errors.push('Principal exceeds the maximum allowed limit.');
    }
  }

  // Validate APY
  if (apy === undefined || apy === null || apy === '') {
    errors.push('APY is required.');
  } else {
    const numApy = Number(apy);
    if (isNaN(numApy)) {
      errors.push('APY must be a valid number.');
    } else if (numApy < 0) {
      errors.push('APY cannot be negative (must be >= 0).');
    } else if (!isFinite(numApy) || numApy > 10000) {
      errors.push('APY is out of acceptable bounds (maximum 10,000%).');
    }
  }

  // Validate Duration
  if (duration === undefined || duration === null || duration === '') {
    errors.push('Staking duration is required.');
  } else {
    const numDuration = Number(duration);
    if (isNaN(numDuration)) {
      errors.push('Duration must be a valid number.');
    } else if (numDuration <= 0) {
      errors.push('Duration must be greater than 0.');
    } else if (!isFinite(numDuration) || numDuration > 36500) {
      errors.push('Duration exceeds practical staking limits.');
    }
  }

  // Validate durationUnit (optional, default 'days')
  if (durationUnit !== undefined && durationUnit !== null && durationUnit !== '') {
    if (typeof durationUnit !== 'string' || !ALLOWED_UNITS.includes(durationUnit.toLowerCase())) {
      errors.push(`Invalid durationUnit. Allowed values are: ${ALLOWED_UNITS.join(', ')}.`);
    }
  }

  // Validate compoundingFrequency (optional, default 'daily')
  if (compoundingFrequency !== undefined && compoundingFrequency !== null && compoundingFrequency !== '') {
    if (
      typeof compoundingFrequency !== 'string' ||
      !ALLOWED_FREQUENCIES.includes(compoundingFrequency.toLowerCase())
    ) {
      errors.push(
        `Invalid compoundingFrequency. Allowed values are: ${ALLOWED_FREQUENCIES.join(', ')}.`
      );
    }
  }

  // Validate optional tokenPrice
  if (tokenPrice !== undefined && tokenPrice !== null && tokenPrice !== '') {
    const numTokenPrice = Number(tokenPrice);
    if (isNaN(numTokenPrice)) {
      errors.push('Token price must be a valid number.');
    } else if (numTokenPrice < 0) {
      errors.push('Token price cannot be negative.');
    } else if (!isFinite(numTokenPrice)) {
      errors.push('Token price is invalid.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  ALLOWED_UNITS,
  ALLOWED_FREQUENCIES,
  validateStakingPayload,
};
