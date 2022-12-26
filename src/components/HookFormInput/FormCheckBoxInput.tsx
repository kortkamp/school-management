import { Checkbox } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface Props {
  name: string;
  control?: Control<any>;
  editable?: boolean;
}

const FormCheckBoxInput = ({ name, control, editable = true }: Props) => {
  // const ControlledInput = ({ field: { onChange, value } }: { field: ControllerRenderProps<any, string> }) => (
  //   <CheckBox checked> </CheckBox>
  // );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: props }) => (
        <Checkbox
          {...props}
          checked={props.value}
          onChange={(e) => props.onChange(e.target.checked)}
          disabled={!editable}
        />
      )}
    />
  );
};

export default FormCheckBoxInput;
