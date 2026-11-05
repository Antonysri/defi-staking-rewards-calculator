import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  DurationUnit,
  CompoundingFrequency,
} from './types';
import CalculateIcon from '@mui/icons-material/Calculate';
import RefreshIcon from '@mui/icons-material/Refresh';

interface CalculatorFormProps {
  formValues: {
    principal: string;
    apy: string;
    duration: string;
    durationUnit: DurationUnit;
    compoundingFrequency: CompoundingFrequency;
    tokenPrice: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onReset: () => void;
}

const DURATION_PRESETS = [
  { label: '30 Days', duration: '30', unit: 'days' as DurationUnit },
  { label: '90 Days', duration: '90', unit: 'days' as DurationUnit },
  { label: '180 Days', duration: '180', unit: 'days' as DurationUnit },
  { label: '1 Year', duration: '1', unit: 'years' as DurationUnit },
  { label: '2 Years', duration: '2', unit: 'years' as DurationUnit },
];

const APY_PRESETS = ['5', '8', '12', '18'];

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  formValues,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2.5}>
        {/* Principal Amount */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Principal Amount"
            placeholder="1000"
            value={formValues.principal}
            onChange={(e) => onInputChange('principal', e.target.value)}
            error={Boolean(errors.principal)}
            helperText={errors.principal || 'Initial tokens to stake'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#127C71' }}>
                    TOKENS
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Annual Percentage Yield (APY) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Annual Percentage Yield (APY)"
            placeholder="5.0"
            value={formValues.apy}
            onChange={(e) => onInputChange('apy', e.target.value)}
            error={Boolean(errors.apy)}
            helperText={errors.apy || 'Nominal annual staking rate (%)'}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          {/* Quick APY pills */}
          <Box sx={{ display: 'flex', gap: 0.8, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">
              Presets:
            </Typography>
            {APY_PRESETS.map((preset) => (
              <Chip
                key={preset}
                label={`${preset}%`}
                size="small"
                clickable
                variant={formValues.apy === preset ? 'filled' : 'outlined'}
                onClick={() => onInputChange('apy', preset)}
                sx={{
                  height: 22,
                  fontSize: '11px',
                  backgroundColor: formValues.apy === preset ? '#00dbe3' : 'transparent',
                  color: formValues.apy === preset ? '#173039' : undefined,
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Staking Duration & Unit */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              sx={{ flex: 2 }}
              label="Staking Duration"
              placeholder="365"
              value={formValues.duration}
              onChange={(e) => onInputChange('duration', e.target.value)}
              error={Boolean(errors.duration)}
              helperText={errors.duration}
            />
            <TextField
              select
              sx={{ flex: 1.2 }}
              label="Unit"
              value={formValues.durationUnit}
              onChange={(e) => onInputChange('durationUnit', e.target.value)}
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="months">Months</MenuItem>
              <MenuItem value="years">Years</MenuItem>
            </TextField>
          </Box>
          {/* Quick Duration pills */}
          <Box sx={{ display: 'flex', gap: 0.8, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">
              Presets:
            </Typography>
            {DURATION_PRESETS.map((p) => {
              const isActive = formValues.duration === p.duration && formValues.durationUnit === p.unit;
              return (
                <Chip
                  key={p.label}
                  label={p.label}
                  size="small"
                  clickable
                  variant={isActive ? 'filled' : 'outlined'}
                  onClick={() => {
                    onInputChange('duration', p.duration);
                    onInputChange('durationUnit', p.unit);
                  }}
                  sx={{
                    height: 22,
                    fontSize: '11px',
                    backgroundColor: isActive ? '#00dbe3' : 'transparent',
                    color: isActive ? '#173039' : undefined,
                    fontWeight: 600,
                  }}
                />
              );
            })}
          </Box>
        </Grid>

        {/* Compounding Frequency */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Compounding Frequency"
            value={formValues.compoundingFrequency}
            onChange={(e) => onInputChange('compoundingFrequency', e.target.value)}
            helperText="Periods per year interest is reinvested"
          >
            <MenuItem value="daily">Daily (365 times/year)</MenuItem>
            <MenuItem value="weekly">Weekly (52 times/year)</MenuItem>
            <MenuItem value="monthly">Monthly (12 times/year)</MenuItem>
            <MenuItem value="annually">Annually (1 time/year)</MenuItem>
          </TextField>
        </Grid>

        {/* Optional Token Price */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Optional Token Price (USD)"
            placeholder="1.00"
            value={formValues.tokenPrice}
            onChange={(e) => onInputChange('tokenPrice', e.target.value)}
            error={Boolean(errors.tokenPrice)}
            helperText={errors.tokenPrice || 'Provide to view real-time USD valuation'}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        {/* Actions */}
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: { sm: 1 } }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <CalculateIcon />}
            sx={{
              backgroundColor: '#00dbe3',
              color: '#173039',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '15px',
              '&:hover': {
                backgroundColor: '#00b4c9',
              },
            }}
          >
            {isLoading ? 'Calculating...' : 'Calculate Rewards'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={onReset}
            disabled={isLoading}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              fontWeight: 600,
              py: 1.2,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '14px',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalculatorForm;
