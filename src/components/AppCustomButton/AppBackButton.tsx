import AppButton from '../AppButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonProps } from '@mui/material';
import { useHistory } from 'react-router-dom';

interface Props extends ButtonProps {
  loading?: boolean;
  label?: string;
}

/**
 * Application styled Material UI Back Button
 * @class AppBackButton
 */
const AppBackButton: React.FC<Props> = ({ label, ...restOfProps }) => {
  const history = useHistory();

  return (
    <AppButton color="info" startIcon={<ArrowBackIcon />} {...{ ...restOfProps }} onClick={() => history.goBack()}>
      {label || 'Voltar'}
    </AppButton>
  );
};

export default AppBackButton;
