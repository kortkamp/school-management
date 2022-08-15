import AppButton from '../AppButton';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { ButtonProps } from '@mui/material';
interface Props extends ButtonProps {
  loading?: boolean;
}
/**
 * Application styled Material UI Save Button
 * @class AppClearButton
 */
const AppClearButton: React.FC<Props> = ({ ...restOfProps }) => {
  return (
    <AppButton color="warning" startIcon={<BackspaceIcon />} {...{ ...restOfProps }}>
      Limpar
    </AppButton>
  );
};

export default AppClearButton;
