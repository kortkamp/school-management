import { Box, Button, Card, CardContent, CardHeader, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DoneIcon from '@mui/icons-material/Done';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.success.light,
    color: theme.palette.error.contrastText,
  },
  cardContent: {
    height: 160,
    width: 350,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: theme.palette.success.light,
  },
  successIcon: {
    fontSize: 100,
  },
}));

const RegistrationSuccess = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Card>
        <CardHeader
          avatar={<DoneIcon className={classes.successIcon}></DoneIcon>}
          className={classes.cardHeader}
        ></CardHeader>
        <CardContent className={classes.cardContent}>
          <Typography variant="body1">Parabéns, a instituição foi cadastrada com sucesso!</Typography>
          <Button>Sair</Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegistrationSuccess;
