import { TextField, StandardTextFieldProps, InputAdornment } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface Props extends StandardTextFieldProps {
  name: string;
  control?: Control<any>;
  label?: string;
  editable?: boolean;
  errorMessage?: string;
  suffix?: string;
}

const FormOutlinedInput = ({
  name,
  control,
  label,
  errorMessage,
  editable = true,
  inputProps,
  suffix,
  ...restOfProps
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          name="course-name"
          variant="outlined"
          label={label}
          value={value}
          onChange={onChange}
          style={{ width: 400 }}
          error={!!errorMessage}
          helperText={errorMessage}
          {...restOfProps}
          InputProps={{
            readOnly: !editable,
            endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
          }}
        />
      )}
    />
  );
};

export default FormOutlinedInput;
