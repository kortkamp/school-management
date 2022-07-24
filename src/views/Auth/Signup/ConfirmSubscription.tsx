import { Card, CardHeader, CardContent, Typography, Grid } from '@mui/material';

/**
 * Renders "Confirm Registration Success" view for Signup flow
 * url: /auth/signup/confirm-registration
 */
const ConfirmSubscription = () => {
  return (
    <Grid container textAlign={'center'} marginTop={10} justifyContent={'center'}>
      <Grid item md={6} sm={12} xs={12}>
        <Card>
          <CardHeader title="Sucesso" />
          <CardContent>
            <Typography variant="body1">
              Sua inscrição foi realizada com sucesso. Você receberá um e-mail com um link para finalizar seu cadastro.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ConfirmSubscription;
