import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesPoint } from './types';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TollIcon from '@mui/icons-material/Toll';

interface GrowthChartProps {
  data: TimeSeriesPoint[];
  hasUsd: boolean;
}

const CustomTooltip = ({ active, payload, label, isUsd }: any) => {
  if (active && payload && payload.length) {
    const point: TimeSeriesPoint = payload[0].payload;
    return (
      <Paper
        elevation={4}
        sx={{
          padding: '12px 16px',
          backgroundColor: 'rgba(23, 48, 57, 0.95)',
          color: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #00dbe3',
          boxShadow: '0 8px 24px rgba(0, 219, 227, 0.2)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#00dbe3', mb: 0.5 }}>
          {point.timeLabel} (Day {point.day})
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontSize: '13px' }}>
            <strong>Balance:</strong>{' '}
            {isUsd && point.balanceUsd !== undefined
              ? `$${point.balanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : `${point.balance.toLocaleString()} TOKENS`}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '13px', color: '#9FF1D2' }}>
            <strong>Rewards:</strong>{' '}
            {isUsd && point.rewardsEarnedUsd !== undefined
              ? `+$${point.rewardsEarnedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : `+${point.rewardsEarned.toLocaleString()} TOKENS`}
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

const GrowthChart: React.FC<GrowthChartProps> = ({ data, hasUsd }) => {
  const [viewMode, setViewMode] = useState<'tokens' | 'usd'>('tokens');

  const isUsd = hasUsd && viewMode === 'usd';
  const dataKey = isUsd ? 'balanceUsd' : 'balance';

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShowChartIcon sx={{ color: '#00dbe3', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#173039' }}>
            Projected Growth Curve
          </Typography>
        </Box>

        {hasUsd && (
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            sx={{
              backgroundColor: '#f4f6f8',
              borderRadius: '6px',
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '12px',
                py: 0.5,
                px: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#00dbe3',
                  color: '#173039',
                  '&:hover': { backgroundColor: '#00b4c9' },
                },
              },
            }}
          >
            <ToggleButton value="tokens">
              <TollIcon sx={{ fontSize: 16, mr: 0.5 }} /> Token Balance
            </ToggleButton>
            <ToggleButton value="usd">
              <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} /> USD Value
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00dbe3" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#00b4c9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) =>
                isUsd ? `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}` : value
              }
            />
            <Tooltip content={<CustomTooltip isUsd={isUsd} />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#00b4c9"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#balanceGradient)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default GrowthChart;
