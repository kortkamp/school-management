import clsx from 'clsx';
import { Theme, Grid, Button, CardContent, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ReactNode, useState } from 'react';
import AppButton from '../AppButton';

const useStyles = makeStyles((theme: Theme) => ({
  stepForm: {
    minWidth: '100%',
    color: theme.palette.text.primary,
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
    borderRadius: 5,

    zIndex: 999,
    '&:hover': {
      //you want this to be the same as the backgroundColor above
      backgroundColor: theme.palette.background.paper,
    },
  },

  stepLeft: {
    transform: 'translateX(-110%)',
  },
  stepRight: {
    transform: 'translateX(110%)',
  },

  step: {
    transition: 'transform 0.4s',
    position: 'absolute',
    top: '0px',
  },
  stepContainer: {
    position: 'relative',
    overflow: 'hidden',
    height: '640px',
  },

  card: {
    background: theme.palette.background.paper,

    // borderTopLeftRadius: '0',
    // borderTopRightRadius: '0',
    // zIndex: 999,
  },
}));
interface IStepTitle {
  name: string;
  isValid: boolean;
}
interface Props {
  stepTitles: IStepTitle[];
  forms: ReactNode[];
  isValid?: boolean;
  onStepChange?: (step: number) => void;
}
const AppStepSelector: React.FC<Props> = ({ stepTitles, forms, isValid = true, onStepChange = () => {} }) => {
  const classes = useStyles();

  const [step, setStep] = useState(0);

  // const stepClasses = titles.reduce((stepClassesReduce, tittle) => ({ ...stepClassesReduce, [tittle]: 2 }), {});

  const handleClickStep = (addStep: number) => {
    setStep((prevStep) => {
      onStepChange(prevStep + addStep);
      return prevStep + addStep;
    });
  };
  const handleStepTitleClick = (id: number) => {
    setStep(id);
    onStepChange(id);
  };

  const getStepClassName = (index: number) => {
    return classes.step + ' ' + (index < step ? classes.stepLeft : index > step ? classes.stepRight : '');
  };

  const StepButton = ({ id, title, size }: { id: number; title: String; size: number }) => (
    <Grid item md={size} sm={size} xs={size}>
      <Button
        onClick={() => handleStepTitleClick(id)}
        color="secondary"
        className={clsx(classes.stepForm, step === id && classes.selected)}
        disabled={step === id}
      >
        {title}
      </Button>
    </Grid>
  );

  return (
    <Paper style={{ minWidth: '100%' }} className={classes.card}>
      <Grid container spacing={0} style={{ minWidth: '100%' }}>
        {stepTitles.map((title, index) => (
          <StepButton key={index} id={index} title={title.name} size={12 / stepTitles.length} />
        ))}
      </Grid>
      <CardContent style={{ minWidth: '100%' }}>
        <Grid container className={classes.stepContainer}>
          {forms.map((form, index) => (
            <Grid item key={index} className={getStepClassName(index)}>
              {index === step && (
                <>
                  {form}
                  <Grid container justifyContent="center" alignItems="center">
                    {step < forms.length - 1 && (
                      <AppButton disabled={!isValid} onClick={() => handleClickStep(1)}>
                        Próximo
                      </AppButton>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default AppStepSelector;
