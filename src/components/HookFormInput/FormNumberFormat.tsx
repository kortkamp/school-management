import { TextField, StandardTextFieldProps } from '@mui/material';
import { Control, Controller, ControllerRenderProps } from 'react-hook-form';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

interface Props extends NumberFormatProps<StandardTextFieldProps> {
  name: string;
  control?: Control<any>;
  label?: string;
  editable?: boolean;
  errorMessage?: string;
  format?: string | undefined;
  loading?: boolean;
}

const FormNumberFormat = ({
  name,
  control,
  label,
  errorMessage,
  editable = true,
  format,

  loading = false,
  ...restOfProps
}: Props) => {
  const ControlledInput = ({ field: { value, onChange } }: { field: ControllerRenderProps<any, string> }) => (
    <NumberFormat
      format={format}
      customInput={TextField}
      variant="standard"
      label={label}
      value={loading ? '' : value}
      error={!!errorMessage}
      helperText={errorMessage || ' '}
      onValueChange={({ value: v }) => {
        onChange({ target: { name, value: v } });
      }}
      {...restOfProps}
      InputProps={{
        readOnly: !editable,
      }}
    />
  );

  return <Controller name={name} control={control} render={ControlledInput} />;
};

export default FormNumberFormat;
