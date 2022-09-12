import { TextField, StandardTextFieldProps } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface Props extends StandardTextFieldProps {
  name: string;
  control?: Control<any>;
  label?: string;
  editable?: boolean;
  errorMessage?: string;
}

const FormInput = ({ name, control, label, errorMessage, editable = true, ...restOfProps }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          name="course-name"
          variant="standard"
          label={editable ? label : ''}
          value={value}
          onChange={onChange}
          style={{ width: 400 }}
          error={!!errorMessage}
          helperText={errorMessage}
          {...restOfProps}
          InputProps={{
            readOnly: !editable,
            disableUnderline: !editable,
            style: { fontSize: 30 },
          }}
        />
      )}
    />
  );
};

export default FormInput;
