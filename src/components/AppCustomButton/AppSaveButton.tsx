import AppButton from '../AppButton';
import SaveIcon from '@mui/icons-material/Save';
import { ButtonProps } from '@mui/material';
interface Props extends ButtonProps {
  loading?: boolean;
  label?: string;
}
/**
 * Application styled Material UI Save Button
 * @class AppSaveButton
 */
const AppSaveButton: React.FC<Props> = ({ label, ...restOfProps }) => {
  return (
    <AppButton color="success" startIcon={<SaveIcon />} {...{ ...restOfProps }}>
      {label || 'Salvar'}
    </AppButton>
  );
};

export default AppSaveButton;
