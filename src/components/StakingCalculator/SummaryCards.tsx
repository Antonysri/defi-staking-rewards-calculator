import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { StakingCalculationData } from './types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PercentIcon from '@mui/icons-material/Percent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SummaryCardsProps {
  data: StakingCalculationData;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const hasUsd = Boolean(data.tokenPriceUsd && data.tokenPriceUsd > 0);

  return (
    <Grid container spacing={2}>
      {/* Projected Final Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: '12px',
            border: '1px solid rgba(0, 219, 227, 0.3)',
            background: 'linear-gradient(135deg, #173039 0%, #1e4552 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#00dbe3', fontWeight: 600 }}>
                Final Projected Balance
              </Typography>
              <AccountBalanceWalletIcon sx={{ color: '#00dbe3', fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
              {data.projectedFinalBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            {hasUsd && data.projectedFinalBalanceUsd !== undefined && (
              <Typography variant="caption" sx={{ color: '#9FF1D2', display: 'block', mt: 0.5, fontWeight: 600 }}>
                ≈ ${data.projectedFinalBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Total Rewards Earned */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: '12px',
            border: '1px solid rgba(18, 124, 113, 0.4)',
            background: 'linear-gradient(135deg, #0e4e46 0%, #127C71 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(18, 124, 113, 0.15)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#9FF1D2', fontWeight: 600 }}>
                Total Rewards Earned
              </Typography>
              <AutoAwesomeIcon sx={{ color: '#9FF1D2', fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', letterSpacing: -0.5 }}>
              +{data.totalRewardsEarned.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            {hasUsd && data.totalRewardsEarnedUsd !== undefined && (
              <Typography variant="caption" sx={{ color: '#FDE6A8', display: 'block', mt: 0.5, fontWeight: 600 }}>
                ≈ +${data.totalRewardsEarnedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Effective APY */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Effective APY
              </Typography>
              <PercentIcon sx={{ color: '#00b4c9', fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#173039' }}>
              {data.effectiveApy.toFixed(2)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Nominal {data.apy}% · {data.compoundingFrequency}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Return % */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Yield Return
              </Typography>
              <TrendingUpIcon sx={{ color: '#127C71', fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#127C71' }}>
              +{data.totalReturnPercent.toFixed(2)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Over {data.duration} {data.durationUnit} ({data.durationDays} days)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
