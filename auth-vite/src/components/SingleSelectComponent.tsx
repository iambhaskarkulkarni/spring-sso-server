import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SingleSelectComponentProps {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
}

const SingleSelectComponent: React.FC<SingleSelectComponentProps> = ({ name, label, value, options, onChange }) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(name, e.target.value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        inputProps={{ name }} // Pass the name attribute here
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

export default SingleSelectComponent;