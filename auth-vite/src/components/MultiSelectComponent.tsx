import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Box, SelectChangeEvent } from '@mui/material';

interface MultiSelectComponentProps {
  name: string;
  label: string;
  value: string[];
  options: { value: string; label: string }[];
  onChange: (name: string, value: string[]) => void;
}

const MultiSelectComponent: React.FC<MultiSelectComponentProps> = ({ name, label, value, options, onChange }) => {
  const handleChange = (e: SelectChangeEvent<string[]>) => {
    onChange(name, e.target.value as string[]);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        multiple // Enable multi-select
        inputProps={{ name }} // Pass the name attribute here
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectComponent;