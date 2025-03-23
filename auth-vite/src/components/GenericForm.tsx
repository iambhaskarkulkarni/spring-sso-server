import React from 'react';
import { Box, Checkbox } from '@mui/material';
import TextFieldComponent from './TextFieldComponent';
import SingleSelectComponent from './SingleSelectComponent';
import MultiSelectComponent from './MultiSelectComponent';

interface FormField {
  type: string;
  name: string;
  label: string;
  options?: { value: string; label: string }[];
}

interface GenericFormProps {
  formConfig: FormField[];
  formData: Record<string, any>;
  onChange: (name: string, value: string | string[]) => void;
}

const GenericForm: React.FC<GenericFormProps> = ({ formConfig, formData, onChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {formConfig.map((field) => (
        <Box
          key={field.name}
          sx={{
            flex: 1,
            minWidth: '40%',
          }}
        >
          {field.type === 'text' && (
            <TextFieldComponent
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={onChange}
            />
          )}
          {field.type === 'single-select' && (
            <SingleSelectComponent
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              options={field.options || []}
              onChange={onChange}
            />
          )}
          {field.type === 'multi-select' && (
            <MultiSelectComponent
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              options={field.options || []}
              onChange={onChange}
            />
          )}
           {/* {field.type === 'checkbox' && (
            <Checkbox
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              options={field.options || []}
            />
          )} */}
        </Box>
      ))}
    </Box>
  );
};

export default GenericForm;