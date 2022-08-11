import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  formBody: {
    marginTop: theme.spacing(10),
    width: '100%',
    maxWidth: '40rem', // 1000px
  },
  paragraph: {
    // marginTop: theme.spacing(2),
  },
  box: {
    // height: 300,

    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(),
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      opacity: [0.9, 0.8, 0.7],
    },
  },
}));
/**
 * Renders "Welcome" view
 * url: /bem-vindo *
 */
const WelcomeView = () => {
  const classes = useStyles();

  const pendencies = [
    {
      id: 1,
      text: 'No segundo passo nós vamos definir como é o funcionamento da sua instituição, por exemplo, como são calculadas as notas, como o ano letivo é dividido , etc',
    },
    {
      id: 2,
      text: 'Cadastrar as datas dos períodos do ano letivo',
    },
    {
      id: 3,
      text: 'Nesta etapa vamos definir os horários de aula da instituição',
    },
  ];

  return (
    <Grid container direction="column" alignItems="center">
      <Box className={classes.formBody}>
        <Typography className={classes.paragraph} variant="h5">
          Bem vindo
        </Typography>

        <Typography className={classes.paragraph} variant="body1">
          Para começar a utilizar o sistema primeiramente será necessário realizar os passos abaixo:
        </Typography>

        {pendencies.map((pendencie) => (
          <Box key={pendencie.id} className={classes.box}>
            <Typography className={classes.paragraph} variant="body1">
              {pendencie.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default WelcomeView;
