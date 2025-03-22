import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TextFieldComponentProps extends Omit<TextFieldProps, 'onChange'> {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ name, value, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <TextField
      fullWidth
      name={name}
      value={value}
      onChange={handleChange} // Use the typed handler
      {...props}
    />
  );
};

export default TextFieldComponent;