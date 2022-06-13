import clsx from 'clsx';
import { Theme, AppBar, Toolbar, Typography, Grid, Button, CardContent, Card, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  stepForm: {
    minWidth: '100%',
    color: theme.palette.info.main,
    background: theme.palette.background.default,
    border: 'none',
    boxShadow: 'inset 0 -4px 3px -3px rgb(0 0 0 / 20%)',
    borderRadius: 0,
    transition: 'box-shadow 800ms',
  },

  selected: {
    background: theme.palette.background.paper,
    boxShadow: '0px -1px 1px 0px rgb(0 0 0 / 20%)',
    transition: 'box-shadow 800ms',
    zIndex: 999,
    '&:hover': {
      //you want this to be the same as the backgroundColor above
      backgroundColor: theme.palette.background.paper,
    },
  },

  card: {
    background: theme.palette.background.paper,

    // borderTopLeftRadius: '0',
    // borderTopRightRadius: '0',
    // zIndex: 999,
  },
}));

interface Props {
  step: number;
  setStep: (step: number) => void;
  titles: string[];
  children: ReactNode;
}
const AppStepSelector: React.FC<Props> = ({ step, setStep, titles, children }) => {
  const classes = useStyles();

  const StepButton = ({ id, title, size }: { id: number; title: String; size: number }) => (
    <Grid item md={size} sm={size} xs={size}>
      <Button
        onClick={() => setStep(id)}
        className={clsx(classes.stepForm, step === id && classes.selected)}
        // disabled={step === id}
      >
        {title}
      </Button>
    </Grid>
  );

  return (
    <Paper style={{ minWidth: '100%' }} className={classes.card}>
      <Grid container spacing={0} style={{ minWidth: '100%' }}>
        {titles.map((title, index) => (
          <StepButton key={index} id={index} title={title} size={12 / titles.length} />
        ))}
      </Grid>
      <CardContent style={{ minWidth: '100%' }}>{children}</CardContent>
    </Paper>
  );
};

export default AppStepSelector;
