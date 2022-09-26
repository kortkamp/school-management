import { Box, Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { AppButton, AppLink } from '../../components';

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    marginTop: theme.spacing(10),
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: theme.palette.primary.light,
    // width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 500,
  },
  text: {
    marginTop: theme.spacing(5),
  },
  button: {
    marginTop: theme.spacing(5),

    fontSize: 20,
  },
}));
/**
 * Renders "Welcome" view
 * url: /bem-vindo *
 */
const WelcomeView = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Card className={classes.welcomeCard}>
        <Typography className={classes.title}>BEM VINDO!</Typography>

        <Typography className={classes.text}>
          Sua instituição foi cadastrada com sucesso, agora já pode iniciar os trabalhos.
        </Typography>
        <AppLink to="/">
          <AppButton color="primary" className={classes.button}>
            Iniciar
          </AppButton>
        </AppLink>
      </Card>
    </Box>
  );
};

export default WelcomeView;
