import { FormControl, FormLabel, RadioGroup, FormHelperText } from '@mui/material';
import { ReactNode } from 'react';
import { Control, Controller, ControllerRenderProps } from 'react-hook-form';

interface Props {
  name: string;
  control?: Control<any>;
  label?: string;
  editable?: boolean;
  errorMessage?: string;
  children: ReactNode;
}

const FormRadioInput = ({ name, control, label, errorMessage, children }: Props) => {
  const ControlledInput = ({ field: { onChange, value } }: { field: ControllerRenderProps<any, string> }) => (
    <FormControl error={!!errorMessage}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup name={name} value={value} onChange={onChange}>
        {children}
      </RadioGroup>
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );

  return <Controller name={name} control={control} render={ControlledInput} />;
};

export default FormRadioInput;
