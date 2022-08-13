import AppButton from '../AppButton';
import SaveIcon from '@mui/icons-material/Save';
import { ButtonProps } from '@mui/material';
interface Props extends ButtonProps {
  loading?: boolean;
}
/**
 * Application styled Material UI Save Button
 * @class AppSaveButton
 */
const AppSaveButton: React.FC<Props> = ({ ...restOfProps }) => {
  return (
    <AppButton color="success" startIcon={<SaveIcon />} {...{ ...restOfProps }}>
      Salvar
    </AppButton>
  );
};

export default AppSaveButton;
