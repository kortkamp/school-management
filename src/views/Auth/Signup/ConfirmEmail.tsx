import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardContent, TextField, Grid, CardActions } from '@mui/material';
import { SHARED_CONTROL_PROPS } from '../../../utils/form';
import { AppButton, AppForm, AppLoading } from '../../../components';
import { sessionService } from '../../../services/auth.service';
import { useAppMessage } from '../../../utils/message';

const TOKEN_QUERY_PARAM = 'token';

/**
 * Renders "Confirm Email" view for Signup flow
 * url: /auth/signup/confirm-email
 */
const ConfirmEmailView = () => {
  const [email, setEmail] = useState<string>('');

  const [AppMessage, setMessage] = useAppMessage();

  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState(true);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const token = useQuery().get(TOKEN_QUERY_PARAM) || '';
  console.log('token:', token);

  useEffect(() => {
    let componentMounted = true;
    let gotEmail: string = '';
    async function fetchData() {
      try {
        const response = await sessionService.confirmEmail(token);
        gotEmail = response.email;
        setMessage({ type: 'success', text: 'Confirmação de cadastro realizada com sucesso' });
        setSuccess(true);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.response.data.message });
        console.log(err);
      }

      if (!componentMounted) return;
      setEmail(gotEmail);
      setLoading(false);
    }
    fetchData();

    return () => {
      componentMounted = false;
    };
  }, []);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <AppForm>
      <Grid marginTop={10}>
        <Card>
          <CardHeader title="Confirmação de Cadastro" />
          <CardContent>
            <TextField disabled label="Email" name="email" value={email} helperText=" " {...SHARED_CONTROL_PROPS} />
            <AppMessage />
          </CardContent>
          <CardActions>
            <Grid container justifyContent={'center'}>
              {success && <AppButton href="/auth/login">Acessar o Sistema</AppButton>}
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </AppForm>
  );
};

export default ConfirmEmailView;
