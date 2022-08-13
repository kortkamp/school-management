import AppButton from '../AppButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ButtonProps } from '@mui/material';

/**
 * Application styled Material UI Save Button
 * @class AppAddButton
 */
const AppAddButton: React.FC<ButtonProps> = ({ ...restOfProps }) => {
  return (
    <AppButton color="info" startIcon={<AddCircleIcon />} {...{ ...restOfProps }}>
      Adicionar
    </AppButton>
  );
};

export default AppAddButton;
