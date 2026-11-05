const express = require('express');
const router = express.Router();
const { calculateRewards } = require('../../controllers/stakingController');

/**
 * @route   POST /api/calculate-rewards
 * @desc    Calculate projected staking balance, rewards, and growth time-series
 * @access  Public
 */
router.post('/calculate-rewards', calculateRewards);

module.exports = router;
