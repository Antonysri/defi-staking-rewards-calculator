const request = require('supertest');
const app = require('../../server');

describe('Staking API Integration Tests - POST /api/calculate-rewards', () => {
  describe('Success Scenarios (200 OK)', () => {
    test('calculates rewards for a valid daily-compounding payload', async () => {
      const payload = {
        principal: 1000,
        apy: 5,
        duration: 365,
        durationUnit: 'days',
        compoundingFrequency: 'daily',
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      const { data } = response.body;
      expect(data.principal).toBe(1000);
      expect(data.apy).toBe(5);
      expect(data.duration).toBe(365);
      expect(data.durationUnit).toBe('days');
      expect(data.compoundingFrequency).toBe('daily');
      expect(data.projectedFinalBalance).toBeCloseTo(1051.27, 1);
      expect(data.totalRewardsEarned).toBeCloseTo(51.27, 1);
      expect(Array.isArray(data.timeSeries)).toBe(true);
      expect(data.timeSeries.length).toBeGreaterThan(0);
    });

    test('calculates with optional token price for USD projection', async () => {
      const payload = {
        principal: 2500,
        apy: 8.5,
        duration: 12,
        durationUnit: 'months',
        compoundingFrequency: 'monthly',
        tokenPrice: 2.50,
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(200);

      const { data } = response.body;
      expect(data.tokenPriceUsd).toBe(2.50);
      expect(data.initialInvestmentUsd).toBe(6250.00);
      expect(data.projectedFinalBalanceUsd).toBeDefined();
      expect(data.totalRewardsEarnedUsd).toBeDefined();
    });

    test('supports zero APY edge case', async () => {
      const payload = {
        principal: 500,
        apy: 0,
        duration: 30,
        durationUnit: 'days',
        compoundingFrequency: 'daily',
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(200);

      const { data } = response.body;
      expect(data.projectedFinalBalance).toBe(500);
      expect(data.totalRewardsEarned).toBe(0);
    });

    test('supports fractional durations (e.g. 1.5 years)', async () => {
      const payload = {
        principal: 1000,
        apy: 6,
        duration: 1.5,
        durationUnit: 'years',
        compoundingFrequency: 'annually',
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(200);

      const { data } = response.body;
      expect(data.durationYears).toBe(1.5);
      expect(data.projectedFinalBalance).toBeGreaterThan(1000);
    });
  });

  describe('Validation & Error Handling Scenarios (400 Bad Request)', () => {
    test('rejects missing principal', async () => {
      const payload = {
        apy: 5,
        duration: 365,
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Principal amount is required.');
    });

    test('rejects non-numeric principal', async () => {
      const payload = {
        principal: 'invalid-amount',
        apy: 5,
        duration: 365,
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Principal must be a valid number.');
    });

    test('rejects negative principal', async () => {
      const payload = {
        principal: -100,
        apy: 5,
        duration: 365,
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Principal must be greater than 0.');
    });

    test('rejects negative APY', async () => {
      const payload = {
        principal: 1000,
        apy: -5,
        duration: 365,
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('APY cannot be negative (must be >= 0).');
    });

    test('rejects invalid compounding frequency', async () => {
      const payload = {
        principal: 1000,
        apy: 5,
        duration: 365,
        compoundingFrequency: 'hourly',
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors.some(e => e.includes('Invalid compoundingFrequency'))).toBe(true);
    });

    test('rejects invalid duration unit', async () => {
      const payload = {
        principal: 1000,
        apy: 5,
        duration: 365,
        durationUnit: 'decades',
      };

      const response = await request(app)
        .post('/api/calculate-rewards')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors.some(e => e.includes('Invalid durationUnit'))).toBe(true);
    });

    test('rejects empty body', async () => {
      const response = await request(app)
        .post('/api/calculate-rewards')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Route Not Found (404)', () => {
    test('returns 404 for nonexistent API route', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('API route not found');
    });
  });
});
