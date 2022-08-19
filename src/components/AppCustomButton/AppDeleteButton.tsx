import AppButton from '../AppButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonProps } from '@mui/material';
interface Props extends ButtonProps {
  loading?: boolean;
}
/**
 * Application styled Material UI Save Button
 * @class AppClearButton
 */
const AppDeleteButton: React.FC<Props> = ({ ...restOfProps }) => {
  return (
    <AppButton color="error" startIcon={<DeleteIcon />} {...{ ...restOfProps }}>
      Apagar
    </AppButton>
  );
};

export default AppDeleteButton;
