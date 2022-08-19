import AppButton from '../AppButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
  loading?: boolean;
  label?: string;
}

/**
 * Application styled Material UI Save Button
 * @class AppAddButton
 */
const AppAddButton: React.FC<Props> = ({ label, ...restOfProps }) => {
  return (
    <AppButton color="info" startIcon={<AddCircleIcon />} {...{ ...restOfProps }}>
      {label || 'Adicionar'}
    </AppButton>
  );
};

export default AppAddButton;
