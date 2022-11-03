import { TextField, StandardTextFieldProps, InputAdornment, Tooltip } from '@mui/material';
import { Control, Controller, ControllerRenderProps } from 'react-hook-form';

interface Props extends StandardTextFieldProps {
  name: string;
  control?: Control<any>;
  label?: string;
  editable?: boolean;
  errorMessage?: string;
  suffix?: string;
  toolTipMessage?: string;
  loading?: boolean;
  customOnChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormStandardInput = ({
  name,
  control,
  label,
  errorMessage,
  editable = true,
  inputProps,
  suffix,
  children,
  toolTipMessage,
  loading = false,
  customOnChange = () => {},
  ...restOfProps
}: Props) => {
  const ControlledInput = ({ field: { onChange, value } }: { field: ControllerRenderProps<any, string> }) => (
    <Tooltip title={toolTipMessage || ''}>
      <TextField
        variant="standard"
        label={label}
        value={loading ? '' : value || ''}
        onChange={(e) => {
          onChange(e);
          customOnChange(e);
        }}
        error={!!errorMessage}
        helperText={errorMessage || ' '}
        {...restOfProps}
        InputProps={{
          readOnly: !editable,
          endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
        }}
      >
        {children}
      </TextField>
    </Tooltip>
  );

  return <Controller name={name} control={control} render={ControlledInput} />;
};

export default FormStandardInput;
