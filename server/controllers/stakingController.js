/**
 * Staking Controller
 * Orchestrates request parsing, validation, service computation, and error responses.
 */

const { validateStakingPayload } = require('../validators/stakingValidator');
const stakingService = require('../services/stakingService');

/**
 * POST /api/calculate-rewards
 */
function calculateRewards(req, res, next) {
  try {
    const validation = validateStakingPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for staking parameters.',
        errors: validation.errors,
      });
    }

    const result = stakingService.calculateStakingRewards(req.body);

    return res.status(200).json({
      success: true,
      message: 'Staking rewards calculated successfully.',
      data: result,
    });
  } catch (error) {
    // Forward unexpected exceptions to centralized error handling middleware
    return next(error);
  }
}

module.exports = {
  calculateRewards,
};
