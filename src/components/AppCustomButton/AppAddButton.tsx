import AppButton from '../AppButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
  loading?: boolean;
}

/**
 * Application styled Material UI Save Button
 * @class AppAddButton
 */
const AppAddButton: React.FC<Props> = ({ ...restOfProps }) => {
  return (
    <AppButton color="info" startIcon={<AddCircleIcon />} {...{ ...restOfProps }}>
      Adicionar
    </AppButton>
  );
};

export default AppAddButton;
